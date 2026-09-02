from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.quote import Quote
from app.schemas.quote import QuoteCreate

def get(db: Session, quote_id: int) -> Optional[Quote]:
    return db.query(Quote).filter(Quote.id == quote_id).first()

def get_multi(db: Session, skip: int = 0, limit: int = 100) -> List[Quote]:
    return db.query(Quote).offset(skip).limit(limit).all()

def get_by_email(db: Session, email: str, skip: int = 0, limit: int = 100) -> List[Quote]:
    return db.query(Quote).filter(Quote.customer_email == email).offset(skip).limit(limit).all()

def get_approved_quotes(db: Session, skip: int = 0, limit: int = 100) -> List[Quote]:
    return db.query(Quote).filter(Quote.status == "Approved").offset(skip).limit(limit).all()

def create(db: Session, obj_in: QuoteCreate) -> Quote:
    db_obj = Quote(
        configuration_id=obj_in.configuration_id,
        customer_name=obj_in.customer_name,
        customer_company=obj_in.customer_company,
        customer_country=obj_in.customer_country,
        customer_phone=obj_in.customer_phone,
        customer_email=obj_in.customer_email,
        project_details=obj_in.project_details
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_status(db: Session, quote_id: int, status: str) -> Optional[Quote]:
    quote = get(db, quote_id)
    if quote:
        quote.status = status
        db.commit()
        db.refresh(quote)
    return quote
