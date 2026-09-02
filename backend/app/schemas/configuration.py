from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.product import Product

class ConfigurationBase(BaseModel):
    name: Optional[str] = "Untitled Configuration"
    product_id: int
    selected_components: List[dict[str, Any]] # Will store selected components

class ConfigurationCreate(ConfigurationBase):
    pass

class ConfigurationUpdate(BaseModel):
    name: Optional[str] = None
    product_id: Optional[int] = None
    selected_components: Optional[List[dict[str, Any]]] = None

class Configuration(ConfigurationBase):
    id: int
    user_id: Optional[int] = None
    total_price: float
    created_at: datetime
    product: Optional[Product] = None

    class Config:
        from_attributes = True
