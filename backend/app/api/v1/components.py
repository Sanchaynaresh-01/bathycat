from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api.dependencies import get_db, get_current_active_admin, get_current_active_admin_or_dealer
from app.schemas.component import ComponentCategoryWithComponents, ComponentCategoryCreate, ComponentCategory, ComponentCreate, Component

router = APIRouter()

@router.get("/categories", response_model=List[ComponentCategoryWithComponents])
def read_categories_with_components(
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve all component categories and their components. This is used for the configurator UI.
    """
    categories = crud.get_categories_with_components(db)
    return categories

@router.post("/categories", response_model=ComponentCategory)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: ComponentCategoryCreate,
    current_user = Depends(get_current_active_admin)
) -> Any:
    """
    Create new category (Admin only).
    """
    category = crud.create_category(db=db, obj_in=category_in)
    return category

@router.post("/", response_model=Component)
def create_component(
    *,
    db: Session = Depends(get_db),
    component_in: ComponentCreate,
    current_user = Depends(get_current_active_admin_or_dealer)
) -> Any:
    """
    Create new component (Admin/Dealer).
    """
    component = crud.create_component(db=db, obj_in=component_in)
    return component

from app.schemas.component import ComponentUpdate

@router.put("/{component_id}", response_model=Component)
def update_component(
    *,
    db: Session = Depends(get_db),
    component_id: int,
    component_in: ComponentUpdate,
    current_user = Depends(get_current_active_admin_or_dealer)
) -> Any:
    """
    Update a component (Admin/Dealer).
    """
    component = crud.get_component(db, component_id=component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    component = crud.update_component(db=db, db_obj=component, obj_in=component_in)
    return component

@router.delete("/{component_id}")
def delete_component(
    *,
    db: Session = Depends(get_db),
    component_id: int,
    current_user = Depends(get_current_active_admin_or_dealer)
) -> Any:
    """
    Delete a component (Admin/Dealer).
    """
    component = crud.get_component(db, component_id=component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    crud.delete_component(db=db, component_id=component_id)
    return {"ok": True}

from app.schemas.component import ComponentConstraint, ComponentConstraintCreate

@router.get("/constraints", response_model=List[ComponentConstraint])
def read_constraints(
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve all component constraints.
    """
    return crud.get_constraints(db)

@router.post("/constraints", response_model=ComponentConstraint)
def create_constraint(
    *,
    db: Session = Depends(get_db),
    constraint_in: ComponentConstraintCreate,
    current_user = Depends(get_current_active_admin)
) -> Any:
    """
    Create new component constraint (Admin only).
    """
    return crud.create_constraint(db=db, obj_in=constraint_in)

@router.delete("/constraints/{constraint_id}")
def delete_constraint(
    *,
    db: Session = Depends(get_db),
    constraint_id: int,
    current_user = Depends(get_current_active_admin)
) -> Any:
    """
    Delete a component constraint (Admin only).
    """
    crud.delete_constraint(db=db, constraint_id=constraint_id)
    return {"ok": True}
