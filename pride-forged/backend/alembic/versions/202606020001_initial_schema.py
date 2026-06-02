"""initial schema

Revision ID: 202606020001
Revises:
Create Date: 2026-06-02 00:00:01.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "202606020001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "brands",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("logo", sa.String(length=500), nullable=True),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_brands_id"), "brands", ["id"])
    op.create_table(
        "vehicle_models",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("brand_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=140), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("year_from", sa.Integer(), nullable=True),
        sa.Column("year_to", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["brand_id"], ["brands.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("brand_id", "slug", name="uq_vehicle_model_brand_slug"),
    )
    op.create_index(op.f("ix_vehicle_models_id"), "vehicle_models", ["id"])
    op.create_table(
        "wheels",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=140), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("price", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("diameter", sa.Integer(), nullable=False),
        sa.Column("width", sa.Numeric(precision=4, scale=1), nullable=False),
        sa.Column("et", sa.Integer(), nullable=False),
        sa.Column("pcd", sa.String(length=32), nullable=False),
        sa.Column("dia", sa.Numeric(precision=5, scale=1), nullable=False),
        sa.Column("weight", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_wheels_id"), "wheels", ["id"])
    op.create_table(
        "wheel_images",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("wheel_id", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.String(length=700), nullable=False),
        sa.ForeignKeyConstraint(["wheel_id"], ["wheels.id"], ondelete="CASCADE"),
    )
    op.create_index(op.f("ix_wheel_images_id"), "wheel_images", ["id"])
    op.create_table(
        "fitments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("vehicle_model_id", sa.Integer(), nullable=False),
        sa.Column("wheel_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["vehicle_model_id"], ["vehicle_models.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["wheel_id"], ["wheels.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("vehicle_model_id", "wheel_id", name="uq_fitment_model_wheel"),
    )
    op.create_index(op.f("ix_fitments_id"), "fitments", ["id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_fitments_id"), table_name="fitments")
    op.drop_table("fitments")
    op.drop_index(op.f("ix_wheel_images_id"), table_name="wheel_images")
    op.drop_table("wheel_images")
    op.drop_index(op.f("ix_wheels_id"), table_name="wheels")
    op.drop_table("wheels")
    op.drop_index(op.f("ix_vehicle_models_id"), table_name="vehicle_models")
    op.drop_table("vehicle_models")
    op.drop_index(op.f("ix_brands_id"), table_name="brands")
    op.drop_table("brands")
