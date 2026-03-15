from app.models.purchase import Purchase
from sqlmodel import Session


def update_database(session: Session, purchase: Purchase) -> Purchase:
    session.add(purchase)
    session.commit()
    session.refresh(purchase)
    return purchase
