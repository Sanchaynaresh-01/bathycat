from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.schemas.configuration import Configuration

class QuoteBase(BaseModel):
    customer_name: str
    customer_company: Optional[str] = None
    customer_country: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: EmailStr
    project_details: Optional[str] = None

class QuoteCreate(QuoteBase):
    configuration_id: int

class Quote(QuoteBase):
    id: int
    configuration_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    configuration: Optional[Configuration] = None

    class Config:
        from_attributes = True
