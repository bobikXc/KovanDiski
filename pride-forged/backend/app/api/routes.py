import logging
import time
from collections import defaultdict, deque
from typing import Annotated

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    Request,
    Response,
    UploadFile,
    status,
)
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Brand, Fitment, VehicleModel, Wheel
from app.schemas import BrandDetail, BrandRead, FitmentRead, VehicleModelRead, WheelRead
from app.services.email import send_lead_email
from app.services.telegram import (
    TelegramFile,
    format_contact_messages,
    format_lead_message,
    send_contact_to_telegram,
)

router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

MAX_CONTACT_FILES = 5
MAX_CONTACT_FILE_SIZE = 10 * 1024 * 1024
MIN_FORM_FILL_SECONDS = 2
RATE_LIMIT_SHORT_WINDOW_SECONDS = 10 * 60
RATE_LIMIT_SHORT_MAX_REQUESTS = 3
RATE_LIMIT_DAY_WINDOW_SECONDS = 24 * 60 * 60
RATE_LIMIT_DAY_MAX_REQUESTS = 10
ALLOWED_CONTACT_FILE_TYPES = {
    "image/jpeg": {".jpg", ".jpeg"},
    "image/png": {".png"},
    "image/webp": {".webp"},
}
CONTACT_METHOD_ALIASES = {
    "phone": "call",
    "tel": "call",
    "telephone": "call",
    "звонок": "call",
    "телефон": "call",
    "telegram": "telegram",
    "tg": "telegram",
    "whatsapp": "whatsapp",
    "wa": "whatsapp",
    "max": "max",
}
PUBLIC_READ_CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300"
_lead_rate_limit_events: dict[str, deque[float]] = defaultdict(deque)


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=5, max_length=30)
    car: str | None = Field(default=None, max_length=150)
    message: str | None = Field(default=None, max_length=2000)
    source: str | None = Field(default="site", max_length=300)
    website: str | None = Field(default=None, max_length=300)
    company_url: str | None = Field(default=None, max_length=300)
    form_started_at: str | None = Field(default=None, max_length=40)


def _required_form_value(value: str, field_name: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise HTTPException(
            status_code=422, detail=f"Поле «{field_name}» обязательно"
        )
    return normalized


def _mark_public_read_response(response: Response) -> None:
    response.headers["Cache-Control"] = PUBLIC_READ_CACHE_CONTROL
    response.headers["X-RateLimit-Bypass"] = "public-read"
    response.headers["X-Overload-Protection-Bypass"] = "public-read"


async def _validate_contact_files(files: list[UploadFile]) -> list[TelegramFile]:
    if len(files) > MAX_CONTACT_FILES:
        raise HTTPException(
            status_code=422,
            detail=f"Можно прикрепить не более {MAX_CONTACT_FILES} файлов",
        )

    validated: list[TelegramFile] = []
    if not files:
        logger.info("photo missing")

    for upload in files:
        filename = upload.filename or "photo"
        suffix = f".{filename.rsplit('.', 1)[-1].lower()}" if "." in filename else ""
        allowed_suffixes = ALLOWED_CONTACT_FILE_TYPES.get(upload.content_type or "")
        if not allowed_suffixes or suffix not in allowed_suffixes:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Файл «{filename}» имеет неподдерживаемый тип. "
                    "Разрешены JPG, PNG и WEBP"
                ),
            )

        content = await upload.read(MAX_CONTACT_FILE_SIZE + 1)
        if len(content) > MAX_CONTACT_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=(
                    f"Файл «{filename}» превышает максимальный размер 10 МБ"
                ),
            )
        if not content:
            raise HTTPException(status_code=422, detail=f"Файл «{filename}» пуст")

        logger.info(
            "photo received filename=%s type=%s size=%s",
            filename,
            upload.content_type or "unknown",
            len(content),
        )
        validated.append(
            TelegramFile(filename=filename, content_type=upload.content_type or "", content=content)
        )

    return validated


def _normalize_contact_method(value: str | None) -> str:
    normalized = (value or "").strip().lower()
    return CONTACT_METHOD_ALIASES.get(normalized, "call")


def _client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        first_ip = forwarded_for.split(",", 1)[0].strip()
        if first_ip:
            return first_ip

    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()

    return request.client.host if request.client else "unknown"


def _is_honeypot_filled(*values: str | None) -> bool:
    return any((value or "").strip() for value in values)


def _is_too_fast_submission(form_started_at: str | None) -> bool:
    if not form_started_at:
        return False

    try:
        started_at = float(form_started_at)
    except ValueError:
        return False

    if started_at > 1_000_000_000_000:
        started_at = started_at / 1000

    now = time.time()
    if started_at > now + 5:
        return True

    return now - started_at < MIN_FORM_FILL_SECONDS


