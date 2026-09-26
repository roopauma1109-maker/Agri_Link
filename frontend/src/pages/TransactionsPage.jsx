import React, { useState, useEffect } from 'react';
import { Package, CheckCircle2, Clock, Truck, CreditCard, ChevronRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data || []);
      if (data && data.length > 0) {
        loadTxDetails(data[0].id);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTxDetails = async (txId) => {
    try {
      const details = await api.getTransactionDetails(txId);
      setSelectedTx(details);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateStage = async (txId, newStage) => {
    try {
      await api.updateTransactionStage(txId, newStage);
      loadTxDetails(txId);
      fetchTransactions();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction Tracking & Progress Timeline</h1>
          <p className="text-xs text-slate-500 mt-1">Audit trail and stage progression for active crop trade contracts</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
            No transactions found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Transaction List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 px-1">Recent Transactions</h3>
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => loadTxDetails(tx.id)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    selectedTx?.id === tx.id
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{tx.tx_number}</span>
                    <StatusBadge status={tx.payment_status === 'Paid' ? 'Paid' : tx.current_stage} />
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">{tx.crop_name} ({tx.quantity} kg)</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">Total: ₹{tx.total_value?.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Detailed Timeline */}
            {selectedTx && (
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Transaction Details</span>
                    <h3 className="text-lg font-black text-slate-900">{selectedTx.tx_number}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Crop: <strong>{selectedTx.crop_name}</strong> • Quantity: <strong>{selectedTx.quantity} kg</strong> @ ₹{selectedTx.price_per_unit}/kg
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Contract Value</span>
                    <span className="text-xl font-extrabold text-emerald-700">₹{selectedTx.total_value?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Vertical Step Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Stage Progress Timeline</h4>
                  <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedTx.timeline?.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            step.completed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {step.completed ? '✓' : idx + 1}
                        </div>
                        <div className="pt-0.5 flex-1 flex items-center justify-between">
                          <span className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.stage}
                          </span>
                          {step.completed && <span className="text-[10px] text-emerald-600 font-bold">Completed</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons to Advance Stage */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-500 font-semibold self-center mr-2">Update Stage (Demo):</span>
                  <button
                    onClick={() => handleUpdateStage(selectedTx.id, 'Pickup Scheduled')}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-xl"
                  >
                    Set Pickup Scheduled
                  </button>
                  <button
                    onClick={() => handleUpdateStage(selectedTx.id, 'Delivered')}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-xl"
                  >
                    Set Delivered
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
