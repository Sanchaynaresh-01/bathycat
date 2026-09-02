from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api.dependencies import get_db, get_current_active_admin
from app.schemas.product import Product, ProductCreate

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve products.
    """
    products = crud.get_active_products(db, skip=skip, limit=limit)
    return products

@router.post("/", response_model=Product)
def create_product(
    *,
    db: Session = Depends(get_db),
    product_in: ProductCreate,
    current_user = Depends(get_current_active_admin)
) -> Any:
    """
    Create new product (Admin only).
    """
    product = crud.create_product(db=db, obj_in=product_in)
    return product
