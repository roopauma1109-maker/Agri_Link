import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Grievance, User, Notification
from app.schemas.schemas import GrievanceCreate
from app.auth.security import get_current_user

router = APIRouter(prefix="/grievances", tags=["Grievance System"])

@router.post("")
def create_grievance(
    g_data: GrievanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t_no = f"GRV-2026-{random.randint(1000, 9999)}"
    new_g = Grievance(
        ticket_no=t_no,
        user_id=current_user.id,
        transaction_id=g_data.transaction_id,
        issue_type=g_data.issue_type,
        description=g_data.description,
        priority=g_data.priority,
        evidence_url=g_data.evidence_url,
        status="Open"
    )
    db.add(new_g)

    db.add(Notification(
        user_id=current_user.id,
        title="Grievance Ticket Registered",
        message=f"Grievance ticket {t_no} registered for '{g_data.issue_type}'. Our support officer will review it within 24 hours.",
        type="grievance"
    ))

    db.commit()
    return {"message": "Grievance ticket submitted successfully", "ticket_no": t_no}

@router.get("")
def get_grievances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Grievance)
    if current_user.role != "admin":
        query = query.filter(Grievance.user_id == current_user.id)

    items = query.order_by(Grievance.id.desc()).all()
    result = []
    for g in items:
        result.append({
            "id": g.id,
            "ticket_no": g.ticket_no,
            "transaction_id": g.transaction_id,
            "issue_type": g.issue_type,
            "description": g.description,
            "priority": g.priority,
            "status": g.status,
            "admin_remarks": g.admin_remarks,
            "created_at": g.created_at,
            "user_name": g.user.full_name if g.user else "User"
        })
    return result

@router.put("/{grievance_id}/status")
def update_grievance_status(
    grievance_id: int,
    status_val: str,
    remarks: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update grievance ticket status")

    g = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")

    g.status = status_val
    g.admin_remarks = remarks

    db.add(Notification(
        user_id=g.user_id,
        title="Grievance Status Updated",
        message=f"Ticket {g.ticket_no} status changed to {status_val}. Remarks: {remarks}",
        type="grievance"
    ))

    db.commit()
    return {"message": "Grievance status updated"}
