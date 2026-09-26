import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, TrendingUp, PlusCircle, Package, Users, Tag, 
  Truck, Warehouse, CreditCard, AlertTriangle, ShieldCheck, Calculator, X, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, closeMobileSidebar, openCalculator }) {
  const { user } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const renderRoleLinks = () => {
    if (!user) return null;

    if (user.role === 'farmer') {
      return (
        <>
          <NavLink to="/farmer-dashboard" className={navItemClass} onClick={closeMobileSidebar}>
            <LayoutDashboard className="w-4 h-4" /> Farmer Dashboard
          </NavLink>
          <NavLink to="/create-crop-lot" className={navItemClass} onClick={closeMobileSidebar}>
            <PlusCircle className="w-4 h-4" /> Create Crop Lot
          </NavLink>
          <NavLink to="/my-crop-lots" className={navItemClass} onClick={closeMobileSidebar}>
            <Package className="w-4 h-4" /> My Crop Lots
          </NavLink>
          <NavLink to="/buyer-matching" className={navItemClass} onClick={closeMobileSidebar}>
            <Sparkles className="w-4 h-4" /> Smart Buyer Matching
          </NavLink>
          <NavLink to="/offers" className={navItemClass} onClick={closeMobileSidebar}>
            <Tag className="w-4 h-4" /> Buyer Offers
          </NavLink>
        </>
      );
    }

    if (user.role === 'fpo') {
      return (
        <>
          <NavLink to="/fpo-dashboard" className={navItemClass} onClick={closeMobileSidebar}>
            <LayoutDashboard className="w-4 h-4" /> FPO Aggregator Dashboard
          </NavLink>
          <NavLink to="/create-crop-lot" className={navItemClass} onClick={closeMobileSidebar}>
            <PlusCircle className="w-4 h-4" /> Create Bulk Aggregated Lot
          </NavLink>
          <NavLink to="/my-crop-lots" className={navItemClass} onClick={closeMobileSidebar}>
            <Package className="w-4 h-4" /> Aggregated Lots
          </NavLink>
          <NavLink to="/offers" className={navItemClass} onClick={closeMobileSidebar}>
            <Tag className="w-4 h-4" /> Offers & Deals
          </NavLink>
        </>
      );
    }

    if (user.role === 'buyer') {
      return (
        <>
          <NavLink to="/buyer-dashboard" className={navItemClass} onClick={closeMobileSidebar}>
            <LayoutDashboard className="w-4 h-4" /> Buyer Dashboard
          </NavLink>
          <NavLink to="/marketplace" className={navItemClass} onClick={closeMobileSidebar}>
            <Package className="w-4 h-4" /> Crop Marketplace
          </NavLink>
          <NavLink to="/offers" className={navItemClass} onClick={closeMobileSidebar}>
            <Tag className="w-4 h-4" /> My Digital Offers
          </NavLink>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <NavLink to="/admin-dashboard" className={navItemClass} onClick={closeMobileSidebar}>
            <ShieldCheck className="w-4 h-4" /> Admin Console
          </NavLink>
          <NavLink to="/admin-verification" className={navItemClass} onClick={closeMobileSidebar}>
            <Users className="w-4 h-4" /> Buyer Verification
          </NavLink>
        </>
      );
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-3 lg:hidden border-b border-slate-100 mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation Menu</span>
          <button onClick={closeMobileSidebar} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Role Specific Section */}
          {user && (
            <div>
              <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Role Workspace ({user.role})
              </p>
              <nav className="space-y-1">{renderRoleLinks()}</nav>
            </div>
          )}

          {/* Market Intelligence */}
          <div>
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Market Intelligence
            </p>
            <nav className="space-y-1">
              <NavLink to="/market-intelligence" className={navItemClass} onClick={closeMobileSidebar}>
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Mandi Price Discovery
              </NavLink>
              <NavLink to="/verified-buyers" className={navItemClass} onClick={closeMobileSidebar}>
                <Users className="w-4 h-4 text-blue-600" /> Verified Buyers Directory
              </NavLink>
            </nav>
          </div>

          {/* Operations & Logistics */}
          <div>
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Fulfillment & Settlement
            </p>
            <nav className="space-y-1">
              <NavLink to="/transactions" className={navItemClass} onClick={closeMobileSidebar}>
                <Package className="w-4 h-4 text-indigo-600" /> Transaction Timeline
              </NavLink>
              <NavLink to="/logistics" className={navItemClass} onClick={closeMobileSidebar}>
                <Truck className="w-4 h-4 text-amber-600" /> Logistics Booking
              </NavLink>
              <NavLink to="/storage" className={navItemClass} onClick={closeMobileSidebar}>
                <Warehouse className="w-4 h-4 text-cyan-600" /> Cold Storage Directory
              </NavLink>
              <NavLink to="/payments" className={navItemClass} onClick={closeMobileSidebar}>
                <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Settlements
              </NavLink>
              <NavLink to="/grievances" className={navItemClass} onClick={closeMobileSidebar}>
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Grievance Desk
              </NavLink>
            </nav>
          </div>

          {/* Calculator Tool Banner */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (closeMobileSidebar) closeMobileSidebar();
                openCalculator();
              }}
              className="w-full p-3 bg-gradient-to-r from-emerald-600 to-agri-800 text-white rounded-2xl text-left text-xs font-semibold shadow-md shadow-emerald-800/15 hover:opacity-95 transition-opacity flex items-center gap-3"
            >
              <div className="p-2 bg-white/20 rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Price Calculator</p>
                <p className="text-[10px] text-emerald-100 font-normal">Estimate direct sales gain</p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
