from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Configuration(Base):
    __tablename__ = "configurations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), default="Untitled Configuration")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Can be null if anonymous user saves config temporarily
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    total_price = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # We can store the selected components as a JSON array of component IDs
    # or create a many-to-many relationship table.
    # For a configurator where a config is a point-in-time snapshot, JSON is often safer
    # to avoid changes in component prices affecting past configurations unintentionally.
    selected_components = Column(JSON, nullable=False) # e.g. [{"category_id": 1, "component_id": 5, "price_at_time": 120000}]
    
    user = relationship("User")
    product = relationship("Product")
