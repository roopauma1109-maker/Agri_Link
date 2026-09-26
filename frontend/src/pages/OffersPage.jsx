import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle2, XCircle, RefreshCw, MessageSquare } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState(27);
  const [counterTerms, setCounterTerms] = useState('');

  const fetchOffers = async () => {
    try {
      const data = await api.getOffers();
      setOffers(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAccept = async (offerId) => {
    if (!window.confirm('Accept this offer? This will automatically generate a binding Transaction order.')) return;
    try {
      const res = await api.acceptOffer(offerId);
      alert(`Offer accepted! Transaction ${res.transaction_number} created.`);
      fetchOffers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReject = async (offerId) => {
    if (!window.confirm('Decline this offer?')) return;
    try {
      await api.rejectOffer(offerId);
      fetchOffers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCounterSubmit = async (e) => {
    e.preventDefault();
    if (!activeOffer) return;
    try {
      await api.counterOffer(activeOffer.id, {
        counter_price: Number(counterPrice),
        counter_terms: counterTerms
      });
      alert('Counter offer submitted!');
      setCounterModalOpen(false);
      fetchOffers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Digital Offers & Negotiations</h1>
          <p className="text-xs text-slate-500 mt-1">Review purchase offers, send counter-offers, or accept to convert into transaction orders</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <Tag className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No digital offers present.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{offer.buyer_company || offer.buyer_name}</span>
                      <StatusBadge status={offer.status} />
                    </div>
                    <p className="text-xs text-slate-600">
                      Crop: <strong>{offer.crop_name}</strong> • Offered Rate: <strong className="text-emerald-700 text-sm">₹{offer.price_per_unit}/kg</strong> for <strong>{offer.quantity} kg</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Total Value: <strong className="text-slate-800">₹{offer.total_amount?.toLocaleString('en-IN')}</strong> • Payment: {offer.payment_terms} • Pickup: {offer.pickup_date}
                    </p>
                    {offer.message && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200 mt-1 italic">
                        "{offer.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {offer.status === 'Pending' && (user?.role === 'farmer' || user?.role === 'fpo' || user?.role === 'admin') && (
                      <>
                        <button
                          onClick={() => handleAccept(offer.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept Offer
                        </button>

                        <button
                          onClick={() => {
                            setActiveOffer(offer);
                            setCounterPrice(offer.price_per_unit + 1);
                            setCounterModalOpen(true);
                          }}
                          className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Counter
                        </button>

                        <button
                          onClick={() => handleReject(offer.id)}
                          className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {offer.status === 'Accepted' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Deal Finalized
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Counter Offer Modal */}
      {counterModalOpen && activeOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Submit Counter Offer</h3>
            <p className="text-xs text-slate-500 mb-4">Original offer from {activeOffer.buyer_company}: ₹{activeOffer.price_per_unit}/kg</p>

            <form onSubmit={handleCounterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Counter Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terms or Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Price revised for Grade A quality..."
                  value={counterTerms}
                  onChange={(e) => setCounterTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Send Counter Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
