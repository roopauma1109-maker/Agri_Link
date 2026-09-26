import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Offer, CounterOffer, CropLot, Transaction, User, Notification, Payment
from app.schemas.schemas import OfferCreate, CounterOfferCreate, OfferResponse
from app.auth.security import get_current_user

router = APIRouter(prefix="/offers", tags=["Digital Offer System"])

@router.post("", response_model=OfferResponse)
def create_offer(
    offer_data: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can submit purchase offers")

    lot = db.query(CropLot).filter(CropLot.id == offer_data.lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")

    total = round(offer_data.price_per_unit * offer_data.quantity, 2)

    new_offer = Offer(
        lot_id=lot.id,
        buyer_id=current_user.id,
        price_per_unit=offer_data.price_per_unit,
        quantity=offer_data.quantity,
        total_amount=total,
        payment_terms=offer_data.payment_terms,
        pickup_date=offer_data.pickup_date,
        offer_expiry=offer_data.offer_expiry,
        message=offer_data.message,
        status="Pending"
    )
    db.add(new_offer)
    lot.status = "Offer Received"

    # Notify Lot Owner
    buyer_company = current_user.buyer_profile.company_name if current_user.buyer_profile else current_user.full_name
    db.add(Notification(
        user_id=lot.user_id,
        title="New Digital Offer Received",
        message=f"{buyer_company} made an offer of ₹{offer_data.price_per_unit}/kg for your {lot.crop_name} lot ({lot.lot_number}). Total: ₹{total:,.2f}",
        type="offer"
    ))

    db.commit()
    db.refresh(new_offer)

    res = OfferResponse.from_orm(new_offer)
    res.buyer_company = buyer_company
    res.buyer_name = current_user.full_name
    res.crop_name = lot.crop_name
    return res

@router.get("", response_model=list[OfferResponse])
def get_offers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "farmer" or current_user.role == "fpo":
        # Get offers for lots owned by this user
        my_lot_ids = [l.id for l in current_user.crop_lots]
        offers = db.query(Offer).filter(Offer.lot_id.in_(my_lot_ids)).order_by(Offer.id.desc()).all()
    elif current_user.role == "buyer":
        offers = db.query(Offer).filter(Offer.buyer_id == current_user.id).order_by(Offer.id.desc()).all()
    else:
        offers = db.query(Offer).order_by(Offer.id.desc()).all()

    result = []
    for o in offers:
        res = OfferResponse.from_orm(o)
        res.buyer_company = o.buyer.buyer_profile.company_name if (o.buyer and o.buyer.buyer_profile) else (o.buyer.full_name if o.buyer else "Buyer")
        res.buyer_name = o.buyer.full_name if o.buyer else "Buyer"
        res.crop_name = o.lot.crop_name if o.lot else "Crop"
        result.append(res)
    return result

@router.put("/{offer_id}/accept")
def accept_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    lot = offer.lot
    if lot.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to accept this offer")

    offer.status = "Accepted"
    lot.status = "Sold"

    # Reject other pending offers for this lot
    other_offers = db.query(Offer).filter(Offer.lot_id == lot.id, Offer.id != offer.id).all()
    for o in other_offers:
        o.status = "Rejected"

    # Create Transaction automatically
    tx_num = f"TX-2026-{random.randint(1000, 9999)}"
    new_tx = Transaction(
        tx_number=tx_num,
        lot_id=lot.id,
        offer_id=offer.id,
        farmer_id=lot.user_id,
        buyer_id=offer.buyer_id,
        crop_name=lot.crop_name,
        quantity=offer.quantity,
        price_per_unit=offer.price_per_unit,
        total_value=offer.total_amount,
        current_stage="Offer Accepted",
        payment_status="Pending"
    )
    db.add(new_tx)
    db.flush()

    # Create Payment record
    due = (datetime.datetime.utcnow() + datetime.timedelta(days=2)).strftime("%Y-%m-%d")
    db.add(Payment(
        transaction_id=new_tx.id,
        farmer_id=lot.user_id,
        buyer_id=offer.buyer_id,
        amount=offer.total_amount,
        status="Pending",
        due_date=due
    ))

    # Notify Buyer
    db.add(Notification(
        user_id=offer.buyer_id,
        title="Offer Accepted!",
        message=f"Farmer {current_user.full_name} accepted your offer for {lot.crop_name} ({lot.lot_number}). Transaction {tx_num} initiated.",
        type="offer"
    ))

    db.commit()
    return {"message": "Offer accepted successfully", "transaction_number": tx_num}

@router.put("/{offer_id}/reject")
def reject_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    offer.status = "Rejected"

    db.add(Notification(
        user_id=offer.buyer_id,
        title="Offer Declined",
        message=f"Your offer for lot {offer.lot.lot_number} was declined.",
        type="offer"
    ))

    db.commit()
    return {"message": "Offer rejected"}

@router.post("/{offer_id}/counter")
def create_counter_offer(
    offer_id: int,
    counter_data: CounterOfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    new_counter = CounterOffer(
        offer_id=offer.id,
        counter_price=counter_data.counter_price,
        counter_terms=counter_data.counter_terms,
        sender_role=current_user.role,
        status="Pending"
    )
    db.add(new_counter)
    
    # Update offer status to Countered & new total
    offer.status = "Countered"
    offer.price_per_unit = counter_data.counter_price
    offer.total_amount = round(counter_data.counter_price * offer.quantity, 2)

    recipient_id = offer.buyer_id if current_user.role in ["farmer", "fpo"] else offer.lot.user_id
    db.add(Notification(
        user_id=recipient_id,
        title="Counter Offer Received",
        message=f"Counter offer of ₹{counter_data.counter_price}/kg submitted for lot {offer.lot.lot_number}.",
        type="offer"
    ))

    db.commit()
    return {"message": "Counter offer submitted successfully"}
