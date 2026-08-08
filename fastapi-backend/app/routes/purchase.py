from calendar import monthrange
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlmodel import DateTime, Session, cast, func, select

from app.database import get_session
from app.models.product import Product
from app.models.purchase import Purchase, PurchaseCreate, PurchaseUpdate
from app.repositories.purchase import update_database


router = APIRouter(prefix="/purchase", tags=["purchase"])


@router.get("/", response_model=list[Purchase])
def get_purchase(session: Session = Depends(get_session)):
    statement = select(Purchase)
    return session.exec(statement).all()


@router.get("/daily-expense", response_model=list[Purchase])
def get_purchase_by_date(purchase_date: date, session: Session = Depends(get_session)):
    statement = select(Purchase).where(Purchase.purchase_date == purchase_date)
    purchases = session.exec(statement).all()

    if not purchases:
        raise HTTPException(status_code=404, detail="Purchase not found")

    return purchases


@router.get("/monthly-expense", response_model=list[Purchase])
def get_purchase_by_month(
    year: int = Query(..., ge=2000, le=2100, examples=[2026]),
    month: int = Query(..., ge=1, le=12, examples=[3]),
    session: Session = Depends(get_session),
):
    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])

    statement = (
        select(Purchase)
        .where(Purchase.purchase_date >= first_day, Purchase.purchase_date <= last_day)
        .order_by(func.extract("day", cast(Purchase.purchase_date, DateTime)).desc())
    )

    return session.exec(statement).all()


@router.get("/total-monthly-expense", response_model=dict[str, str | int])
def get_total_purchase_by_month(
    year: int = Query(..., ge=2000, le=2100, examples=[2026]),
    month: int = Query(..., ge=1, le=12, examples=[3]),
    session: Session = Depends(get_session),
):
    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])

    statement = select(func.sum(Purchase.quantity * Purchase.price)).where(
        Purchase.purchase_date >= first_day, Purchase.purchase_date <= last_day
    )

    total = session.exec(statement).one()
    return {"month": f"{year}-{month:02d}", "total": int(total or 0)}


@router.get("/total-yearly-expense", response_model=list[dict[str, int]])
def get_total_purchase_by_year(
    year: int = Query(..., ge=2000, le=2100, examples=[2026]),
    session: Session = Depends(get_session),
):
    first_day = date(year, 1, 1)
    last_day = date(year, 12, monthrange(year, 12)[1])

    statement = (
        select(
            func.date_trunc("month", Purchase.purchase_date).label("month"),
            func.sum(Purchase.quantity * Purchase.price).label("total"),
        )
        .where(Purchase.purchase_date >= first_day, Purchase.purchase_date <= last_day)
        .group_by(func.date_trunc("month", Purchase.purchase_date))
        .order_by(func.date_trunc("month", Purchase.purchase_date))
    )
    result = session.exec(statement).all()
    return [{"month": r[0].month, "total": int(r[1] or 0)} for r in result]


@router.post("", response_model=Purchase)
def create_purchase(purchase: PurchaseCreate, session: Session = Depends(get_session)):
    db_product = session.get(Product, purchase.product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_purchase = Purchase.model_validate(
        {**purchase.model_dump(), "price": db_product.price}
    )
    return update_database(session, db_purchase)


@router.put("/{purchase_id}", response_model=Purchase)
def update_purchase(
    purchase_id: int, purchase: PurchaseUpdate, session: Session = Depends(get_session)
):
    db_purchase = session.get(Purchase, purchase_id)

    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    update_data = purchase.model_dump(exclude_unset=True)

    if "product_id" in update_data:
        db_product = session.get(Product, update_data["product_id"])

        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")

        update_data["price"] = db_product.price

    db_purchase.sqlmodel_update(update_data)
    return update_database(session, db_purchase)


@router.delete("/{purchase_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_purchase(purchase_id: int, session: Session = Depends(get_session)):
    db_purchase = session.get(Purchase, purchase_id)

    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    session.delete(db_purchase)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
