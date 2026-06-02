from decimal import Decimal

from sqlalchemy import Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Wheel(Base):
    __tablename__ = "wheels"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(140), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    diameter: Mapped[int] = mapped_column(nullable=False)
    width: Mapped[Decimal] = mapped_column(Numeric(4, 1), nullable=False)
    et: Mapped[int] = mapped_column(nullable=False)
    pcd: Mapped[str] = mapped_column(String(32), nullable=False)
    dia: Mapped[Decimal] = mapped_column(Numeric(5, 1), nullable=False)
    weight: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)

    images = relationship("WheelImage", back_populates="wheel", cascade="all, delete-orphan")
    fitments = relationship("Fitment", back_populates="wheel", cascade="all, delete-orphan")
