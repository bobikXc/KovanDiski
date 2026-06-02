from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class WheelImage(Base):
    __tablename__ = "wheel_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    wheel_id: Mapped[int] = mapped_column(ForeignKey("wheels.id", ondelete="CASCADE"), nullable=False)
    image_url: Mapped[str] = mapped_column(String(700), nullable=False)

    wheel = relationship("Wheel", back_populates="images")
