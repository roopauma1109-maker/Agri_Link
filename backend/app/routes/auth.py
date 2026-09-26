from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, FarmerProfile, FPOProfile, BuyerProfile
from app.schemas.schemas import UserRegister, UserLogin, Token
from app.auth.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    if user_data.role not in ["farmer", "fpo", "buyer"]:
        raise HTTPException(status_code=400, detail="Public registration only allowed for farmer, fpo, or buyer")

    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_pwd,
        role=user_data.role,
        full_name=user_data.full_name,
        phone=user_data.phone,
        district=user_data.district or "Nashik",
        state=user_data.state or "Maharashtra"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Role specific profiles
    if user_data.role == "farmer":
        db.add(FarmerProfile(user_id=new_user.id))
    elif user_data.role == "fpo":
        db.add(FPOProfile(
            user_id=new_user.id,
            organization_name=user_data.organization_name or user_data.full_name,
            registration_no=f"FPO-MH-{new_user.id:04d}",
            district=new_user.district
        ))
    elif user_data.role == "buyer":
        db.add(BuyerProfile(
            user_id=new_user.id,
            company_name=user_data.company_name or user_data.full_name,
            buyer_type=user_data.buyer_type or "Wholesaler",
            location=new_user.district
        ))
    db.commit()

    token = create_access_token({"sub": new_user.id, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "full_name": new_user.full_name,
            "district": new_user.district,
            "state": new_user.state
        }
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "full_name": user.full_name,
            "district": user.district,
            "state": user.state
        }
    }

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "district": current_user.district,
        "state": current_user.state
    }
