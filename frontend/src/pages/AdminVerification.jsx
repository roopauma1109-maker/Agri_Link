import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function AdminVerification() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuyers = async () => {
    try {
      const data = await api.getBuyersVerification();
      setBuyers(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleVerify = async (buyerId, statusVal) => {
    try {
      await api.verifyBuyer(buyerId, statusVal);
      fetchBuyers();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buyer Verification Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Review credentials and approve commercial buyers, food processors, and exporters</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading buyer accounts...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 font-semibold">Company Name</th>
                    <th className="py-3 font-semibold">Contact Person</th>
                    <th className="py-3 font-semibold">Location</th>
                    <th className="py-3 font-semibold">Buyer Type</th>
                    <th className="py-3 font-semibold">Reliability</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {buyers.map((b) => (
                    <tr key={b.buyer_id}>
                      <td className="py-3.5 font-bold text-slate-900">{b.company_name}</td>
                      <td className="py-3.5 text-slate-700">{b.contact_person}</td>
                      <td className="py-3.5 text-slate-600">{b.location}</td>
                      <td className="py-3.5 text-slate-700">{b.buyer_type}</td>
                      <td className="py-3.5 font-bold text-emerald-700">{b.reliability_score}%</td>
                      <td className="py-3.5"><StatusBadge status={b.verification_status} /></td>
                      <td className="py-3.5 text-right space-x-2">
                        {b.verification_status !== 'Verified' && (
                          <button
                            onClick={() => handleVerify(b.buyer_id, 'Verified')}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                        {b.verification_status !== 'Rejected' && (
                          <button
                            onClick={() => handleVerify(b.buyer_id, 'Rejected')}
                            className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] hover:bg-rose-200"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
