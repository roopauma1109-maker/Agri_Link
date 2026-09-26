import random, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database.connection import get_db
from app.models.models import CropLot, User, Notification
from app.schemas.schemas import CropLotCreate, CropLotResponse
from app.auth.security import get_current_user

router = APIRouter(prefix="/crop-lots", tags=["Crop Lots"])

@router.post("", response_model=CropLotResponse)
def create_crop_lot(
    lot_data: CropLotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["farmer", "fpo"]:
        raise HTTPException(status_code=403, detail="Only farmers and FPOs can create crop lots")

    # Generate unique Lot ID
    rand_num = random.randint(1000, 9999)
    lot_number = f"LOT-2026-{rand_num}"

    new_lot = CropLot(
        lot_number=lot_number,
        user_id=current_user.id,
        crop_name=lot_data.crop_name,
        variety=lot_data.variety,
        quantity=lot_data.quantity,
        unit=lot_data.unit,
        farm_location=lot_data.farm_location,
        harvest_date=lot_data.harvest_date,
        expected_price=lot_data.expected_price,
        quality_grade=lot_data.quality_grade,
        moisture_percent=lot_data.moisture_percent,
        packaging_type=lot_data.packaging_type,
        available_from=lot_data.available_from,
        storage_required=lot_data.storage_required,
        is_fpo_aggregated=lot_data.is_fpo_aggregated,
        fpo_member_count=lot_data.fpo_member_count,
        status="Active"
    )
    db.add(new_lot)

    # Create notification
    db.add(Notification(
        user_id=current_user.id,
        title="Crop Lot Created Successfully",
        message=f"Your lot {lot_number} for {lot_data.quantity} {lot_data.unit} of {lot_data.crop_name} is now active in the marketplace.",
        type="info"
    ))

    db.commit()
    db.refresh(new_lot)
    
    # Attach owner name
    response_data = CropLotResponse.from_orm(new_lot)
    response_data.owner_name = current_user.full_name
    return response_data

@router.get("", response_model=list[CropLotResponse])
def get_crop_lots(
    crop: Optional[str] = None,
    location: Optional[str] = None,
    grade: Optional[str] = None,
    my_lots: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(CropLot)
    if my_lots and current_user:
        query = query.filter(CropLot.user_id == current_user.id)
    if crop:
        query = query.filter(CropLot.crop_name.ilike(f"%{crop}%"))
    if location and location != "All":
        query = query.filter(CropLot.farm_location.ilike(f"%{location}%"))
    if grade and grade != "All":
        query = query.filter(CropLot.quality_grade == grade)

    lots = query.order_by(CropLot.id.desc()).all()
    
    result = []
    for lot in lots:
        item = CropLotResponse.from_orm(lot)
        item.owner_name = lot.owner.full_name if lot.owner else "Farmer"
        result.append(item)
    return result

@router.get("/{lot_id}", response_model=CropLotResponse)
def get_crop_lot_by_id(lot_id: int, db: Session = Depends(get_db)):
    lot = db.query(CropLot).filter(CropLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    res = CropLotResponse.from_orm(lot)
    res.owner_name = lot.owner.full_name if lot.owner else "Farmer"
    return res

@router.put("/{lot_id}/close")
def close_crop_lot(
    lot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lot = db.query(CropLot).filter(CropLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    if lot.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this lot")
    
    lot.status = "Completed"
    db.commit()
    return {"message": "Crop lot marked as completed"}

@router.delete("/{lot_id}")
def delete_crop_lot(
    lot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lot = db.query(CropLot).filter(CropLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    if lot.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this lot")

    db.delete(lot)
    db.commit()
    return {"message": "Crop lot deleted successfully"}
