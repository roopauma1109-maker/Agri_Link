from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str # farmer, fpo, buyer
    full_name: str
    phone: Optional[str] = None
    district: Optional[str] = "Nashik"
    state: Optional[str] = "Maharashtra"
    
    # Specific fields
    organization_name: Optional[str] = None # for FPO
    company_name: Optional[str] = None # for Buyer
    buyer_type: Optional[str] = "Wholesaler" # for Buyer

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    full_name: str
    phone: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

    class Config:
        from_attributes = True

# Crop Lot Schemas
class CropLotCreate(BaseModel):
    crop_name: str
    variety: str = "Hybrid"
    quantity: float
    unit: str = "kg"
    farm_location: str
    harvest_date: str
    expected_price: float
    quality_grade: str = "A"
    moisture_percent: float = 12.0
    packaging_type: str = "Crates"
    available_from: str
    storage_required: bool = False
    is_fpo_aggregated: bool = False
    fpo_member_count: int = 1

class CropLotResponse(BaseModel):
    id: int
    lot_number: str
    user_id: int
    crop_name: str
    variety: str
    quantity: float
    unit: str
    farm_location: str
    harvest_date: str
    expected_price: float
    quality_grade: str
    moisture_percent: float
    packaging_type: str
    available_from: str
    storage_required: bool
    is_fpo_aggregated: bool
    fpo_member_count: int
    status: str
    created_at: datetime
    owner_name: Optional[str] = None

    class Config:
        from_attributes = True

# Offer Schemas
class OfferCreate(BaseModel):
    lot_id: int
    price_per_unit: float
    quantity: float
    payment_terms: str = "Within 2 days of delivery"
    pickup_date: str
    offer_expiry: str
    message: Optional[str] = None

class CounterOfferCreate(BaseModel):
    counter_price: float
    counter_terms: Optional[str] = None

class OfferResponse(BaseModel):
    id: int
    lot_id: int
    buyer_id: int
    buyer_company: Optional[str] = None
    buyer_name: Optional[str] = None
    price_per_unit: float
    quantity: float
    total_amount: float
    payment_terms: str
    pickup_date: str
    offer_expiry: str
    message: Optional[str] = None
    status: str
    created_at: datetime
    crop_name: Optional[str] = None

    class Config:
        from_attributes = True

# Logistics Schema
class TransportBook(BaseModel):
    transaction_id: Optional[int] = None
    vehicle_type: str
    capacity_tons: float
    distance_km: float
    estimated_cost: float
    pickup_location: str
    destination: str
    pickup_date: str

# Grievance Schema
class GrievanceCreate(BaseModel):
    transaction_id: Optional[str] = None
    issue_type: str
    description: str
    priority: str = "Medium"
    evidence_url: Optional[str] = None

# Price Intelligence & Matching
class MatchingBuyer(BaseModel):
    buyer_id: int
    company_name: str
    buyer_type: str
    location: str
    match_score: float
    required_quantity: str
    quality_grade: str
    offer_range: str
    verification_status: str
    reasons: List[str]
