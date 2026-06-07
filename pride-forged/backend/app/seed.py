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

WHEEL_SPECS = [
    {
        "name": "PRIDE Apex",
        "slug": "pride-apex",
        "description": "Флагманская модель с напряженной Y-образной геометрией, созданная для мощных купе и седанов с акцентом на точную посадку и визуальную легкость.",
        "diameter": 22,
        "width": "9.5",
        "et": 30,
        "pcd": "5x108",
        "dia": "63.4",
        "weight": "15.60",
        "image_url": "/images/wheels/apex.jpg",
    },
    {
        "name": "PRIDE Vector",
        "slug": "pride-vector",
        "description": "Чистый направленный дизайн с широкой полкой и спокойной графикой для автомобилей, где важны статус, баланс и уверенная линия профиля.",
        "diameter": 20,
        "width": "9.0",
        "et": 32,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "10.20",
        "image_url": "/images/wheels/vector.jpg",
    },
    {
        "name": "PRIDE Storm",
        "slug": "pride-storm",
        "description": "Агрессивная многоспицевая ковка для performance-сценариев: выразительная глубина, высокая жесткость и точная работа с большими тормозами.",
        "diameter": 21,
        "width": "10.0",
        "et": 28,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "11.40",
        "image_url": "/images/wheels/storm.jpg",
    },
    {
        "name": "PRIDE Blade",
        "slug": "pride-blade",
        "description": "Острые грани и вытянутые лучи создают эффект движения даже на статичном автомобиле, сохраняя премиальную сдержанность формы.",
        "diameter": 20,
        "width": "8.5",
        "et": 35,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "9.80",
        "image_url": "/images/wheels/blade.jpg",
    },
    {
        "name": "PRIDE Mono",
        "slug": "pride-mono",
        "description": "Монолитная архитектура с плотной центральной частью для автомобилей представительского класса и проектов с лаконичным визуальным кодом.",
        "diameter": 19,
        "width": "8.5",
        "et": 33,
        "pcd": "5x114.3",
        "dia": "67.1",
        "weight": "9.30",
        "image_url": "/images/wheels/mono.jpg",
    },
    {
        "name": "PRIDE R-Line",
        "slug": "pride-r-line",
        "description": "Спортивная модель с точным ритмом спиц, разработанная для плотной посадки, выразительного stance и повседневной надежности.",
        "diameter": 21,
        "width": "9.5",
        "et": 31,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "10.90",
        "image_url": "/images/wheels/vector.jpg",
    },
    {
        "name": "PRIDE GT",
        "slug": "pride-gt",
        "description": "Gran Turismo характер: длинные чистые лучи, визуальная ширина и инженерная геометрия для быстрых автомобилей дальнего хода.",
        "diameter": 22,
        "width": "10.5",
        "et": 27,
        "pcd": "5x130",
        "dia": "71.6",
        "weight": "12.10",
        "image_url": "/images/wheels/storm.jpg",
    },
    {
        "name": "PRIDE Evo",
        "slug": "pride-evo",
        "description": "Современная эволюция классической кованой формы: сниженная масса, точная нагрузочная схема и спокойная премиальная пластика.",
        "diameter": 20,
        "width": "9.0",
        "et": 29,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "9.90",
        "image_url": "/images/wheels/blade.jpg",
    },
    {
        "name": "PRIDE RS",
        "slug": "pride-rs",
        "description": "Собранная RS-геометрия для мощных седанов и универсалов: строгая лицевая плоскость, глубокие проемы и уверенный спортивный акцент.",
        "diameter": 21,
        "width": "10.0",
        "et": 26,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "10.70",
        "image_url": "/images/wheels/apex.jpg",
    },
    {
        "name": "PRIDE Vortex",
        "slug": "pride-vortex",
        "description": "Динамичная закрученная графика с эффектом глубины для проектов, где диск должен добавлять автомобилю энергии без визуального шума.",
        "diameter": 22,
        "width": "10.0",
        "et": 24,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "11.80",
        "image_url": "/images/wheels/titan.jpg",
    },
    {
        "name": "PRIDE Titan",
        "slug": "pride-titan",
        "description": "Усиленная премиальная модель для SUV и тяжелых performance-платформ с акцентом на надежность, масштаб и чистую геометрию.",
        "diameter": 23,
        "width": "10.5",
        "et": 34,
        "pcd": "5x130",
        "dia": "71.6",
        "weight": "13.20",
        "image_url": "/images/wheels/titan.jpg",
    },
    {
        "name": "PRIDE Nero",
        "slug": "pride-nero",
        "description": "Темная, собранная и минималистичная модель для конфигураций с глубоким контрастом, крупными тормозами и акцентом на силуэт.",
        "diameter": 20,
        "width": "9.5",
        "et": 30,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "10.40",
        "image_url": "/images/wheels/mono.jpg",
    },
]


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
    for legacy_wheel in db.scalars(select(Wheel).where(Wheel.slug.like("pride-p%"))).all():
        db.delete(legacy_wheel)
    db.flush()

    for spec in WHEEL_SPECS:
        slug = spec["slug"]
        wheel = db.scalar(select(Wheel).where(Wheel.slug == slug))
        if wheel is None:
            wheel = Wheel(
                name=spec["name"],
                slug=slug,
                description=spec["description"],
                price=Decimal("0.00"),
                diameter=spec["diameter"],
                width=Decimal(spec["width"]),
                et=spec["et"],
                pcd=spec["pcd"],
                dia=Decimal(spec["dia"]),
                weight=Decimal(spec["weight"]),
            )
            db.add(wheel)
            db.flush()
        else:
            wheel.name = spec["name"]
            wheel.description = spec["description"]
            wheel.price = Decimal("0.00")
            wheel.diameter = spec["diameter"]
            wheel.width = Decimal(spec["width"])
            wheel.et = spec["et"]
            wheel.pcd = spec["pcd"]
            wheel.dia = Decimal(spec["dia"])
            wheel.weight = Decimal(spec["weight"])

        wheel.images.clear()
        db.add(WheelImage(wheel_id=wheel.id, image_url=spec["image_url"]))
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
