import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Tag, MapPin, Building, ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import OfferModal from '../components/OfferModal';
import { api } from '../services/api';

export default function BuyerMatching() {
  const [searchParams] = useSearchParams();
  const lotIdParam = searchParams.get('lot_id') || '1';

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getBuyerMatches(lotIdParam)
      .then(setMatchData)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [lotIdParam]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Automated Buyer Linkage Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Buyer Matching Results</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-factor algorithmic matching score based on crop, quantity, location proximity, and quality grade</p>
        </div>

        {/* Selected Lot Header Summary */}
        {matchData && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Crop Lot</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-lg font-bold text-slate-900">{matchData.crop_name}</h3>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-bold text-slate-700">#{matchData.lot_number}</span>
                <StatusBadge status={`Grade ${matchData.quality_grade}`} />
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Quantity: <strong>{matchData.quantity}</strong> • Expected Price: <strong className="text-emerald-700">₹{matchData.expected_price}/kg</strong>
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-center">
              <span className="text-slate-500 block">Matches Found</span>
              <span className="text-lg font-black text-emerald-800">{matchData.matches?.length || 0} Buyers</span>
            </div>
          </div>
        )}

        {/* Matching Algorithm Formula Card */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transparent Matching Formula:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
            <span className="px-2 py-0.5 bg-white rounded border">Crop Compatibility: 40%</span>
            <span className="px-2 py-0.5 bg-white rounded border">Quantity Range: 20%</span>
            <span className="px-2 py-0.5 bg-white rounded border">Location Proximity: 20%</span>
            <span className="px-2 py-0.5 bg-white rounded border">Quality Grade: 20%</span>
          </div>
        </div>

        {/* Buyer Matches List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Calculating buyer matching scores...</div>
        ) : !matchData?.matches || matchData.matches.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
            No matching buyers found for this lot.
          </div>
        ) : (
          <div className="space-y-4">
            {matchData.matches.map((buyer, idx) => (
              <div
                key={buyer.buyer_id}
                className={`p-6 rounded-3xl bg-white border transition-all ${
                  idx === 0 ? 'border-emerald-300 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-base shrink-0">
                      {buyer.company_name?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{buyer.company_name}</h4>
                        {idx === 0 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> Best Match
                          </span>
                        )}
                        <StatusBadge status={buyer.verification_status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {buyer.buyer_type} • Location: <strong>{buyer.location}</strong> • Completed Deals: {buyer.completed_transactions}
                      </p>
                    </div>
                  </div>

                  {/* Match Score Gauge */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Match Score</span>
                      <span className="text-2xl font-black text-emerald-700">{buyer.match_score}%</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLotForOffer({
                          id: matchData.lot_id,
                          lot_number: matchData.lot_number,
                          crop_name: matchData.crop_name,
                          expected_price: matchData.expected_price,
                          quantity: parseFloat(matchData.quantity),
                          quality_grade: matchData.quality_grade
                        });
                        setOfferModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                    >
                      Request Digital Offer
                    </button>
                  </div>
                </div>

                {/* Match Reasons Breakdown */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1.5">Why this buyer matched:</span>
                    <ul className="space-y-1">
                      {buyer.reasons?.map((reason, rIdx) => (
                        <li key={rIdx} className="text-slate-600 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Buyer Required Quantity:</span>
                      <strong className="text-slate-900">{buyer.required_quantity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Historical Offer Benchmark:</span>
                      <strong className="text-emerald-700 font-bold">{buyer.offer_range}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Reliability Rating:</span>
                      <strong className="text-slate-900">{buyer.reliability_score}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        lot={selectedLotForOffer}
      />
    </DashboardLayout>
  );
}
