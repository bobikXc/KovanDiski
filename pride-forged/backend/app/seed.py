from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Brand, Fitment, VehicleModel, Wheel, WheelImage

BRANDS = {
    "BMW": ["M3", "M4", "M5", "X5M", "X6M"],
    "Mercedes-Benz": ["C63 AMG", "E63 AMG", "G63 AMG"],
    "Audi": ["RS6", "RS7", "RSQ8"],
    "Porsche": ["911", "Panamera", "Cayenne Coupe"],
    "Tesla": ["Model 3", "Model S", "Model X"],
}


def slugify(value: str) -> str:
    return (
        value.lower()
        .replace("mercedes-benz", "mercedes")
        .replace(" ", "-")
        .replace("/", "-")
    )


def seed_brands_and_models(db: Session) -> list[VehicleModel]:
    models: list[VehicleModel] = []
    for brand_name, model_names in BRANDS.items():
        brand = db.scalar(select(Brand).where(Brand.slug == slugify(brand_name)))
        if brand is None:
            brand = Brand(
                name=brand_name,
                slug=slugify(brand_name),
                logo=f"/brands/{slugify(brand_name)}.svg",
            )
            db.add(brand)
            db.flush()
        for index, model_name in enumerate(model_names):
            model_slug = slugify(model_name)
            vehicle_model = db.scalar(
                select(VehicleModel).where(
                    VehicleModel.brand_id == brand.id,
                    VehicleModel.slug == model_slug,
                )
            )
            if vehicle_model is None:
                vehicle_model = VehicleModel(
                    brand_id=brand.id,
                    name=model_name,
                    slug=model_slug,
                    year_from=2018 + (index % 4),
                    year_to=None,
                )
                db.add(vehicle_model)
                db.flush()
            models.append(vehicle_model)
    return models


def seed_wheels(db: Session) -> list[Wheel]:
    wheels: list[Wheel] = []
    for number in range(1, 13):
        name = f"PRIDE P{number:02d}"
        slug = f"pride-p{number:02d}"
        wheel = db.scalar(select(Wheel).where(Wheel.slug == slug))
        if wheel is None:
            wheel = Wheel(
                name=name,
                slug=slug,
                description=(
                    f"{name} — премиальная кованая модель с выразительной геометрией, "
                    "низкой массой и усиленной конструкцией для мощных автомобилей."
                ),
                price=Decimal("145000.00") + Decimal(number * 7000),
                diameter=19 + (number % 4),
                width=Decimal("8.5") + Decimal(number % 4) / Decimal("2"),
                et=25 + number,
                pcd="5x112" if number % 2 else "5x120",
                dia=Decimal("66.6") if number % 2 else Decimal("72.6"),
                weight=Decimal("8.80") + Decimal(number) / Decimal("10"),
            )
            db.add(wheel)
            db.flush()
            db.add_all(
                [
                    WheelImage(wheel_id=wheel.id, image_url=f"/wheels/{slug}-studio.webp"),
                    WheelImage(wheel_id=wheel.id, image_url=f"/wheels/{slug}-detail.webp"),
                ]
            )
        wheels.append(wheel)
    return wheels


def seed_fitments(db: Session, models: list[VehicleModel], wheels: list[Wheel]) -> None:
    for model_index, vehicle_model in enumerate(models):
        for wheel in wheels[model_index % 4 :: 4]:
            exists = db.scalar(
                select(Fitment).where(
                    Fitment.vehicle_model_id == vehicle_model.id,
                    Fitment.wheel_id == wheel.id,
                )
            )
            if exists is None:
                db.add(Fitment(vehicle_model_id=vehicle_model.id, wheel_id=wheel.id))


def run() -> None:
    with SessionLocal() as db:
        models = seed_brands_and_models(db)
        wheels = seed_wheels(db)
        seed_fitments(db, models, wheels)
        db.commit()


if __name__ == "__main__":
    run()
