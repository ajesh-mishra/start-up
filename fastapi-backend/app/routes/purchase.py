from calendar import monthrange
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import DateTime, Session, cast, func, select

from app.database import get_session
from app.models.purchase import Purchase, PurchaseCreate, PurchaseUpdate
from app.repositories.purchase import update_database


router = APIRouter(prefix="/purchase", tags=["purchase"])
PRICE = {"milk": 55, "paneer": 75, "yogurt": 60}


@router.get("/", response_model=list[Purchase])
def get_purchase(session: Session = Depends(get_session)):
    statement = select(Purchase)
    return session.exec(statement).all()


@router.get("/daily-expense", response_model=Purchase)
def get_purchase_by_date(purchase_date: date, session: Session = Depends(get_session)):
    """
    curl -X 'GET' \
        'http://fastapi-backend:8000/purchase/daily-expense?purchase_date=2026-03-07' \
        -H 'accept: application/json'
    """
    statement = select(Purchase).where(Purchase.purchase_date == purchase_date)
    purchase = session.exec(statement).first()

    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    return purchase


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


@router.get("/total-monthly-expense", response_model=dict[str, int])
def get_total_purchase_by_month(
    year: int = Query(..., ge=2000, le=2100, examples=[2026]),
    month: int = Query(..., ge=1, le=12, examples=[3]),
    session: Session = Depends(get_session),
):
    """
    curl -X 'GET' \
        'http://0.0.0.0:8000/purchase/total-monthly-expense?year=2026&month=3' \
        -H 'accept: application/json'
    """
    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])

    statement = select(
        func.sum(
            Purchase.milk * PRICE["milk"]
            + Purchase.paneer * PRICE["paneer"]
            + Purchase.yogurt * PRICE["yogurt"]
        )
    ).where(Purchase.purchase_date >= first_day, Purchase.purchase_date <= last_day)

    total = session.exec(statement).one()
    return {"month": f"{year}-{month:02d}", "total": total or 0}


@router.get("/total-yearly-expense", response_model=list[dict[str, int]])
def get_total_purchase_by_year(
    year: int = Query(..., ge=2000, le=2100, examples=[2026]),
    session: Session = Depends(get_session),
):
    """
    curl -X 'GET' \
        'http://0.0.0.0:8000/purchase/total-yearly-expense?year=2026' \
        -H 'accept: application/json'
    """
    first_day = date(year, 1, 1)
    last_day = date(year, 12, monthrange(year, 12)[1])

    statement = (
        select(
            func.date_trunc("month", Purchase.purchase_date).label("month"),
            func.sum(
                Purchase.milk * PRICE["milk"]
                + Purchase.paneer * PRICE["paneer"]
                + Purchase.yogurt * PRICE["yogurt"]
            ).label("total"),
        )
        .where(Purchase.purchase_date >= first_day, Purchase.purchase_date <= last_day)
        .group_by(func.date_trunc("month", Purchase.purchase_date))
        .order_by(func.date_trunc("month", Purchase.purchase_date))
    )
    result = session.exec(statement).all()
    return [{"month": r[0].month, "total": r[1]} for r in result]


@router.post("", response_model=Purchase)
def create_purchase(purchase: PurchaseCreate, session: Session = Depends(get_session)):
    """
    curl -X 'POST' 'http://0.0.0.0:8000/purchase/' \
        -H 'accept: application/json' \
        -H 'Content-Type: application/json' \
        -d '{
            "purchase_date": "2026-03-06",
            "milk": 1,
            "paneer": 2,
            "yogurt": 0
        }'
    """
    db_purchase = Purchase.model_validate(purchase)
    return update_database(session, db_purchase)


@router.put("/{purchase_id}", response_model=Purchase)
def update_purchase(
    purchase_id: int, purchase: PurchaseUpdate, session: Session = Depends(get_session)
):
    """
    curl -X 'PUT' 'http://0.0.0.0:8000/purchase/1' \
        -H 'accept: application/json' \
        -H 'Content-Type: application/json' \
        -d '{
            "purchase_date": "2026-03-05",
            "paneer": 10
        }'
    """
    db_purchase = session.get(Purchase, purchase_id)

    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    db_purchase.sqlmodel_update(purchase.model_dump(exclude_unset=True))
    return update_database(session, db_purchase)
