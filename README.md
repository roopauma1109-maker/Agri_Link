# AgriLink: Smart Market Linkage & Price Discovery Platform

> **Department of Skills, Employment, Entrepreneurship & Innovation • Government of Maharashtra**

AgriLink is a production-ready, full-stack AgriTech web application designed to strengthen market linkages, enhance price discovery, eliminate information asymmetry, and provide direct buyer matching for farmers and Farmer Producer Organizations (FPOs) across Maharashtra.

---

## 🌟 Key Features

1. **Role-Based Workspaces**: Customized dashboards for **Farmer**, **FPO Aggregator**, **Buyer**, and **State Administrator**.
2. **Mandi Price Discovery & Comparison**: Real-time benchmark prices across major Maharashtra APMC mandis (Nashik, Pune, Vashi/Mumbai, Nagpur, Kolhapur, Ahmednagar, Sangli).
3. **Automated Multi-Factor Buyer Matching**: Transparent algorithmic scoring engine based on Crop suitability (40%), Quantity compatibility (20%), Location proximity (20%), and Quality grade (20%).
4. **Sale-Window Smart Recommendation**: Transparent rule-based price intelligence system analyzing 14-day trends and arrival volumes to advise farmers on optimal selling windows.
5. **Digital Offer & Negotiation Workflow**: Direct digital offers and counter-offers between buyers and farmers/FPOs, converting accepted bids automatically into active transaction contracts.
6. **Farmer Price Realisation Calculator**: Interactive simulation showing income gains when selling directly via AgriLink matching vs spot local mandi rates.
7. **FPO Bulk Lot Aggregation**: Allows FPOs to pool produce from multiple smallholders (e.g. 18 farmers -> 12.5 Tons of Onion) to command institutional buyer volume premiums.
8. **Integrated Logistics & Transport Booking**: Distance-based transport cost estimator and booking portal for Tata Ace, Mini Trucks, and Heavy Commercial vehicles.
9. **Cold Storage Network**: Directory of temperature-controlled storage facilities with live capacity tracking to mitigate post-harvest loss.
10. **Transaction Timeline & Audit Trail**: Real-time order lifecycle tracking from harvest declaration to payment completion.
11. **Settlement & Grievance Redressal**: Direct digital payment tracking with simulated settlement confirmation and administrative grievance ticket resolution.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Data Visualization**: Recharts (7-day trend line charts, mandi price bar charts, arrival volume area charts, demand distribution pie charts)
- **Routing**: React Router v6
- **State Management**: React Context API (`AuthContext`)

### Backend
- **Framework**: Python 3.11 + FastAPI + Uvicorn
- **ORM & Database**: SQLAlchemy 2.0 + SQLite (`agrilink.db`)
- **Authentication**: JWT (JSON Web Tokens) with PBKDF2 password hashing & Role-Based Access Control (RBAC)

---

## 🔐 Demo Accounts Credentials

The login page features 1-click preset buttons for all demo accounts:

| User Role | Email | Password | Primary Location | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@agrilink.demo` | `Farmer@123` | Nashik | Mandi rates, create crop lots, view buyer offers, price calculator |
| **FPO** | `fpo@agrilink.demo` | `Fpo@123` | Nashik | Aggregate member harvest, bulk buyer deals, volume sales |
| **Buyer** | `buyer@agrilink.demo` | `Buyer@123` | Mumbai | Search crop lots, place digital offers, track deliveries |
| **Admin** | `admin@agrilink.demo` | `Admin@123` | Mumbai | Verify buyers, system analytics, grievance resolution console |

---

## 🚀 Quick Start Guide

### 1. Run Backend Server (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m app.database.seed
python main.py
```
*Backend server runs at:* `http://localhost:8000`

### 2. Run Frontend App (Vite React)
```bash
cd frontend
npm install
npm run dev
```
*Frontend app runs at:* `http://localhost:5173`

---

## 📡 Key REST API Endpoints

- `POST /auth/login` - User authentication & JWT token generation
- `POST /auth/register` - Public registration for Farmer, FPO, and Buyer roles
- `GET /markets/prices` - Mandi market benchmark rates & 7-day trend
- `GET /markets/comparison` - Cross-mandi price matrix
- `GET /markets/intelligence` - Sale-window advice & trend analysis
- `POST /crop-lots` - Create harvest crop lot
- `GET /matching/lot/{id}` - Algorithmic buyer matching scores
- `POST /offers` - Make digital purchase offer
- `PUT /offers/{id}/accept` - Accept offer & auto-create Transaction
- `POST /logistics/book` - Book agricultural vehicle transport
- `PUT /payments/{id}/mark-paid` - Mark payment settlement
- `POST /grievances` - File support dispute ticket
- `GET /admin/statistics` - State-wide AgriLink platform metrics

---

## 🏷️ Prototype Notice
This application uses realistic benchmark market data for Maharashtra. Data badges in the UI are labeled **"Prototype • Demo Market Data"**.

---

© 2026 AgriLink • Smart Market Linkage & Price Discovery Platform
