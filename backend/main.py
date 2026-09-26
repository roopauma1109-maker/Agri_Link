import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import Base, engine
from app.database.seed import seed_db

# Import routes
from app.routes import auth, markets, crop_lots, buyers, matching, offers, transactions, logistics, storage, payments, grievances, notifications, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        seed_db()
    except Exception as e:
        print("Startup seed note:", e)
    yield

app = FastAPI(
    title="AgriLink Backend API",
    description="Smart Market Linkage & Price Discovery Platform REST Services",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(markets.router)
app.include_router(crop_lots.router)
app.include_router(buyers.router)
app.include_router(matching.router)
app.include_router(offers.router)
app.include_router(transactions.router)
app.include_router(logistics.router)
app.include_router(storage.router)
app.include_router(payments.router)
app.include_router(grievances.router)
app.include_router(notifications.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AgriLink API",
        "subtitle": "Smart Market Linkage & Price Discovery Platform",
        "prototype_mode": "Prototype • Demo Market Data",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
