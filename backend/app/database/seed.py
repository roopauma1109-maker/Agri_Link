import datetime
from sqlalchemy.orm import Session
from app.database.connection import engine, SessionLocal, Base
from app.models.models import (
    User, FarmerProfile, FPOProfile, BuyerProfile, Crop, Market, MarketPrice,
    CropLot, BuyerDemand, Offer, Transaction, Transport, StorageFacility, Payment, Grievance, Notification
)
from app.auth.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Clear existing data if any
    try:
        db.query(Notification).delete()
        db.query(Grievance).delete()
        db.query(Payment).delete()
        db.query(Transport).delete()
        db.query(Transaction).delete()
        db.query(Offer).delete()
        db.query(BuyerDemand).delete()
        db.query(CropLot).delete()
        db.query(MarketPrice).delete()
        db.query(Market).delete()
        db.query(Crop).delete()
        db.query(StorageFacility).delete()
        db.query(BuyerProfile).delete()
        db.query(FPOProfile).delete()
        db.query(FarmerProfile).delete()
        db.query(User).delete()
        db.commit()
    except Exception as e:
        print("Clear db exception:", e)
        db.rollback()

    print("Seeding AgriLink demo database...")

    # 1. Create Demo Users & Profiles
    # Farmer
    farmer_user = User(
        email="farmer@agrilink.demo",
        password_hash=get_password_hash("Farmer@123"),
        role="farmer",
        full_name="Ramesh Patil",
        phone="+91 98220 11223",
        address="Pimpalgaon, Niphad",
        district="Nashik",
        state="Maharashtra"
    )
    db.add(farmer_user)
    db.flush()

    farmer_prof = FarmerProfile(
        user_id=farmer_user.id,
        farm_size_acres=4.5,
        primary_crops="Tomato, Onion, Grapes"
    )
    db.add(farmer_prof)

    # FPO
    fpo_user = User(
        email="fpo@agrilink.demo",
        password_hash=get_password_hash("Fpo@123"),
        role="fpo",
        full_name="Nashik Farmers Collective",
        phone="+91 94230 44556",
        address="APMC Yard, Dindori Road",
        district="Nashik",
        state="Maharashtra"
    )
    db.add(fpo_user)
    db.flush()

    fpo_prof = FPOProfile(
        user_id=fpo_user.id,
        organization_name="Nashik Farmer Producer Organization",
        registration_no="FPO-MH-2023-8891",
        member_count=65,
        district="Nashik"
    )
    db.add(fpo_prof)

    # Buyer 1 (Main Demo Buyer)
    buyer1_user = User(
        email="buyer@agrilink.demo",
        password_hash=get_password_hash("Buyer@123"),
        role="buyer",
        full_name="Anand Varma",
        phone="+91 98200 77889",
        address="Vashi APMC Complex",
        district="Mumbai",
        state="Maharashtra"
    )
    db.add(buyer1_user)
    db.flush()

    buyer1_prof = BuyerProfile(
        user_id=buyer1_user.id,
        company_name="ABC Foods Pvt Ltd",
        buyer_type="Wholesaler & Food Processor",
        location="Mumbai",
        required_crops="Tomato, Onion, Potato, Grapes",
        required_quantity="10,000 kg/month",
        payment_terms="Payment within 2 days",
        verification_status="Verified",
        completed_transactions=42,
        reliability_score=96.5
    )
    db.add(buyer1_prof)

    # Buyer 2
    buyer2_user = User(
        email="buyer2@agrilink.demo",
        password_hash=get_password_hash("Buyer@123"),
        role="buyer",
        full_name="Sanjay Kulkarni",
        phone="+91 98900 11224",
        address="Market Yard, Gultekdi",
        district="Pune",
        state="Maharashtra"
    )
    db.add(buyer2_user)
    db.flush()

    buyer2_prof = BuyerProfile(
        user_id=buyer2_user.id,
        company_name="XYZ Fresh Retail",
        buyer_type="Retail Chain",
        location="Pune",
        required_crops="Tomato, Potato, Wheat",
        required_quantity="5,000 kg/month",
        payment_terms="Immediate NEFT / UPI",
        verification_status="Verified",
        completed_transactions=19,
        reliability_score=91.0
    )
    db.add(buyer2_prof)

    # Buyer 3
    buyer3_user = User(
        email="buyer3@agrilink.demo",
        password_hash=get_password_hash("Buyer@123"),
        role="buyer",
        full_name="Pravin Deshmukh",
        phone="+91 97650 33445",
        address="MIDC Industrial Area",
        district="Nagpur",
        state="Maharashtra"
    )
    db.add(buyer3_user)
    db.flush()

    buyer3_prof = BuyerProfile(
        user_id=buyer3_user.id,
        company_name="GreenFresh Processors",
        buyer_type="Exporter",
        location="Nagpur",
        required_crops="Onion, Soyabean, Cotton",
        required_quantity="20,000 kg/month",
        payment_terms="50% Advance, 50% on Delivery",
        verification_status="Verified",
        completed_transactions=31,
        reliability_score=94.0
    )
    db.add(buyer3_prof)

    # Admin
    admin_user = User(
        email="admin@agrilink.demo",
        password_hash=get_password_hash("Admin@123"),
        role="admin",
        full_name="AgriLink Platform Officer",
        phone="+91 22 2202 5544",
        address="Mantralaya, Nariman Point",
        district="Mumbai",
        state="Maharashtra"
    )
    db.add(admin_user)
    db.commit()

    # 2. Seed Crops & Markets
    crop_names = ["Tomato", "Onion", "Potato", "Wheat", "Rice", "Grapes", "Soybean", "Cotton", "Maize", "Sugarcane"]
    for c in crop_names:
        db.add(Crop(name=c, category="Agricultural Produce", standard_unit="kg"))

    markets_data = [
        {"name": "Nashik APMC", "district": "Nashik"},
        {"name": "Pune APMC", "district": "Pune"},
        {"name": "Vashi APMC (Mumbai)", "district": "Mumbai"},
        {"name": "Nagpur APMC", "district": "Nagpur"},
        {"name": "Kolhapur APMC", "district": "Kolhapur"},
        {"name": "Ahmednagar APMC", "district": "Ahmednagar"},
        {"name": "Sangli APMC", "district": "Sangli"},
    ]
    for m in markets_data:
        db.add(Market(name=m["name"], district=m["district"]))
    db.commit()

    # 3. Seed Market Prices & Trends (20+ records)
    prices_seed = [
        # Tomato
        {"crop": "Tomato", "market": "Nashik APMC", "district": "Nashik", "date": "2026-09-25", "min": 22.0, "max": 26.0, "modal": 24.0, "arrival": 180, "trend": 8.2},
        {"crop": "Tomato", "market": "Pune APMC", "district": "Pune", "date": "2026-09-25", "min": 20.0, "max": 24.0, "modal": 22.0, "arrival": 140, "trend": 2.1},
        {"crop": "Tomato", "market": "Vashi APMC (Mumbai)", "district": "Mumbai", "date": "2026-09-25", "min": 25.0, "max": 29.0, "modal": 27.0, "arrival": 260, "trend": 10.5},
        {"crop": "Tomato", "market": "Nagpur APMC", "district": "Nagpur", "date": "2026-09-25", "min": 19.0, "max": 23.0, "modal": 21.0, "arrival": 110, "trend": -1.5},
        {"crop": "Tomato", "market": "Kolhapur APMC", "district": "Kolhapur", "date": "2026-09-25", "min": 23.0, "max": 27.0, "modal": 25.0, "arrival": 95, "trend": 4.0},

        # Onion
        {"crop": "Onion", "market": "Nashik APMC", "district": "Nashik", "date": "2026-09-25", "min": 28.0, "max": 34.0, "modal": 31.0, "arrival": 450, "trend": 5.4},
        {"crop": "Onion", "market": "Pune APMC", "district": "Pune", "date": "2026-09-25", "min": 27.0, "max": 33.0, "modal": 30.0, "arrival": 320, "trend": 3.2},
        {"crop": "Onion", "market": "Vashi APMC (Mumbai)", "district": "Mumbai", "date": "2026-09-25", "min": 32.0, "max": 38.0, "modal": 35.0, "arrival": 510, "trend": 6.8},
        {"crop": "Onion", "market": "Ahmednagar APMC", "district": "Ahmednagar", "date": "2026-09-25", "min": 26.0, "max": 31.0, "modal": 29.0, "arrival": 280, "trend": 1.5},

        # Potato
        {"crop": "Potato", "market": "Nashik APMC", "district": "Nashik", "date": "2026-09-25", "min": 20.0, "max": 24.0, "modal": 22.0, "arrival": 210, "trend": -0.8},
        {"crop": "Potato", "market": "Pune APMC", "district": "Pune", "date": "2026-09-25", "min": 21.0, "max": 25.0, "modal": 23.0, "arrival": 190, "trend": 0.5},
        {"crop": "Potato", "market": "Vashi APMC (Mumbai)", "district": "Mumbai", "date": "2026-09-25", "min": 23.0, "max": 27.0, "modal": 25.0, "arrival": 340, "trend": 2.0},

        # Grapes
        {"crop": "Grapes", "market": "Nashik APMC", "district": "Nashik", "date": "2026-09-25", "min": 65.0, "max": 85.0, "modal": 75.0, "arrival": 90, "trend": 12.0},
        {"crop": "Grapes", "market": "Sangli APMC", "district": "Sangli", "date": "2026-09-25", "min": 60.0, "max": 80.0, "modal": 70.0, "arrival": 75, "trend": 8.5},
        {"crop": "Grapes", "market": "Vashi APMC (Mumbai)", "district": "Mumbai", "date": "2026-09-25", "min": 80.0, "max": 110.0, "modal": 95.0, "arrival": 120, "trend": 14.2},

        # Wheat
        {"crop": "Wheat", "market": "Nagpur APMC", "district": "Nagpur", "date": "2026-09-25", "min": 27.0, "max": 31.0, "modal": 29.0, "arrival": 310, "trend": 1.2},
        {"crop": "Wheat", "market": "Pune APMC", "district": "Pune", "date": "2026-09-25", "min": 28.0, "max": 33.0, "modal": 30.5, "arrival": 270, "trend": 2.5},

        # Soybean
        {"crop": "Soybean", "market": "Nagpur APMC", "district": "Nagpur", "date": "2026-09-25", "min": 44.0, "max": 50.0, "modal": 47.0, "arrival": 400, "trend": 4.1},
        {"crop": "Soybean", "market": "Kolhapur APMC", "district": "Kolhapur", "date": "2026-09-25", "min": 43.0, "max": 48.0, "modal": 45.5, "arrival": 220, "trend": 3.0},
    ]

    for p in prices_seed:
        db.add(MarketPrice(
            crop_name=p["crop"],
            market_name=p["market"],
            district=p["district"],
            date=p["date"],
            min_price=p["min"],
            max_price=p["max"],
            modal_price=p["modal"],
            arrival_volume=p["arrival"],
            trend_percent=p["trend"]
        ))
    db.commit()

    # 4. Seed Cold Storage Facilities
    storage_seed = [
        {"name": "Nashik Agro Cold Storage", "location": "Pimpalgaon, Nashik", "district": "Nashik", "total": 1200, "avail": 340, "price": 2.5, "phone": "+91 94230 88990"},
        {"name": "Mahagrapes Multi-Chamber Storage", "location": "Dindori, Nashik", "district": "Nashik", "total": 2000, "avail": 650, "price": 3.0, "phone": "+91 98221 44556"},
        {"name": "Pune Warehousing & Cold Chain", "location": "Chakan, Pune", "district": "Pune", "total": 1500, "avail": 410, "price": 2.8, "phone": "+91 98902 77881"},
        {"name": "Vashi APMC Central Storage", "location": "Vashi, Navi Mumbai", "district": "Mumbai", "total": 3000, "avail": 900, "price": 3.5, "phone": "+91 22 2789 1122"},
    ]
    for s in storage_seed:
        db.add(StorageFacility(
            name=s["name"],
            location=s["location"],
            district=s["district"],
            total_capacity_tons=s["total"],
            available_capacity_tons=s["avail"],
            price_per_kg_per_month=s["price"],
            contact_phone=s["phone"]
        ))
    db.commit()

    # 5. Seed Crop Lots
    lot1 = CropLot(
        lot_number="LOT-2026-00124",
        user_id=farmer_user.id,
        crop_name="Tomato",
        variety="Hybrid Red",
        quantity=2000.0,
        unit="kg",
        farm_location="Nashik",
        harvest_date="2026-09-23",
        expected_price=26.0,
        quality_grade="A",
        moisture_percent=11.5,
        packaging_type="Plastic Crates",
        available_from="2026-09-24",
        storage_required=False,
        status="Offer Received"
    )
    db.add(lot1)

    lot2 = CropLot(
        lot_number="LOT-2026-00125",
        user_id=farmer_user.id,
        crop_name="Onion",
        variety="Garwa Nashik Red",
        quantity=5000.0,
        unit="kg",
        farm_location="Nashik",
        harvest_date="2026-09-20",
        expected_price=32.0,
        quality_grade="A",
        moisture_percent=10.0,
        packaging_type="Jute Bags",
        available_from="2026-09-22",
        storage_required=True,
        status="Active"
    )
    db.add(lot2)

    lot3 = CropLot(
        lot_number="LOT-2026-00126",
        user_id=fpo_user.id,
        crop_name="Onion",
        variety="Aggregated Red Onion",
        quantity=12500.0,
        unit="kg",
        farm_location="Nashik Collective APMC",
        harvest_date="2026-09-21",
        expected_price=31.5,
        quality_grade="A",
        moisture_percent=10.5,
        packaging_type="Jute Mesh Bags",
        available_from="2026-09-23",
        storage_required=False,
        is_fpo_aggregated=True,
        fpo_member_count=18,
        status="Active"
    )
    db.add(lot3)

    lot4 = CropLot(
        lot_number="LOT-2026-00127",
        user_id=farmer_user.id,
        crop_name="Grapes",
        variety="Thompson Seedless",
        quantity=3000.0,
        unit="kg",
        farm_location="Niphad, Nashik",
        harvest_date="2026-09-24",
        expected_price=78.0,
        quality_grade="A",
        moisture_percent=14.0,
        packaging_type="Export Cartons",
        available_from="2026-09-25",
        storage_required=True,
        status="Sold"
    )
    db.add(lot4)

    db.commit()

    # 6. Seed Buyer Demands
    db.add(BuyerDemand(
        buyer_id=buyer1_user.id,
        crop_name="Tomato",
        required_quantity=5000,
        target_price_min=24,
        target_price_max=28,
        quality_grade="A",
        location="Mumbai"
    ))
    db.add(BuyerDemand(
        buyer_id=buyer2_user.id,
        crop_name="Tomato",
        required_quantity=2000,
        target_price_min=23,
        target_price_max=26,
        quality_grade="A",
        location="Pune"
    ))
    db.commit()

    # 7. Seed Offers
    offer1 = Offer(
        lot_id=lot1.id,
        buyer_id=buyer1_user.id,
        price_per_unit=26.0,
        quantity=2000.0,
        total_amount=52000.0,
        payment_terms="Payment within 2 days of delivery",
        pickup_date="2026-09-27",
        offer_expiry="2026-09-26",
        message="We accept Grade A Hybrid Tomato lot at your expected rate of ₹26/kg. Transport can be dispatched on 27th.",
        status="Pending"
    )
    db.add(offer1)

    offer2 = Offer(
        lot_id=lot4.id,
        buyer_id=buyer3_user.id,
        price_per_unit=80.0,
        quantity=3000.0,
        total_amount=240000.0,
        payment_terms="50% Advance, 50% on Delivery",
        pickup_date="2026-09-26",
        offer_expiry="2026-09-25",
        message="Export quality grapes offer accepted.",
        status="Accepted"
    )
    db.add(offer2)
    db.commit()

    # 8. Seed Transaction & Transport & Payment for completed deal
    tx1 = Transaction(
        tx_number="TX-2026-1024",
        lot_id=lot4.id,
        offer_id=offer2.id,
        farmer_id=farmer_user.id,
        buyer_id=buyer3_user.id,
        crop_name="Grapes",
        quantity=3000.0,
        price_per_unit=80.0,
        total_value=240000.0,
        current_stage="Delivered",
        payment_status="Pending"
    )
    db.add(tx1)
    db.flush()

    transport1 = Transport(
        transaction_id=tx1.id,
        user_id=farmer_user.id,
        vehicle_type="Mini Truck (3 Ton)",
        capacity_tons=3.0,
        driver_name="Suresh Kale",
        driver_phone="+91 98224 88991",
        distance_km=45.0,
        estimated_cost=2400.0,
        pickup_location="Niphad, Nashik",
        destination="MIDC Nagpur Facility",
        pickup_date="2026-09-26",
        status="Delivered"
    )
    db.add(transport1)

    pay1 = Payment(
        transaction_id=tx1.id,
        farmer_id=farmer_user.id,
        buyer_id=buyer3_user.id,
        amount=240000.0,
        status="Pending",
        due_date="2026-09-28",
        payment_date=None,
        transaction_ref="NEFT-SIM-2026-9912"
    )
    db.add(pay1)

    # 9. Seed Grievances
    db.add(Grievance(
        ticket_no="GRV-2026-0012",
        user_id=farmer_user.id,
        transaction_id="TX-2026-0811",
        issue_type="Payment Delay",
        description="Payment of ₹34,000 for previous Potato lot was delayed past agreed 2-day window.",
        priority="High",
        status="Under Review",
        admin_remarks="Reached out to buyer finance team for verification."
    ))

    # 10. Notifications
    db.add(Notification(
        user_id=farmer_user.id,
        title="New Buyer Offer Received",
        message="ABC Foods Pvt Ltd made an offer of ₹26/kg for your 2,000 kg Tomato lot (LOT-2026-00124).",
        type="offer"
    ))
    db.add(Notification(
        user_id=farmer_user.id,
        title="Transport Scheduled",
        message="Mini Truck transport booked for Grape lot delivery on 26th Sept.",
        type="transport"
    ))

    db.commit()
    print("AgriLink database successfully seeded!")

if __name__ == "__main__":
    seed_db()
