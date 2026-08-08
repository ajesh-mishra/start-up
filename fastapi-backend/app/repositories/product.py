from app.models.product import Product
from sqlmodel import Session


def update_database(session: Session, product: Product) -> Product:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


def bulk_insert(session: Session, products: list[Product]) -> list[Product]:
    for product in products:
        session.add(product)
    session.commit()
    for product in products:
        session.refresh(product)
    return products
