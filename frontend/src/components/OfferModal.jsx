import React, { useState } from 'react';
import { X, DollarSign, Send, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function OfferModal({ isOpen, onClose, lot, onOfferSuccess }) {
  if (!isOpen || !lot) return null;

  const [pricePerUnit, setPricePerUnit] = useState(lot.expected_price || 25);
  const [quantity, setQuantity] = useState(lot.quantity || 1000);
  const [paymentTerms, setPaymentTerms] = useState('Payment within 2 days of delivery');
  const [pickupDate, setPickupDate] = useState('2026-09-28');
  const [offerExpiry, setOfferExpiry] = useState('2026-09-27');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = pricePerUnit * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createOffer({
        lot_id: lot.id,
        price_per_unit: Number(pricePerUnit),
        quantity: Number(quantity),
        payment_terms: paymentTerms,
        pickup_date: pickupDate,
        offer_expiry: offerExpiry,
        message: message || `Offer for ${lot.crop_name} lot (${lot.lot_number}).`
      });

      if (onOfferSuccess) onOfferSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Make Digital Offer</h3>
            <p className="text-xs text-slate-500">Submit a verified purchase offer for Lot #{lot.lot_number}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Crop & Grade</span>
              <span className="font-bold text-slate-800">{lot.crop_name} ({lot.variety}) • Grade {lot.quality_grade}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Expected Rate</span>
              <span className="font-bold text-emerald-700">₹{lot.expected_price}/kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Price (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity ({lot.unit || 'kg'})</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-700">Total Purchase Value:</span>
            <span className="text-lg font-bold text-emerald-800">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Date</label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Expiry Date</label>
              <input
                type="date"
                required
                value={offerExpiry}
                onChange={(e) => setOfferExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
            <input
              type="text"
              required
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Message to Farmer (Optional)</label>
            <textarea
              rows="2"
              placeholder="E.g., We accept pickup from farm gate or nearby cold storage."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            ></textarea>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> {loading ? 'Submitting...' : 'Submit Digital Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
