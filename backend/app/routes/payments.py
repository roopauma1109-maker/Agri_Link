import datetime, random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Payment, Transaction, User, Notification
from app.auth.security import get_current_user

router = APIRouter(prefix="/payments", tags=["Payment Tracking"])

@router.get("")
def get_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payment)
    if current_user.role in ["farmer", "fpo"]:
        query = query.filter(Payment.farmer_id == current_user.id)
    elif current_user.role == "buyer":
        query = query.filter(Payment.buyer_id == current_user.id)

    payments = query.order_by(Payment.id.desc()).all()
    result = []
    for p in payments:
        tx = db.query(Transaction).filter(Transaction.id == p.transaction_id).first()
        result.append({
            "id": p.id,
            "transaction_id": p.transaction_id,
            "tx_number": tx.tx_number if tx else "TX-UNKNOWN",
            "crop_name": tx.crop_name if tx else "Agricultural Produce",
            "amount": p.amount,
            "status": p.status,
            "due_date": p.due_date,
            "payment_date": p.payment_date,
            "transaction_ref": p.transaction_ref
        })
    return result

@router.put("/{payment_id}/mark-paid")
def mark_payment_paid(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    payment.status = "Paid"
    payment.payment_date = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    payment.transaction_ref = f"NEFT-SIM-{random.randint(100000, 999999)}"

    # Update associated transaction status
    tx = db.query(Transaction).filter(Transaction.id == payment.transaction_id).first()
    if tx:
        tx.payment_status = "Paid"
        tx.current_stage = "Payment Completed"

    db.add(Notification(
        user_id=payment.farmer_id,
        title="Payment Received",
        message=f"Payment of ₹{payment.amount:,.2f} for Transaction {tx.tx_number if tx else ''} has been marked as received.",
        type="payment"
    ))

    db.commit()
    return {"message": "Payment marked as paid", "status": "Paid", "ref": payment.transaction_ref}
