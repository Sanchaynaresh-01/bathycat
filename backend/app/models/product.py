from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # e.g., "Bathycat Professional"
    description = Column(Text)
    base_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Can add relationships to configurations here later if needed
