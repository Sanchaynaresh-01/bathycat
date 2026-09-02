from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.component import Component, ComponentCategory
from app.schemas.component import ComponentCreate, ComponentCategoryCreate

def get_category(db: Session, category_id: int) -> Optional[ComponentCategory]:
    return db.query(ComponentCategory).filter(ComponentCategory.id == category_id).first()

def get_categories_with_components(db: Session) -> List[ComponentCategory]:
    return db.query(ComponentCategory).order_by(ComponentCategory.step_order).all()

def create_category(db: Session, obj_in: ComponentCategoryCreate) -> ComponentCategory:
    db_obj = ComponentCategory(
        name=obj_in.name,
        step_order=obj_in.step_order,
        is_multiple_allowed=obj_in.is_multiple_allowed
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_component(db: Session, component_id: int) -> Optional[Component]:
    return db.query(Component).filter(Component.id == component_id).first()

def create_component(db: Session, obj_in: ComponentCreate) -> Component:
    db_obj = Component(
        category_id=obj_in.category_id,
        name=obj_in.name,
        description=obj_in.description,
        price_modifier=obj_in.price_modifier,
        weight=obj_in.weight,
        attributes=obj_in.attributes,
        is_active=obj_in.is_active
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

from app.schemas.component import ComponentUpdate

def update_component(db: Session, db_obj: Component, obj_in: ComponentUpdate) -> Component:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_component(db: Session, component_id: int):
    # Get the component
    component = db.query(Component).filter(Component.id == component_id).first()
    if component:
        # Delete related constraints first
        db.query(ComponentConstraint).filter(
            (ComponentConstraint.component_id == component_id) | 
            (ComponentConstraint.incompatible_component_id == component_id)
        ).delete()
        # Delete component
        db.delete(component)
        db.commit()

from app.models.component import ComponentConstraint
from app.schemas.component import ComponentConstraintCreate

def get_constraints(db: Session) -> List[ComponentConstraint]:
    return db.query(ComponentConstraint).all()

def create_constraint(db: Session, obj_in: ComponentConstraintCreate) -> ComponentConstraint:
    # We can optionally ensure bidirectional entries aren't duplicated, but for now we just insert
    db_obj = ComponentConstraint(
        component_id=obj_in.component_id,
        incompatible_component_id=obj_in.incompatible_component_id
    )
    db.add(db_obj)
    
    # Also add the reverse constraint automatically
    reverse_obj = ComponentConstraint(
        component_id=obj_in.incompatible_component_id,
        incompatible_component_id=obj_in.component_id
    )
    db.add(reverse_obj)
    
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_constraint(db: Session, constraint_id: int):
    # Get the constraint first to find the reverse one
    constraint = db.query(ComponentConstraint).filter(ComponentConstraint.id == constraint_id).first()
    if constraint:
        # Delete reverse
        db.query(ComponentConstraint).filter(
            ComponentConstraint.component_id == constraint.incompatible_component_id,
            ComponentConstraint.incompatible_component_id == constraint.component_id
        ).delete()
        # Delete original
        db.delete(constraint)
        db.commit()
