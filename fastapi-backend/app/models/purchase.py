from sqlmodel import SQLModel, Field
from datetime import date


class PurchaseBase(SQLModel):
    purchase_date: date
    milk: int
    paneer: int
    yogurt: int


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseUpdate(SQLModel):
    purchase_date: date | None = None
    milk: int | None = None
    paneer: int | None = None
    yogurt: int | None = None


class Purchase(PurchaseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    purchase_date: date = Field(unique=True, index=True)
