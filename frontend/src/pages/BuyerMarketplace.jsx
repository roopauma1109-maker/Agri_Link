import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, MapPin, Tag } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import OfferModal from '../components/OfferModal';
import { api } from '../services/api';

export default function BuyerMarketplace() {
  const [lots, setLots] = useState([]);
  const [cropFilter, setCropFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [selectedLot, setSelectedLot] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const fetchLots = async () => {
    try {
      const data = await api.getCropLots({
        crop: cropFilter,
        location: locationFilter,
        grade: gradeFilter
      });
      setLots(data || []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchLots();
  }, [cropFilter, locationFilter, gradeFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Crop Lot Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">Browse active harvest lots from Farmers and FPOs in Maharashtra</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              placeholder="Search by crop name (e.g. Tomato, Onion)..."
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 mr-2">Location:</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Nashik">Nashik</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Kolhapur">Kolhapur</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 mr-2">Quality Grade:</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="All">All Grades</option>
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Standard)</option>
              <option value="C">Grade C (Processing)</option>
            </select>
          </div>
        </div>

        {/* Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lots.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-xs text-slate-500">
              No crop lots matched your selected filters.
            </div>
          ) : (
            lots.map((lot) => (
              <div key={lot.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{lot.crop_name} ({lot.variety})</span>
                    <StatusBadge status={`Grade ${lot.quality_grade}`} />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>Lot #{lot.lot_number}</span>
                    {lot.is_fpo_aggregated && (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">FPO Aggregated</span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span>Available Quantity:</span>
                      <strong className="text-slate-900">{lot.quantity} {lot.unit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Price:</span>
                      <strong className="text-emerald-700 font-bold">₹{lot.expected_price}/kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Farm Location:</span>
                      <strong className="text-slate-800">{lot.farm_location}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Moisture & Packaging:</span>
                      <span>{lot.moisture_percent}% • {lot.packaging_type}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLot(lot);
                    setOfferModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-4 h-4" /> Make Digital Offer
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <OfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        lot={selectedLot}
        onOfferSuccess={fetchLots}
      />
    </DashboardLayout>
  );
}
