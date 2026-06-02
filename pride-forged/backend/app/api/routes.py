from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Brand, Fitment, VehicleModel, Wheel
from app.schemas import BrandDetail, BrandRead, FitmentRead, VehicleModelRead, WheelRead

router = APIRouter(prefix="/api")


@router.get("/brands", response_model=list[BrandRead], tags=["brands"])
def list_brands(db: Session = Depends(get_db)) -> list[Brand]:
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
    brand_slug: str | None = Query(default=None), db: Session = Depends(get_db)
) -> list[VehicleModel]:
    statement = select(VehicleModel).join(Brand).order_by(Brand.name, VehicleModel.name)
    if brand_slug:
        statement = statement.where(Brand.slug == brand_slug)
    return list(db.scalars(statement).all())


@router.get("/wheels", response_model=list[WheelRead], tags=["wheels"])
def list_wheels(db: Session = Depends(get_db)) -> list[Wheel]:
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
