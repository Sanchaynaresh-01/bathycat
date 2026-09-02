from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import crud
from app.api.dependencies import get_db, get_current_active_admin, get_current_user, get_current_active_admin_or_dealer
from app.schemas.quote import Quote, QuoteCreate
from app.models.user import User
from app.core.email import send_quote_notification

class QuoteStatusUpdate(BaseModel):
    status: str

router = APIRouter()

@router.post("/", response_model=Quote)
def create_quote(
    *,
    db: Session = Depends(get_db),
    quote_in: QuoteCreate,
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Submit a configuration for quote.
    """
    config = crud.get_configuration(db, quote_in.configuration_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
        
    quote = crud.create_quote(db=db, obj_in=quote_in)
    
    # Send email notification in the background
    quote_data = {
        "customer_name": quote_in.customer_name,
        "customer_email": quote_in.customer_email
    }
    background_tasks.add_task(send_quote_notification, quote_in.customer_email, "Requested", quote_data)
    
    return quote

@router.get("/", response_model=List[Quote])
def read_quotes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_active_admin)
) -> Any:
    """
    Retrieve quotes (Admin only).
    """
    quotes = crud.get_quotes(db, skip=skip, limit=limit)
    return quotes

from app.api.dependencies import get_current_active_dealer

@router.get("/approved", response_model=List[Quote])
def read_approved_quotes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_active_dealer)
) -> Any:
    """
    Retrieve approved quotes (Dealer only).
    """
    quotes = crud.get_approved_quotes(db, skip=skip, limit=limit)
    return quotes

@router.get("/me", response_model=List[Quote])
def read_user_quotes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve quotes for the current user.
    """
    quotes = crud.get_quotes_by_email(db, email=current_user.email, skip=skip, limit=limit)
    return quotes

@router.put("/{quote_id}/status", response_model=Quote)
def update_quote_status(
    *,
    quote_id: int,
    status_update: QuoteStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_admin_or_dealer),
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Update quote status (Admin or Dealer).
    """
    quote = crud.update_quote_status(db, quote_id=quote_id, status=status_update.status)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
        
    # Send email notification in the background if it's a significant status change
    if status_update.status in ["Approved", "Rejected", "Completed"]:
        quote_data = {
            "customer_name": quote.customer_name,
            "customer_email": quote.customer_email
        }
        background_tasks.add_task(send_quote_notification, quote.customer_email, status_update.status, quote_data)
        
    return quote
