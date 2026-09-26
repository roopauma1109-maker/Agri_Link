import React, { useState, useEffect } from 'react';
import { Warehouse, MapPin, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';

export default function StoragePage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [quantityKg, setQuantityKg] = useState(1000);
  const [durationDays, setDurationDays] = useState(30);
  const [resMsg, setResMsg] = useState('');

  useEffect(() => {
    api.getStorageFacilities()
      .then(setFacilities)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;
    try {
      const res = await api.requestStorage(selectedFacility.id, Number(quantityKg), Number(durationDays));
      setResMsg(`Storage space reserved at ${selectedFacility.name}! Estimated cost: ₹${res.estimated_cost}`);
      setReserveModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cold Storage & Warehousing Network</h1>
          <p className="text-xs text-slate-500 mt-1">Reserve temperature-controlled storage facilities in Maharashtra to prevent post-harvest loss</p>
        </div>

        {resMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading cold storage facilities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((facility) => (
              <div key={facility.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[10px] font-bold border border-cyan-200">
                      {facility.storage_type}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ₹{facility.price_per_kg_per_month}/kg/month
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{facility.name}</h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {facility.location} ({facility.district})
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Total Capacity:</span>
                      <strong className="text-slate-800">{facility.total_capacity_tons} Tons</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Available Space:</span>
                      <strong className="text-emerald-700 font-bold">{facility.available_capacity_tons} Tons</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {facility.contact_phone}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFacility(facility);
                      setReserveModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Request Storage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {reserveModalOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Reserve Storage Space</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedFacility.name} • ₹{selectedFacility.price_per_kg_per_month}/kg/month</p>

            <form onSubmit={handleReserveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity to Store (kg)</label>
                <input
                  type="number"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Storage Duration (Days)</label>
                <input
                  type="number"
                  required
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between font-bold text-xs">
                <span>Estimated Monthly Rate:</span>
                <span className="text-emerald-700">₹{(quantityKg * selectedFacility.price_per_kg_per_month * (durationDays / 30)).toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReserveModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
