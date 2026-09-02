from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.configuration import Configuration
from app.schemas.configuration import ConfigurationCreate, ConfigurationUpdate

def get(db: Session, config_id: int) -> Optional[Configuration]:
    return db.query(Configuration).filter(Configuration.id == config_id).first()

def create(db: Session, obj_in: ConfigurationCreate, user_id: Optional[int] = None, total_price: float = 0.0) -> Configuration:
    db_obj = Configuration(
        name=obj_in.name,
        user_id=user_id,
        product_id=obj_in.product_id,
        selected_components=obj_in.selected_components,
        total_price=total_price
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, db_obj: Configuration, obj_in: ConfigurationUpdate, total_price: Optional[float] = None) -> Configuration:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    
    if total_price is not None:
        db_obj.total_price = total_price

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, config_id: int) -> Configuration:
    obj = db.query(Configuration).get(config_id)
    db.delete(obj)
    db.commit()
    return obj

def get_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Configuration]:
    return db.query(Configuration).filter(Configuration.user_id == user_id).offset(skip).limit(limit).all()