def _check_lead_rate_limit(client_ip: str) -> None:
    now = time.time()
    events = _lead_rate_limit_events[client_ip]

    while events and events[0] <= now - RATE_LIMIT_DAY_WINDOW_SECONDS:
        events.popleft()

    short_count = sum(1 for timestamp in events if timestamp > now - RATE_LIMIT_SHORT_WINDOW_SECONDS)
    if short_count >= RATE_LIMIT_SHORT_MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много заявок. Попробуйте позже.",
            headers={
                "Retry-After": str(RATE_LIMIT_SHORT_WINDOW_SECONDS),
                "X-RateLimit-Reason": "lead-short-window",
                "X-RateLimit-Limit": str(RATE_LIMIT_SHORT_MAX_REQUESTS),
                "X-RateLimit-Remaining": "0",
            },
        )

    if len(events) >= RATE_LIMIT_DAY_MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много заявок. Попробуйте позже.",
            headers={
                "Retry-After": str(RATE_LIMIT_DAY_WINDOW_SECONDS),
                "X-RateLimit-Reason": "lead-day-window",
                "X-RateLimit-Limit": str(RATE_LIMIT_DAY_MAX_REQUESTS),
                "X-RateLimit-Remaining": "0",
            },
        )

    events.append(now)


@router.post("/leads", status_code=status.HTTP_201_CREATED, tags=["leads"])
@router.post("/contact", status_code=status.HTTP_201_CREATED, tags=["contact"])
async def submit_lead(
    request: Request,
    background_tasks: BackgroundTasks,
    name: Annotated[str | None, Form(max_length=100)] = None,
    phone: Annotated[str | None, Form(max_length=50)] = None,
    car: Annotated[str | None, Form(max_length=150)] = None,
    comment: Annotated[str | None, Form(max_length=2000)] = None,
    message: Annotated[str | None, Form(max_length=2000)] = None,
    source: Annotated[str | None, Form(max_length=300)] = None,
    request_type: Annotated[str | None, Form(max_length=40)] = None,
    preferred_time: Annotated[str | None, Form(max_length=80)] = None,
    calculator_type: Annotated[str | None, Form(max_length=60)] = None,
    calculator_diameter: Annotated[str | None, Form(max_length=20)] = None,
    calculator_is_staggered: Annotated[str | None, Form(max_length=10)] = None,
    calculator_width: Annotated[str | None, Form(max_length=20)] = None,
    calculator_et: Annotated[str | None, Form(max_length=20)] = None,
    calculator_front_width: Annotated[str | None, Form(max_length=20)] = None,
    calculator_front_et: Annotated[str | None, Form(max_length=20)] = None,
    calculator_rear_width: Annotated[str | None, Form(max_length=20)] = None,
    calculator_rear_et: Annotated[str | None, Form(max_length=20)] = None,
    calculator_estimated_price: Annotated[str | None, Form(max_length=60)] = None,
    preferred_contact: Annotated[str | None, Form(max_length=20)] = None,
    preferred_contact_method: Annotated[str | None, Form(max_length=20)] = None,
    policy_accepted: Annotated[bool | None, Form()] = None,
    personal_data_consent: Annotated[bool | None, Form()] = None,
    fitment_car: Annotated[str | None, Form(max_length=60)] = None,
    fitment_year_generation: Annotated[str | None, Form(max_length=40)] = None,
    fitment_current_wheels: Annotated[str | None, Form(max_length=80)] = None,
    fitment_wishes: Annotated[str | None, Form(max_length=160)] = None,
    website: Annotated[str | None, Form(max_length=300)] = None,
    company_url: Annotated[str | None, Form(max_length=300)] = None,
    form_started_at: Annotated[str | None, Form(max_length=40)] = None,
    photo: Annotated[UploadFile | None, File()] = None,
    files: Annotated[list[UploadFile] | None, File()] = None,
    photos: Annotated[list[UploadFile] | None, File()] = None,
    attachments: Annotated[list[UploadFile] | None, File()] = None,
) -> dict[str, bool | str]:
    logger.info("lead received")
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            json_body = await request.json()
            payload = LeadCreate.model_validate(json_body)
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=exc.errors()) from exc
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Некорректный JSON") from exc

        if _is_honeypot_filled(payload.website, payload.company_url):
            return {"ok": True, "message": "Заявка отправлена"}

        if _is_too_fast_submission(payload.form_started_at):
            return {"ok": True, "message": "Заявка отправлена"}

        _check_lead_rate_limit(_client_ip(request))
        messages = [
            format_lead_message(
                name=payload.name.strip(),
                phone=payload.phone.strip(),
                car=payload.car,
                message=payload.message,
                source=payload.source,
            )
        ]
        background_tasks.add_task(
            send_contact_to_telegram,
            messages,
            [],
        )
        background_tasks.add_task(send_lead_email, messages, [])
        return {"ok": True, "message": "Заявка отправлена"}

    if _is_honeypot_filled(website, company_url):
        return {"ok": True, "message": "Заявка отправлена"}

    if _is_too_fast_submission(form_started_at):
        return {"ok": True, "message": "Заявка отправлена"}

    _check_lead_rate_limit(_client_ip(request))

    has_policy_consent = personal_data_consent is True or policy_accepted is True
    if not has_policy_consent:
        raise HTTPException(
            status_code=400,
            detail="Необходимо согласие на обработку персональных данных.",
        )

    normalized_name = _required_form_value(name or "", "Имя")
    normalized_phone = _required_form_value(phone or "", "Телефон")
    normalized_contact_method = _normalize_contact_method(
        preferred_contact_method or preferred_contact
    )
    validated_files = await _validate_contact_files([
        *([photo] if photo else []),
        *(files or []),
        *(photos or []),
        *(attachments or []),
    ])
    normalized_comment = comment if comment is not None else message
    messages = format_contact_messages(
        name=normalized_name,
        phone=normalized_phone,
        car=car,
        comment=normalized_comment,
        source=source,
        request_type=request_type,
        preferred_time=preferred_time,
        calculator_type=calculator_type,
        calculator_diameter=calculator_diameter,
        calculator_is_staggered=calculator_is_staggered,
        calculator_width=calculator_width,
        calculator_et=calculator_et,
        calculator_front_width=calculator_front_width,
        calculator_front_et=calculator_front_et,
        calculator_rear_width=calculator_rear_width,
        calculator_rear_et=calculator_rear_et,
        calculator_estimated_price=calculator_estimated_price,
        preferred_contact_method=normalized_contact_method,
        fitment_car=fitment_car,
        fitment_year_generation=fitment_year_generation,
        fitment_current_wheels=fitment_current_wheels,
        fitment_wishes=fitment_wishes,
    )

    print(
        "adding telegram background task",
        len(messages),
        len(validated_files),
        flush=True,
    )
    background_tasks.add_task(send_contact_to_telegram, messages, validated_files)
    background_tasks.add_task(send_lead_email, messages, validated_files)
    print("telegram background task added", flush=True)

    return {"ok": True, "message": "Заявка отправлена"}


