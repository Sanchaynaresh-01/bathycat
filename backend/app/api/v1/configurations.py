from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api.dependencies import get_db, get_current_user, get_current_user_optional
from app.schemas.configuration import Configuration, ConfigurationCreate, ConfigurationUpdate
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Configuration)
def create_configuration(
    *,
    db: Session = Depends(get_db),
    config_in: ConfigurationCreate,
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Any:
    """
    Save a user configuration.
    """
    # Calculate price based on DB to prevent client side tampering
    product = crud.get_product(db, config_in.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    total_price = product.base_price
    
    # Calculate components price
    for comp in config_in.selected_components:
        db_comp = crud.get_component(db, comp.get("id") or comp.get("component_id"))
        if db_comp:
            total_price += db_comp.price_modifier
            
    configuration = crud.create_configuration(
        db=db, 
        obj_in=config_in, 
        user_id=current_user.id if current_user else None,
        total_price=total_price
    )
    return configuration

@router.get("/me", response_model=List[Configuration])
def read_user_configurations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get saved configurations for current user.
    """
    configs = crud.get_user_configurations(db, user_id=current_user.id, skip=skip, limit=limit)
    return configs

@router.get("/{config_id}", response_model=Configuration)
def get_configuration(
    *,
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get a specific configuration.
    """
    config = crud.get_configuration(db, config_id=config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    if config.user_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return config

@router.put("/{config_id}", response_model=Configuration)
def update_configuration(
    *,
    config_id: int,
    db: Session = Depends(get_db),
    config_in: ConfigurationUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update a user configuration.
    """
    config = crud.get_configuration(db, config_id=config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    if config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    total_price = config.total_price
    
    # Recalculate price if product or components changed
    if config_in.product_id is not None or config_in.selected_components is not None:
        p_id = config_in.product_id if config_in.product_id is not None else config.product_id
        comps = config_in.selected_components if config_in.selected_components is not None else config.selected_components
        
        product = crud.get_product(db, p_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        total_price = product.base_price
        for comp in comps:
            db_comp = crud.get_component(db, comp.get("component_id") or comp.get("id"))
            if db_comp:
                total_price += db_comp.price_modifier
                
    configuration = crud.update_configuration(
        db=db,
        db_obj=config,
        obj_in=config_in,
        total_price=total_price
    )
    return configuration

@router.delete("/{config_id}", response_model=Configuration)
def delete_configuration(
    *,
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Delete a configuration.
    """
    config = crud.get_configuration(db, config_id=config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    if config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    configuration = crud.delete_configuration(db=db, config_id=config_id)
    return configuration
