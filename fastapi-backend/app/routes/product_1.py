from fastapi import APIRouter, Depends, HTTPException, Response, status
from datetime import date

from sqlmodel import Session, select
from app.database import get_session

from app.models.product import Product, ProductCreate, ProductUpdate
from app.models.purchase import Purchase
from app.repositories.product import bulk_insert, update_database


router = APIRouter(prefix="/product", tags=["product"])


@router.get("/", response_model=list[Product])
def get_product(session: Session = Depends(get_session)):
    statement = select(Product)
    return session.exec(statement).all()


@router.post("/", response_model=list[Product])
def create_product(
    products: list[ProductCreate], session: Session = Depends(get_session)
):
    db_products = [Product.model_validate(product) for product in products]
    return bulk_insert(session, db_products)


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int, product: ProductUpdate, session: Session = Depends(get_session)
):
    db_product = session.get(Product, product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.model_dump(exclude_unset=True)
    db_product.sqlmodel_update(update_data)

    if "price" in update_data and update_data["price"] is not None:
        statement = select(Purchase).where(
            Purchase.product_id == product_id, Purchase.purchase_date >= date.today()
        )
        purchases_to_update = session.exec(statement).all()
        for purchase in purchases_to_update:
            purchase.price = update_data["price"]
            session.add(purchase)

    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, session: Session = Depends(get_session)):
    db_product = session.get(Product, product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    session.delete(db_product)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