@router.get("/brands", response_model=list[BrandRead], tags=["brands"])
def list_brands(response: Response, db: Session = Depends(get_db)) -> list[Brand]:
    _mark_public_read_response(response)
    return list(db.scalars(select(Brand).order_by(Brand.name)).all())


@router.get("/brands/{slug}", response_model=BrandDetail, tags=["brands"])
def get_brand(slug: str, db: Session = Depends(get_db)) -> Brand:
    brand = db.scalar(
        select(Brand).where(Brand.slug == slug).options(selectinload(Brand.models))
    )
    if brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand


@router.get("/models", response_model=list[VehicleModelRead], tags=["models"])
def list_models(
    response: Response,
    brand_slug: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[VehicleModel]:
    _mark_public_read_response(response)
    statement = select(VehicleModel).join(Brand).order_by(Brand.name, VehicleModel.name)
    if brand_slug:
        statement = statement.where(Brand.slug == brand_slug)
    return list(db.scalars(statement).all())


@router.get("/wheels", response_model=list[WheelRead], tags=["wheels"])
def list_wheels(response: Response, db: Session = Depends(get_db)) -> list[Wheel]:
    _mark_public_read_response(response)
    return list(db.scalars(select(Wheel).options(selectinload(Wheel.images)).order_by(Wheel.name)).all())


@router.get("/wheels/{slug}", response_model=WheelRead, tags=["wheels"])
def get_wheel(slug: str, db: Session = Depends(get_db)) -> Wheel:
    wheel = db.scalar(select(Wheel).where(Wheel.slug == slug).options(selectinload(Wheel.images)))
    if wheel is None:
        raise HTTPException(status_code=404, detail="Wheel not found")
    return wheel


@router.get("/fitment", response_model=list[FitmentRead], tags=["fitment"])
def list_fitment(
    brand_slug: str | None = Query(default=None),
    model_slug: str | None = Query(default=None),
    wheel_slug: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Fitment]:
    statement = (
        select(Fitment)
        .join(Fitment.vehicle_model)
        .join(VehicleModel.brand)
        .join(Fitment.wheel)
        .options(
            selectinload(Fitment.vehicle_model),
            selectinload(Fitment.wheel).selectinload(Wheel.images),
        )
        .order_by(Brand.name, VehicleModel.name, Wheel.name)
    )
    if brand_slug:
        statement = statement.where(Brand.slug == brand_slug)
    if model_slug:
        statement = statement.where(VehicleModel.slug == model_slug)
    if wheel_slug:
        statement = statement.where(Wheel.slug == wheel_slug)
    return list(db.scalars(statement).all())
