import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FPODashboard from './pages/FPODashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import MarketIntelligence from './pages/MarketIntelligence';
import CreateCropLot from './pages/CreateCropLot';
import MyCropLots from './pages/MyCropLots';
import BuyerMatching from './pages/BuyerMatching';
import VerifiedBuyers from './pages/VerifiedBuyers';
import OffersPage from './pages/OffersPage';
import LogisticsPage from './pages/LogisticsPage';
import StoragePage from './pages/StoragePage';
import TransactionsPage from './pages/TransactionsPage';
import PaymentsPage from './pages/PaymentsPage';
import GrievancesPage from './pages/GrievancesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminVerification from './pages/AdminVerification';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-500">Loading AgriLink...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/market-intelligence" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/market-intelligence" element={<MarketIntelligence />} />
          <Route path="/verified-buyers" element={<VerifiedBuyers />} />

          {/* Protected Role Dashboards */}
          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fpo-dashboard"
            element={
              <ProtectedRoute allowedRoles={['fpo', 'admin']}>
                <FPODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-verification"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminVerification />
              </ProtectedRoute>
            }
          />

          {/* Shared Operations Routes */}
          <Route path="/marketplace" element={<BuyerMarketplace />} />
          <Route
            path="/create-crop-lot"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo', 'admin']}>
                <CreateCropLot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-crop-lots"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo', 'admin']}>
                <MyCropLots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-matching"
            element={
              <ProtectedRoute>
                <BuyerMatching />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <OffersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistics"
            element={
              <ProtectedRoute>
                <LogisticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <StoragePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grievances"
            element={
              <ProtectedRoute>
                <GrievancesPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
