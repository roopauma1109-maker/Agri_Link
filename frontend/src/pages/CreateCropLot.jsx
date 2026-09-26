import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sprout, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CreateCropLot() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid Red');
  const [quantity, setQuantity] = useState(2000);
  const [unit, setUnit] = useState('kg');
  const [farmLocation, setFarmLocation] = useState(user?.district || 'Nashik');
  const [harvestDate, setHarvestDate] = useState('2026-09-24');
  const [expectedPrice, setExpectedPrice] = useState(26);
  const [qualityGrade, setQualityGrade] = useState('A');
  const [moisturePercent, setMoisturePercent] = useState(11.5);
  const [packagingType, setPackagingType] = useState('Plastic Crates');
  const [availableFrom, setAvailableFrom] = useState('2026-09-25');
  const [storageRequired, setStorageRequired] = useState(false);
  const [isAggregated, setIsAggregated] = useState(user?.role === 'fpo');
  const [memberCount, setMemberCount] = useState(user?.role === 'fpo' ? 12 : 1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successLot, setSuccessLot] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const created = await api.createCropLot({
        crop_name: cropName,
        variety: variety,
        quantity: Number(quantity),
        unit: unit,
        farm_location: farmLocation,
        harvest_date: harvestDate,
        expected_price: Number(expectedPrice),
        quality_grade: qualityGrade,
        moisture_percent: Number(moisturePercent),
        packaging_type: packagingType,
        available_from: availableFrom,
        storage_required: storageRequired,
        is_fpo_aggregated: isAggregated,
        fpo_member_count: Number(memberCount)
      });

      setSuccessLot(created);
    } catch (err) {
      setError(err.message || 'Failed to create crop lot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user?.role === 'fpo' ? 'Create FPO Aggregated Crop Lot' : 'Create Farmer Crop Lot'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Declare your harvest details to trigger automated buyer matching and price discovery</p>
        </div>

        {successLot ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">Success!</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Crop Lot Created Successfully</h3>
              <p className="text-xs text-slate-600 mt-1">Generated Lot ID:</p>
              <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-900 font-extrabold text-lg border border-emerald-300 rounded-2xl mt-2">
                {successLot.lot_number}
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your lot of <strong>{successLot.quantity} {successLot.unit}</strong> of <strong>{successLot.crop_name}</strong> is now live in the marketplace.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(`/buyer-matching?lot_id=${successLot.id}`)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> View Matched Buyers
              </button>
              <button
                onClick={() => navigate('/my-crop-lots')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Go to My Crop Lots
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Crop</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Potato">Potato</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Grapes">Grapes</option>
                  <option value="Rice">Rice</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Variety</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hybrid Red, Garwa Red"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="Quintal">Quintal (100 kg)</option>
                  <option value="Ton">Tons (1,000 kg)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quality Grade</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
                >
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Processing)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Moisture (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Packaging Type</label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Plastic Crates">Plastic Crates</option>
                  <option value="Jute Bags">Jute Bags</option>
                  <option value="Export Cartons">Export Cartons</option>
                  <option value="Loose Bulk">Loose Bulk</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Niphad, Nashik"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Harvest Date</label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available From Date</label>
                <input
                  type="date"
                  required
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={storageRequired}
                  onChange={(e) => setStorageRequired(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                Requires Cold Storage / Warehouse Assistance
              </label>

              {user?.role === 'fpo' && (
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isAggregated}
                      onChange={(e) => setIsAggregated(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    FPO Aggregated Bulk Lot
                  </label>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Pooled Member Farmers Count:</label>
                    <input
                      type="number"
                      value={memberCount}
                      onChange={(e) => setMemberCount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Create Lot & Match Buyers'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
