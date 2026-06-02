from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class VehicleModel(Base):
    __tablename__ = "vehicle_models"
    __table_args__ = (UniqueConstraint("brand_id", "slug", name="uq_vehicle_model_brand_slug"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    brand_id: Mapped[int] = mapped_column(ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(140), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), nullable=False)
    year_from: Mapped[int | None] = mapped_column(nullable=True)
    year_to: Mapped[int | None] = mapped_column(nullable=True)

    brand = relationship("Brand", back_populates="models")
    fitments = relationship("Fitment", back_populates="vehicle_model", cascade="all, delete-orphan")
