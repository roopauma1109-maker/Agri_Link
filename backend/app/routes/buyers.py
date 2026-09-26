from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import BuyerProfile, User

router = APIRouter(prefix="/buyers", tags=["Verified Buyers"])

@router.get("/list")
def get_buyers(db: Session = Depends(get_db)):
    buyers = db.query(User, BuyerProfile).join(BuyerProfile, User.id == BuyerProfile.user_id).all()
    result = []
    for user, prof in buyers:
        result.append({
            "id": user.id,
            "company_name": prof.company_name,
            "contact_name": user.full_name,
            "buyer_type": prof.buyer_type,
            "location": prof.location,
            "required_crops": prof.required_crops,
            "required_quantity": prof.required_quantity,
            "payment_terms": prof.payment_terms,
            "verification_status": prof.verification_status,
            "completed_transactions": prof.completed_transactions,
            "reliability_score": prof.reliability_score,
            "phone": user.phone,
            "email": user.email
        })
    return result

@router.get("/{buyer_id}")
def get_buyer_details(buyer_id: int, db: Session = Depends(get_db)):
    buyer_user = db.query(User).filter(User.id == buyer_id).first()
    if not buyer_user or not buyer_user.buyer_profile:
        raise HTTPException(status_code=404, detail="Buyer profile not found")
    prof = buyer_user.buyer_profile
    return {
        "id": buyer_user.id,
        "company_name": prof.company_name,
        "contact_name": buyer_user.full_name,
        "buyer_type": prof.buyer_type,
        "location": prof.location,
        "required_crops": prof.required_crops,
        "required_quantity": prof.required_quantity,
        "payment_terms": prof.payment_terms,
        "verification_status": prof.verification_status,
        "completed_transactions": prof.completed_transactions,
        "reliability_score": prof.reliability_score,
        "phone": buyer_user.phone,
        "email": buyer_user.email
    }
