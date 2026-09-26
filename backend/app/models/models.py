import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # farmer, fpo, buyer, admin
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    district = Column(String, nullable=True)
    state = Column(String, default="Maharashtra")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer_profile = relationship("FarmerProfile", back_populates="user", uselist=False)
    fpo_profile = relationship("FPOProfile", back_populates="user", uselist=False)
    buyer_profile = relationship("BuyerProfile", back_populates="user", uselist=False)
    crop_lots = relationship("CropLot", back_populates="owner")
    offers_made = relationship("Offer", back_populates="buyer")
    grievances = relationship("Grievance", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    farm_size_acres = Column(Float, default=2.5)
    primary_crops = Column(String, default="Tomato, Onion, Potato")
    fpo_id = Column(Integer, ForeignKey("fpo_profiles.id"), nullable=True)

    user = relationship("User", back_populates="farmer_profile")

class FPOProfile(Base):
    __tablename__ = "fpo_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_name = Column(String, nullable=False)
    registration_no = Column(String, nullable=False)
    member_count = Column(Integer, default=50)
    district = Column(String, default="Nashik")

    user = relationship("User", back_populates="fpo_profile")

class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String, nullable=False)
    buyer_type = Column(String, default="Wholesaler") # Wholesaler, Processor, Retailer, Exporter
    location = Column(String, default="Mumbai")
    required_crops = Column(String, default="Tomato, Onion, Potato, Wheat")
    required_quantity = Column(String, default="5,000 kg/month")
    payment_terms = Column(String, default="Payment within 2 days")
    verification_status = Column(String, default="Verified") # Verified, Pending, Rejected
    completed_transactions = Column(Integer, default=28)
    reliability_score = Column(Float, default=94.5)

    user = relationship("User", back_populates="buyer_profile")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, default="Vegetable")
    standard_unit = Column(String, default="kg")

class Market(Base):
    __tablename__ = "markets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, default="Maharashtra")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, nullable=False)
    market_name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False) # Current benchmark price in Rs/kg
    arrival_volume = Column(Float, default=150.0) # in tons
    trend_percent = Column(Float, default=0.0) # e.g. +8.2% or -3.1%

class CropLot(Base):
    __tablename__ = "crop_lots"

    id = Column(Integer, primary_key=True, index=True)
    lot_number = Column(String, unique=True, index=True, nullable=False) # e.g. LOT-2026-00124
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String, nullable=False)
    variety = Column(String, default="Hybrid")
    quantity = Column(Float, nullable=False)
    unit = Column(String, default="kg")
    farm_location = Column(String, nullable=False)
    harvest_date = Column(String, nullable=False)
    expected_price = Column(Float, nullable=False)
    quality_grade = Column(String, default="A") # Grade A, B, C
    moisture_percent = Column(Float, default=12.0)
    packaging_type = Column(String, default="Crates")
    available_from = Column(String, nullable=False)
    storage_required = Column(Boolean, default=False)
    is_fpo_aggregated = Column(Boolean, default=False)
    fpo_member_count = Column(Integer, default=1)
    status = Column(String, default="Active") # Active, Offer Received, Sold, Completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="crop_lots")
    offers = relationship("Offer", back_populates="lot", cascade="all, delete-orphan")

class BuyerDemand(Base):
    __tablename__ = "buyer_demands"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String, nullable=False)
    required_quantity = Column(Float, nullable=False)
    target_price_min = Column(Float, nullable=False)
    target_price_max = Column(Float, nullable=False)
    quality_grade = Column(String, default="A")
    location = Column(String, nullable=False)

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    lot_id = Column(Integer, ForeignKey("crop_lots.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    price_per_unit = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    payment_terms = Column(String, default="Within 2 days of delivery")
    pickup_date = Column(String, nullable=False)
    offer_expiry = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String, default="Pending") # Pending, Accepted, Rejected, Countered
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    lot = relationship("CropLot", back_populates="offers")
    buyer = relationship("User", back_populates="offers_made")
    counter_offers = relationship("CounterOffer", back_populates="offer", cascade="all, delete-orphan")

class CounterOffer(Base):
    __tablename__ = "counter_offers"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    counter_price = Column(Float, nullable=False)
    counter_terms = Column(Text, nullable=True)
    sender_role = Column(String, nullable=False) # farmer or buyer
    status = Column(String, default="Pending") # Pending, Accepted, Rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    offer = relationship("Offer", back_populates="counter_offers")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    tx_number = Column(String, unique=True, index=True, nullable=False) # TX-2026-1024
    lot_id = Column(Integer, ForeignKey("crop_lots.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    total_value = Column(Float, nullable=False)
    current_stage = Column(String, default="Offer Accepted") 
    # Stages: Lot Created -> Buyer Matched -> Offer Received -> Offer Accepted -> Pickup Scheduled -> Delivered -> Payment Pending -> Payment Completed
    payment_status = Column(String, default="Pending") # Pending, Processing, Paid, Delayed, Disputed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Transport(Base):
    __tablename__ = "transports"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_type = Column(String, nullable=False) # Tata Ace, Mini Truck, Heavy Truck
    capacity_tons = Column(Float, nullable=False)
    driver_name = Column(String, default="Ramesh Shinde")
    driver_phone = Column(String, default="+91 98220 12345")
    distance_km = Column(Float, nullable=False)
    estimated_cost = Column(Float, nullable=False)
    pickup_location = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    pickup_date = Column(String, nullable=False)
    status = Column(String, default="Transport Scheduled") # Transport Scheduled, In Transit, Delivered
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StorageFacility(Base):
    __tablename__ = "storage_facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    district = Column(String, nullable=False)
    total_capacity_tons = Column(Float, nullable=False)
    available_capacity_tons = Column(Float, nullable=False)
    storage_type = Column(String, default="Cold Storage")
    price_per_kg_per_month = Column(Float, nullable=False)
    contact_phone = Column(String, default="+91 94230 88990")
    contact_email = Column(String, default="info@nashikcold.demo")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="Pending") # Pending, Processing, Paid, Delayed, Disputed
    due_date = Column(String, nullable=False)
    payment_date = Column(String, nullable=True)
    transaction_ref = Column(String, nullable=True)

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    ticket_no = Column(String, unique=True, index=True, nullable=False) # GRV-2026-0042
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_id = Column(String, nullable=True)
    issue_type = Column(String, nullable=False) # Payment Delay, Quality Dispute, Quantity Dispute, Delivery Problem, Buyer Issue, Seller Issue, Other
    description = Column(Text, nullable=False)
    priority = Column(String, default="Medium") # Low, Medium, High
    evidence_url = Column(String, nullable=True)
    status = Column(String, default="Open") # Open, Under Review, Resolved, Rejected
    admin_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="grievances")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    type = Column(String, default="info") # offer, transport, payment, grievance, info
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
