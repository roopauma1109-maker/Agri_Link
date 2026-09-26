import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, MapPin, CheckCircle, Phone, Mail } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function VerifiedBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBuyers()
      .then(setBuyers)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verified Buyers Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Institutional wholesalers, food processors, retail chains, and exporters operating in Maharashtra</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading verified buyer directory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyers.map((buyer) => (
              <div key={buyer.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={buyer.verification_status} />
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ★ {buyer.reliability_score}% Reliability
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{buyer.company_name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{buyer.buyer_type} • Contact: {buyer.contact_name}</p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <strong className="text-slate-800">{buyer.location}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Crops:</span>
                      <strong className="text-emerald-800">{buyer.required_crops}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Procurement Volume:</span>
                      <strong className="text-slate-900">{buyer.required_quantity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Terms:</span>
                      <strong className="text-slate-800">{buyer.payment_terms}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Deals:</span>
                      <strong className="text-slate-900">{buyer.completed_transactions} transactions</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {buyer.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {buyer.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
