from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Transaction, User
from app.auth.security import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transaction Tracking"])

@router.get("")
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction)
    if current_user.role in ["farmer", "fpo"]:
        query = query.filter(Transaction.farmer_id == current_user.id)
    elif current_user.role == "buyer":
        query = query.filter(Transaction.buyer_id == current_user.id)

    txs = query.order_by(Transaction.id.desc()).all()
    result = []
    for t in txs:
        result.append({
            "id": t.id,
            "tx_number": t.tx_number,
            "lot_id": t.lot_id,
            "crop_name": t.crop_name,
            "quantity": t.quantity,
            "price_per_unit": t.price_per_unit,
            "total_value": t.total_value,
            "current_stage": t.current_stage,
            "payment_status": t.payment_status,
            "created_at": t.created_at
        })
    return result

@router.get("/{tx_id}")
def get_transaction_details(tx_id: int, db: Session = Depends(get_db)):
    t = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {
        "id": t.id,
        "tx_number": t.tx_number,
        "lot_id": t.lot_id,
        "crop_name": t.crop_name,
        "quantity": t.quantity,
        "price_per_unit": t.price_per_unit,
        "total_value": t.total_value,
        "current_stage": t.current_stage,
        "payment_status": t.payment_status,
        "created_at": t.created_at,
        "timeline": [
            {"stage": "Lot Created", "completed": True},
            {"stage": "Buyer Matched", "completed": True},
            {"stage": "Offer Received", "completed": True},
            {"stage": "Offer Accepted", "completed": True},
            {"stage": "Pickup Scheduled", "completed": t.current_stage in ["Pickup Scheduled", "In Transit", "Delivered", "Payment Completed"]},
            {"stage": "Delivered", "completed": t.current_stage in ["Delivered", "Payment Completed"]},
            {"stage": "Payment Pending", "completed": True},
            {"stage": "Payment Completed", "completed": t.payment_status == "Paid"}
        ]
    }

@router.put("/{tx_id}/stage")
def update_transaction_stage(
    tx_id: int,
    stage: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")

    t.current_stage = stage
    db.commit()
    return {"message": f"Transaction stage updated to {stage}"}
