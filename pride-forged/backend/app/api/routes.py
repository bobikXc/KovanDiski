from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    Response,
    UploadFile,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Brand, Fitment, VehicleModel, Wheel
from app.schemas import BrandDetail, BrandRead, FitmentRead, VehicleModelRead, WheelRead
from app.services.telegram import (
    TelegramDeliveryError,
    TelegramFile,
    TelegramNotConfiguredError,
    format_contact_messages,
    send_contact_to_telegram,
)

router = APIRouter(prefix="/api")

MAX_CONTACT_FILES = 5
MAX_CONTACT_FILE_SIZE = 8 * 1024 * 1024
ALLOWED_CONTACT_FILE_TYPES = {
    "image/jpeg": {".jpg", ".jpeg"},
    "image/png": {".png"},
    "image/webp": {".webp"},
}
ALLOWED_CONTACT_METHODS = {"call", "telegram", "whatsapp", "max"}
PUBLIC_READ_CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300"


def _required_form_value(value: str, field_name: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise HTTPException(
            status_code=422, detail=f"Поле «{field_name}» обязательно"
        )
    return normalized


def _mark_public_read_response(response: Response) -> None:
    response.headers["Cache-Control"] = PUBLIC_READ_CACHE_CONTROL


async def _validate_contact_files(files: list[UploadFile]) -> list[TelegramFile]:
    if len(files) > MAX_CONTACT_FILES:
        raise HTTPException(
            status_code=422,
            detail=f"Можно прикрепить не более {MAX_CONTACT_FILES} файлов",
        )

    validated: list[TelegramFile] = []
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
                    f"Файл «{filename}» превышает максимальный размер 8 МБ"
                ),
            )
        if not content:
            raise HTTPException(status_code=422, detail=f"Файл «{filename}» пуст")

        validated.append(
            TelegramFile(filename=filename, content_type=upload.content_type or "", content=content)
        )

    return validated


@router.post("/contact", status_code=status.HTTP_201_CREATED, tags=["contact"])
async def submit_contact(
    name: Annotated[str, Form(max_length=100)],
    phone: Annotated[str, Form(max_length=50)],
    car: Annotated[str | None, Form(max_length=150)] = None,
    comment: Annotated[str | None, Form(max_length=2000)] = None,
    source: Annotated[str | None, Form(max_length=300)] = None,
    request_type: Annotated[str | None, Form(max_length=40)] = None,
    preferred_time: Annotated[str | None, Form(max_length=80)] = None,
    calculator_type: Annotated[str | None, Form(max_length=60)] = None,
    calculator_diameter: Annotated[str | None, Form(max_length=20)] = None,
    calculator_width: Annotated[str | None, Form(max_length=20)] = None,
    calculator_et: Annotated[str | None, Form(max_length=20)] = None,
    calculator_estimated_price: Annotated[str | None, Form(max_length=60)] = None,
    preferred_contact_method: Annotated[str | None, Form(max_length=20)] = None,
    personal_data_consent: Annotated[bool | None, Form()] = None,
    fitment_car: Annotated[str | None, Form(max_length=60)] = None,
    fitment_year_generation: Annotated[str | None, Form(max_length=40)] = None,
    fitment_current_wheels: Annotated[str | None, Form(max_length=80)] = None,
    fitment_wishes: Annotated[str | None, Form(max_length=160)] = None,
    files: Annotated[list[UploadFile] | None, File()] = None,
) -> dict[str, str]:
    if personal_data_consent is not True:
        raise HTTPException(
            status_code=400,
            detail="Необходимо согласие на обработку персональных данных.",
        )

    normalized_name = _required_form_value(name, "Имя")
    normalized_phone = _required_form_value(phone, "Телефон")
    normalized_contact_method = (
        preferred_contact_method
        if preferred_contact_method in ALLOWED_CONTACT_METHODS
        else "call"
    )
    validated_files = await _validate_contact_files(files or [])
    messages = format_contact_messages(
        name=normalized_name,
        phone=normalized_phone,
        car=car,
        comment=comment,
        source=source,
        request_type=request_type,
        preferred_time=preferred_time,
        calculator_type=calculator_type,
        calculator_diameter=calculator_diameter,
        calculator_width=calculator_width,
        calculator_et=calculator_et,
        calculator_estimated_price=calculator_estimated_price,
        preferred_contact_method=normalized_contact_method,
        fitment_car=fitment_car,
        fitment_year_generation=fitment_year_generation,
        fitment_current_wheels=fitment_current_wheels,
        fitment_wishes=fitment_wishes,
    )

    try:
        await send_contact_to_telegram(messages, validated_files)
    except TelegramNotConfiguredError as exc:
        raise HTTPException(
            status_code=503,
            detail="Отправка заявок временно не настроена",
        ) from exc
    except TelegramDeliveryError as exc:
        raise HTTPException(
            status_code=502, detail="Не удалось передать заявку в Telegram"
        ) from exc

    return {"message": "Заявка отправлена"}


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
