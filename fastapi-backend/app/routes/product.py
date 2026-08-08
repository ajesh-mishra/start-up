from fastapi import APIRouter, Depends, HTTPException, Response, status

from sqlmodel import Session, select
from app.database import get_session

from app.models.product import Product, ProductCreate, ProductUpdate
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

    db_product.sqlmodel_update(product.model_dump(exclude_unset=True))
    return update_database(session, db_product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, session: Session = Depends(get_session)):
    db_product = session.get(Product, product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    session.delete(db_product)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
