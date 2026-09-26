from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Transport, User, Notification
from app.schemas.schemas import TransportBook
from app.auth.security import get_current_user

router = APIRouter(prefix="/logistics", tags=["Logistics Module"])

VEHICLES = [
    {
        "id": "v1",
        "vehicle_type": "Tata Ace (1.5 Ton)",
        "capacity_tons": 1.5,
        "base_rate": 800,
        "per_km_rate": 22,
        "suitable_for": "Small batches & local mandi supply"
    },
    {
        "id": "v2",
        "vehicle_type": "Mini Truck (3 Ton)",
        "capacity_tons": 3.0,
        "base_rate": 1400,
        "per_km_rate": 35,
        "suitable_for": "Medium harvest lots & regional buyers"
    },
    {
        "id": "v3",
        "vehicle_type": "Heavy Commercial Truck (10 Ton)",
        "capacity_tons": 10.0,
        "base_rate": 4500,
        "per_km_rate": 55,
        "suitable_for": "Bulk FPO shipments & interstate transport"
    }
]

@router.get("/vehicles")
def get_vehicles():
    return VEHICLES

@router.post("/estimate")
def estimate_cost(vehicle_type: str, distance_km: float):
    v = next((item for item in VEHICLES if item["vehicle_type"] == vehicle_type), VEHICLES[1])
    cost = v["base_rate"] + (distance_km * v["per_km_rate"])
    return {
        "vehicle_type": vehicle_type,
        "distance_km": distance_km,
        "estimated_cost": round(cost, 2),
        "capacity_tons": v["capacity_tons"]
    }

@router.post("/book")
def book_transport(
    booking: TransportBook,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_transport = Transport(
        transaction_id=booking.transaction_id,
        user_id=current_user.id,
        vehicle_type=booking.vehicle_type,
        capacity_tons=booking.capacity_tons,
        distance_km=booking.distance_km,
        estimated_cost=booking.estimated_cost,
        pickup_location=booking.pickup_location,
        destination=booking.destination,
        pickup_date=booking.pickup_date,
        status="Transport Scheduled"
    )
    db.add(new_transport)

    db.add(Notification(
        user_id=current_user.id,
        title="Transport Booking Confirmed",
        message=f"{booking.vehicle_type} booked from {booking.pickup_location} to {booking.destination} on {booking.pickup_date}.",
        type="transport"
    ))

    db.commit()
    return {"message": "Transport scheduled successfully", "status": "Transport Scheduled"}

@router.get("/my-bookings")
def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Transport).filter(Transport.user_id == current_user.id).order_by(Transport.id.desc()).all()
    return bookings
