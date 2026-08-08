from typing import TYPE_CHECKING, List
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.purchase import Purchase


class ProductBase(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    price: int = Field(ge=0, description="Unit price in minor currency units")


class ProductCreate(ProductBase):
    pass


class ProductUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    price: int | None = Field(
        default=None, ge=0, description="Unit price in minor currency units"
    )


class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, min_length=1, max_length=100)

    purchases: List["Purchase"] = Relationship(back_populates="product")
