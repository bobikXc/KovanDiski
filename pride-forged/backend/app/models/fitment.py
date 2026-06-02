from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Fitment(Base):
    __tablename__ = "fitments"
    __table_args__ = (UniqueConstraint("vehicle_model_id", "wheel_id", name="uq_fitment_model_wheel"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    vehicle_model_id: Mapped[int] = mapped_column(
        ForeignKey("vehicle_models.id", ondelete="CASCADE"), nullable=False
    )
    wheel_id: Mapped[int] = mapped_column(ForeignKey("wheels.id", ondelete="CASCADE"), nullable=False)

    vehicle_model = relationship("VehicleModel", back_populates="fitments")
    wheel = relationship("Wheel", back_populates="fitments")
