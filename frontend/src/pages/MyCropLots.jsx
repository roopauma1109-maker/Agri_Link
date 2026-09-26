import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function MyCropLots() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLots = async () => {
    try {
      const data = await api.getCropLots({ my_lots: true });
      setLots(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLots();
  }, []);

  const handleCloseLot = async (id) => {
    if (!window.confirm('Mark this lot as completed / sold?')) return;
    try {
      await api.closeCropLot(id);
      fetchMyLots();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteLot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop lot?')) return;
    try {
      await api.deleteCropLot(id);
      fetchMyLots();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Crop Lots</h1>
            <p className="text-xs text-slate-500 mt-1">Manage active harvest listings, view buyer offers, and track sales</p>
          </div>

          <Link
            to="/create-crop-lot"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Create New Lot
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading crop lots...</div>
          ) : lots.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <p>You have not created any crop lots yet.</p>
              <Link to="/create-crop-lot" className="inline-block text-emerald-700 font-bold hover:underline">
                + Create First Crop Lot
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 font-semibold">Lot ID</th>
                    <th className="py-3 font-semibold">Crop & Variety</th>
                    <th className="py-3 font-semibold">Quantity</th>
                    <th className="py-3 font-semibold">Grade</th>
                    <th className="py-3 font-semibold">Expected Rate</th>
                    <th className="py-3 font-semibold">Harvest Date</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {lots.map((lot) => (
                    <tr key={lot.id}>
                      <td className="py-3.5 font-bold text-slate-900">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-extrabold">{lot.lot_number}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900">{lot.crop_name}</span>
                        <span className="text-slate-500 text-[11px] block">{lot.variety}</span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-800">{lot.quantity} {lot.unit}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          Grade {lot.quality_grade}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-emerald-700">₹{lot.expected_price}/kg</td>
                      <td className="py-3.5 text-slate-600">{lot.harvest_date}</td>
                      <td className="py-3.5">
                        <StatusBadge status={lot.status} />
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <Link
                          to={`/buyer-matching?lot_id=${lot.id}`}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-700" /> Matches
                        </Link>

                        {lot.status !== 'Completed' && (
                          <button
                            onClick={() => handleCloseLot(lot.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                          >
                            Mark Completed
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteLot(lot.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
