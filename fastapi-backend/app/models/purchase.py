from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import date

if TYPE_CHECKING:
    from app.models.product import Product


class PurchaseBase(SQLModel):
    purchase_date: date = Field(index=True)
    product_id: int = Field(foreign_key="product.id", gt=0, index=True)
    quantity: int = Field(gt=0)
    price: int = Field(ge=0, description="Unit price in minor currency units")


class PurchaseCreate(PurchaseBase):
    price: int | None = Field(
        default=None, ge=0, description="Unit price in minor currency units"
    )


class PurchaseUpdate(SQLModel):
    purchase_date: date | None = None
    product_id: int | None = Field(default=None, gt=0)
    quantity: int | None = Field(default=None, gt=0)
    price: int | None = Field(
        default=None, ge=0, description="Unit price in minor currency units"
    )


class Purchase(PurchaseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    product: Optional["Product"] = Relationship(back_populates="purchases")
