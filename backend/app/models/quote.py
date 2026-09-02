from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    configuration_id = Column(Integer, ForeignKey("configurations.id"), nullable=False)
    
    # Customer details (in case they are not registered)
    customer_name = Column(String, nullable=False)
    customer_company = Column(String)
    customer_country = Column(String)
    customer_phone = Column(String)
    customer_email = Column(String, nullable=False)
    
    project_details = Column(Text)
    
    status = Column(String, default="Pending") # Pending, Approved, Rejected, Converted
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    configuration = relationship("Configuration")
