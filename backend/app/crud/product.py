from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate

def get(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()

def get_multi(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
    return db.query(Product).offset(skip).limit(limit).all()

def get_active(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
    return db.query(Product).filter(Product.is_active == True).offset(skip).limit(limit).all()

def create(db: Session, obj_in: ProductCreate) -> Product:
    db_obj = Product(
        name=obj_in.name,
        description=obj_in.description,
        base_price=obj_in.base_price,
        is_active=obj_in.is_active
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
