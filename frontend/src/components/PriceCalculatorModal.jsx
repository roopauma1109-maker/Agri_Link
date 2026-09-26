import React, { useState } from 'react';
import { Calculator, X, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function PriceCalculatorModal({ isOpen, onClose }) {
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState(2000);
  const [localPrice, setLocalPrice] = useState(22);
  const [directPrice, setDirectPrice] = useState(26);

  if (!isOpen) return null;

  const localRealisation = quantity * localPrice;
  const directRealisation = quantity * directPrice;
  const extraGain = directRealisation - localRealisation;
  const gainPercentage = localRealisation > 0 ? ((extraGain / localRealisation) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Farmer Price Realisation Calculator</h3>
            <p className="text-xs text-slate-500">Estimate income increase via direct buyer linkage</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
              <option value="Grapes">Grapes</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity (kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Local Price (₹/kg)</label>
              <input
                type="number"
                value={localPrice}
                onChange={(e) => setLocalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Buyer Offer (₹/kg)</label>
              <input
                type="number"
                value={directPrice}
                onChange={(e) => setDirectPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Standard Mandi Earnings:</span>
              <span className="font-semibold text-slate-800">₹{localRealisation.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>AgriLink Direct Buyer Earnings:</span>
              <span className="font-semibold text-emerald-800">₹{directRealisation.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Additional Realisation:
              </span>
              <span className="text-base font-extrabold text-emerald-700">
                +₹{extraGain.toLocaleString('en-IN')} ({gainPercentage}%)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Illustrative estimate based on demo market benchmark data. Actual realization depends on final lot quality grade and transportation terms.
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
