from typing import Optional, List, Any
from pydantic import BaseModel

class ComponentCategoryBase(BaseModel):
    name: str
    group: Optional[str] = None
    step_order: int = 0
    is_multiple_allowed: bool = False

class ComponentCategoryCreate(ComponentCategoryBase):
    pass

class ComponentCategory(ComponentCategoryBase):
    id: int

    class Config:
        from_attributes = True

class ComponentBase(BaseModel):
    name: str
    description: Optional[str] = None
    price_modifier: float = 0.0
    weight: float = 0.0
    attributes: Optional[dict[str, Any]] = None
    is_active: bool = True

class ComponentCreate(ComponentBase):
    category_id: int

class ComponentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_modifier: Optional[float] = None
    weight: Optional[float] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None

class Component(ComponentBase):
    id: int
    category_id: int

    class Config:
        from_attributes = True

# Combined for configurator view
class ComponentCategoryWithComponents(ComponentCategory):
    components: List[Component] = []

class ComponentConstraintBase(BaseModel):
    component_id: int
    incompatible_component_id: int

class ComponentConstraintCreate(ComponentConstraintBase):
    pass

class ComponentConstraint(ComponentConstraintBase):
    id: int

    class Config:
        from_attributes = True
