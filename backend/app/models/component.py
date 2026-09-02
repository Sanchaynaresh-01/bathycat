from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ComponentCategory(Base):
    __tablename__ = "component_categories"

    id = Column(Integer, primary_key=True, index=True)
    group = Column(String, index=True, nullable=True) # e.g. "01 PLATFORM"
    name = Column(String, unique=True, index=True, nullable=False) # e.g. "Hull Type"
    step_order = Column(Integer, default=0) # For configurator steps
    is_multiple_allowed = Column(Boolean, default=False) # E.g., multiple cameras allowed

    components = relationship("Component", back_populates="category")


class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("component_categories.id"), nullable=False)
    name = Column(String, index=True, nullable=False) # e.g. "48V 60Ah Lithium Battery"
    description = Column(String)
    price_modifier = Column(Float, default=0.0)
    weight = Column(Float, default=0.0)
    attributes = Column(JSON) # e.g. {"capacity": "60Ah", "voltage": "48V"}
    is_active = Column(Boolean, default=True)

    category = relationship("ComponentCategory", back_populates="components")

class ComponentConstraint(Base):
    __tablename__ = "component_constraints"

    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id", ondelete="CASCADE"), nullable=False)
    incompatible_component_id = Column(Integer, ForeignKey("components.id", ondelete="CASCADE"), nullable=False)
