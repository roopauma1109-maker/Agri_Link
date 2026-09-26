import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, ShieldCheck, Search, Filter, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import OfferModal from '../components/OfferModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  useEffect(() => {
    api.getCropLots()
      .then(setLots)
      .catch(console.log);

    api.getOffers()
      .then(setOffers)
      .catch(console.log);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
              Buyer Procurement Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.full_name || 'ABC Foods Pvt Ltd'}</h1>
            <p className="text-xs text-purple-200 mt-1">
              Location: {user?.district || 'Mumbai'} • Status: <span className="text-emerald-400 font-bold">✓ Verified Buyer</span>
            </p>
          </div>

          <Link
            to="/marketplace"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Browse Crop Lots
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Available Marketplace Lots</span>
            <p className="text-2xl font-black text-slate-900">{lots.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active verified farmer lots</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">My Digital Offers</span>
            <p className="text-2xl font-black text-slate-900">{offers.length}</p>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">Submitted offers</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Completed Deals</span>
            <p className="text-2xl font-black text-slate-900">42</p>
            <p className="text-[11px] text-slate-500 mt-1">Total transactions</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Reliability Score</span>
            <p className="text-2xl font-black text-emerald-700">96.5%</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Top-rated buyer</p>
          </div>
        </div>

        {/* Available Crop Lots Grid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recommended Crop Lots</h3>
              <p className="text-xs text-slate-500">Farmers & FPO lots matching your procurement requirements</p>
            </div>
            <Link to="/marketplace" className="text-xs font-bold text-emerald-700 hover:underline">
              Explore Full Marketplace →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map((lot) => (
              <div key={lot.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{lot.crop_name}</span>
                    <StatusBadge status={lot.quality_grade === 'A' ? 'Grade A (Premium)' : `Grade ${lot.quality_grade}`} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold">Lot #{lot.lot_number}</p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Available Quantity:</span>
                      <strong className="text-slate-900">{lot.quantity} {lot.unit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <strong className="text-slate-800">{lot.farm_location}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Price:</span>
                      <strong className="text-emerald-700 font-bold">₹{lot.expected_price}/kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Seller:</span>
                      <span className="text-slate-700 font-medium">{lot.owner_name || 'Verified Farmer'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLot(lot);
                    setOfferModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Make Digital Offer
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <OfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        lot={selectedLot}
        onOfferSuccess={() => {
          api.getOffers().then(setOffers);
        }}
      />
    </DashboardLayout>
  );
}
