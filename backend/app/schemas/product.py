from typing import Optional
from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    is_active: Optional[bool] = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    base_price: Optional[float] = None

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True
