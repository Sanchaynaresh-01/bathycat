import sys
import os

# Add the root backend directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.core.security import get_password_hash

def seed_dealer(db: Session):
    dealer_email = "dealer@bathycat.com"
    existing_dealer = db.query(User).filter(User.email == dealer_email).first()
    if not existing_dealer:
        dealer_user = User(
            email=dealer_email,
            hashed_password=get_password_hash("dealer123"),
            full_name="Dealer User",
            is_active=True,
            role="Dealer"
        )
        db.add(dealer_user)
        db.commit()
        print("Created dealer user: dealer@bathycat.com / dealer123")
    else:
        print("Dealer already exists.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_dealer(db)
    finally:
        db.close()
