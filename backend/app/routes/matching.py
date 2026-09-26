from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import CropLot, User, BuyerProfile
from app.services.matching_service import calculate_buyer_matches

router = APIRouter(prefix="/matching", tags=["Automated Buyer Matching"])

@router.get("/lot/{lot_id}")
def get_buyer_matches_for_lot(lot_id: int, db: Session = Depends(get_db)):
    lot = db.query(CropLot).filter(CropLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")

    buyers = db.query(User, BuyerProfile).join(BuyerProfile, User.id == BuyerProfile.user_id).all()
    matched_list = calculate_buyer_matches(lot, buyers)

    return {
        "lot_id": lot.id,
        "lot_number": lot.lot_number,
        "crop_name": lot.crop_name,
        "quantity": f"{lot.quantity} {lot.unit}",
        "quality_grade": lot.quality_grade,
        "expected_price": lot.expected_price,
        "matches": matched_list
    }
