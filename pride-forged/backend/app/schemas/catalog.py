from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class WheelImageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str


class WheelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str
    price: Decimal
    diameter: int
    width: Decimal
    et: int
    pcd: str
    dia: Decimal
    weight: Decimal
    images: list[WheelImageRead] = []


class VehicleModelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    brand_id: int
    name: str
    slug: str
    year_from: int | None
    year_to: int | None


class BrandRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    logo: str | None


class BrandDetail(BrandRead):
    models: list[VehicleModelRead] = []


class FitmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vehicle_model: VehicleModelRead
    wheel: WheelRead
