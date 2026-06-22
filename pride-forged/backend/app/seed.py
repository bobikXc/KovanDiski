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
        "name": "ZP Mono 2 Ultra Concave",
        "slug": "zp-mono-2-ultra-concave",
        "description": "Выразительная моноблочная модель с глубокой вогнутостью и тонкими раздвоенными спицами для спортивных седанов и купе.",
        "price": "0.00",
        "diameter": 22,
        "width": "9.5",
        "et": 30,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "11.20",
        "images": [
            "/images/wheels/zp-mono-2-ultra-concave-01.jpg",
            "/images/wheels/zp-mono-2-ultra-concave-02.jpg",
            "/images/wheels/zp-mono-2-ultra-concave-03.jpg",
        ],
    },
    {
        "name": "ZP Mono 3",
        "slug": "zp-mono-3",
        "description": "Лаконичная моноблочная геометрия с направленными спицами, подчёркивающая крупные тормоза и точную посадку.",
        "price": "0.00",
        "diameter": 21,
        "width": "9.5",
        "et": 31,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "10.60",
        "images": [
            "/images/wheels/zp-mono-3-01.jpg",
            "/images/wheels/zp-mono-3-02.jpg",
            "/images/wheels/zp-mono-3-03.jpg",
        ],
    },
    {
        "name": "ZP 6.1 GM",
        "slug": "zp-6-1-gm",
        "description": "Шестилучевая performance-модель в gunmetal-финише с уверенной архитектурой и акцентом на визуальную лёгкость.",
        "price": "0.00",
        "diameter": 21,
        "width": "10.0",
        "et": 28,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "10.90",
        "images": [
            "/images/wheels/zp-6-1-gm-01.gif",
            "/images/wheels/zp-6-1-gm-02.gif",
            "/images/wheels/zp-6-1-gm-03.gif",
        ],
    },
    {
        "name": "ZP 7.1 GLM",
        "slug": "zp-7-1-glm",
        "description": "Семилучевой дизайн с графитовым финишем и глубокой центральной зоной для выразительных дорожных конфигураций.",
        "price": "0.00",
        "diameter": 20,
        "width": "9.0",
        "et": 34,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "9.70",
        "images": [
            "/images/wheels/zp-7-1-glm-01.gif",
            "/images/wheels/zp-7-1-glm-02.gif",
            "/images/wheels/zp-7-1-glm-03.gif",
        ],
    },
    {
        "name": "Barracuda Razzer",
        "slug": "barracuda-razzer",
        "description": "Динамичная многоспицевая модель с острыми переходами и серебристым финишем для современных автомобилей бизнес-класса.",
        "price": "0.00",
        "diameter": 19,
        "width": "8.5",
        "et": 35,
        "pcd": "5x114.3",
        "dia": "67.1",
        "weight": "9.10",
        "images": [
            "/images/wheels/barracuda-razzer-01.jpg",
            "/images/wheels/barracuda-razzer-02.jpg",
            "/images/wheels/barracuda-razzer-03.jpg",
        ],
    },
    {
        "name": "Brock B44",
        "slug": "brock-b44",
        "description": "Чистая геометрия с уверенными лучами и спокойным серебристым покрытием для универсальных премиальных конфигураций.",
        "price": "0.00",
        "diameter": 20,
        "width": "9.0",
        "et": 36,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "9.80",
        "images": [
            "/images/wheels/brock-b44-01.jpg",
            "/images/wheels/brock-b44-02.jpg",
            "/images/wheels/brock-b44-03.jpg",
        ],
    },
    {
        "name": "Concaver CVR1",
        "slug": "concaver-cvr1",
        "description": "Глубоко вогнутая направленная модель с выразительной спицевой графикой для спортивных седанов и мощных универсалов.",
        "price": "0.00",
        "diameter": 21,
        "width": "10.0",
        "et": 25,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "10.50",
        "images": [
            "/images/wheels/concaver-cvr1-01.jpg",
            "/images/wheels/concaver-cvr1-02.jpg",
            "/images/wheels/concaver-cvr1-03.jpg",
        ],
    },
    {
        "name": "Concaver CVR5",
        "slug": "concaver-cvr5",
        "description": "Современная раздвоенная геометрия с глубокой посадкой центра и контрастными поверхностями для performance-проектов.",
        "price": "0.00",
        "diameter": 20,
        "width": "9.5",
        "et": 29,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "9.60",
        "images": [
            "/images/wheels/concaver-cvr5-01.jpg",
            "/images/wheels/concaver-cvr5-02.jpg",
            "/images/wheels/concaver-cvr5-03.jpg",
        ],
    },
    {
        "name": "Japan Racing SL-01",
        "slug": "japan-racing-sl-01",
        "description": "Лёгкая спортивная модель с тонкими спицами и техническим gunmetal-финишем для точных дорожных настроек.",
        "price": "0.00",
        "diameter": 19,
        "width": "8.5",
        "et": 32,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "8.80",
        "images": [
            "/images/wheels/japan-racing-sl-01-01.jpg",
            "/images/wheels/japan-racing-sl-01-02.jpg",
            "/images/wheels/japan-racing-sl-01-03.jpg",
        ],
    },
    {
        "name": "La Chanti LC-P19",
        "slug": "la-chanti-lc-p19",
        "description": "Премиальная многоспицевая модель с плавающим центральным колпачком и сложной обработкой лицевой поверхности.",
        "price": "0.00",
        "diameter": 22,
        "width": "10.0",
        "et": 24,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "11.30",
        "images": [
            "/images/wheels/la-chanti-lc-p19-01.jpg",
            "/images/wheels/la-chanti-lc-p19-02.jpg",
            "/images/wheels/la-chanti-lc-p19-03.jpg",
        ],
    },
    {
        "name": "SX Wheels SX1",
        "slug": "sx-wheels-sx1",
        "description": "Агрессивная направленная модель с плотным рисунком спиц и графитовым финишем для выразительной городской посадки.",
        "price": "0.00",
        "diameter": 20,
        "width": "9.5",
        "et": 30,
        "pcd": "5x114.3",
        "dia": "67.1",
        "weight": "9.90",
        "images": [
            "/images/wheels/sx-wheels-sx1-01.jpg",
            "/images/wheels/sx-wheels-sx1-02.jpg",
            "/images/wheels/sx-wheels-sx1-03.jpg",
        ],
    },
    {
        "name": "WheelForce Race Three",
        "slug": "wheelforce-race-three",
        "description": "Трековая многоспицевая архитектура с чистым серебристым финишем и высокой визуальной прозрачностью вокруг тормозов.",
        "price": "0.00",
        "diameter": 21,
        "width": "9.5",
        "et": 27,
        "pcd": "5x120",
        "dia": "72.6",
        "weight": "10.20",
        "images": [
            "/images/wheels/wheelforce-race-three-01.jpg",
            "/images/wheels/wheelforce-race-three-02.jpg",
            "/images/wheels/wheelforce-race-three-03.jpg",
        ],
    },
    {
        "name": "WheelForce Race Two",
        "slug": "wheelforce-race-two",
        "description": "Контрастная спортивная модель с направленной геометрией и чёрным финишем для мощных седанов и купе.",
        "price": "0.00",
        "diameter": 20,
        "width": "9.0",
        "et": 33,
        "pcd": "5x112",
        "dia": "66.6",
        "weight": "9.40",
        "images": [
            "/images/wheels/wheelforce-race-two-01.jpg",
            "/images/wheels/wheelforce-race-two-02.jpg",
            "/images/wheels/wheelforce-race-two-03.jpg",
        ],
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
    legacy_slugs = {
        "pride-apex",
        "pride-vector",
        "pride-storm",
        "pride-blade",
        "pride-mono",
        "pride-r-line",
        "pride-gt",
        "pride-evo",
        "pride-rs",
        "pride-vortex",
        "pride-titan",
        "pride-nero",
    }
    for legacy_wheel in db.scalars(select(Wheel).where(Wheel.slug.in_(legacy_slugs))).all():
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
                price=Decimal(spec["price"]),
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
            wheel.price = Decimal(spec["price"])
            wheel.diameter = spec["diameter"]
            wheel.width = Decimal(spec["width"])
            wheel.et = spec["et"]
            wheel.pcd = spec["pcd"]
            wheel.dia = Decimal(spec["dia"])
            wheel.weight = Decimal(spec["weight"])

        wheel.images.clear()
        db.flush()
        for image_url in spec["images"]:
            db.add(WheelImage(wheel_id=wheel.id, image_url=image_url))
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
