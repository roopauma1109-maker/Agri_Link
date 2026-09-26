import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const data = await api.getPayments();
      setPayments(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleMarkPaid = async (id) => {
    try {
      const res = await api.markPaymentPaid(id);
      alert(`Payment marked as received! Transaction Reference: ${res.ref}`);
      fetchPayments();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Settlements</h1>
          <p className="text-xs text-slate-500 mt-1">Digital invoice tracking and direct payment settlement status</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No active payment settlements found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 font-semibold">Transaction ID</th>
                    <th className="py-3 font-semibold">Crop Produce</th>
                    <th className="py-3 font-semibold">Amount</th>
                    <th className="py-3 font-semibold">Due Date</th>
                    <th className="py-3 font-semibold">Payment Status</th>
                    <th className="py-3 font-semibold">Reference Ref</th>
                    <th className="py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3.5 font-bold text-slate-900">{p.tx_number}</td>
                      <td className="py-3.5 text-slate-700">{p.crop_name}</td>
                      <td className="py-3.5 font-black text-emerald-700 text-sm">₹{p.amount?.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-slate-600">{p.due_date}</td>
                      <td className="py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="py-3.5 text-slate-500 font-mono text-[11px]">{p.transaction_ref || 'Pending Settlement'}</td>
                      <td className="py-3.5 text-right">
                        {p.status !== 'Paid' ? (
                          <button
                            onClick={() => handleMarkPaid(p.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                          >
                            Mark Payment Received
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settled
                          </span>
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
