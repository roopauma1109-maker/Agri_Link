from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import StorageFacility, User, Notification
from app.auth.security import get_current_user

router = APIRouter(prefix="/storage", tags=["Storage Facilities"])

@router.get("/list")
def get_storage_facilities(db: Session = Depends(get_db)):
    return db.query(StorageFacility).all()

@router.post("/request")
def request_storage(
    facility_id: int,
    quantity_kg: float,
    duration_days: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    facility = db.query(StorageFacility).filter(StorageFacility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Storage facility not found")

    cost = round((quantity_kg * facility.price_per_kg_per_month * (duration_days / 30.0)), 2)

    db.add(Notification(
        user_id=current_user.id,
        title="Cold Storage Space Reserved",
        message=f"Reserved {quantity_kg} kg space at {facility.name} for {duration_days} days. Estimated Cost: ₹{cost:,.2f}",
        type="info"
    ))

    db.commit()
    return {
        "message": "Storage space reserved successfully",
        "facility": facility.name,
        "quantity_kg": quantity_kg,
        "duration_days": duration_days,
        "estimated_cost": cost,
        "contact_phone": facility.contact_phone
    }
