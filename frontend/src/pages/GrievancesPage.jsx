import React, { useState, useEffect } from 'react';
import { AlertTriangle, PlusCircle, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import GrievanceModal from '../components/GrievanceModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GrievancesPage() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGrievances = async () => {
    try {
      const data = await api.getGrievances();
      setGrievances(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleResolve = async (gId, statusVal) => {
    const remarks = prompt('Enter admin remarks for resolution:');
    if (remarks === null) return;
    try {
      await api.updateGrievanceStatus(gId, statusVal, remarks);
      fetchGrievances();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Grievance Redressal Desk</h1>
            <p className="text-xs text-slate-500 mt-1">Submit & track disputes regarding payment delays, quality discrepancies, or delivery issues</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" /> Raise Grievance Ticket
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading grievance tickets...</div>
          ) : grievances.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No grievance tickets filed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grievances.map((g) => (
                <div key={g.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{g.ticket_no}</span>
                      <StatusBadge status={g.status} />
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {g.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      Issue: <strong>{g.issue_type}</strong> • User: {g.user_name} • Ref: {g.transaction_id || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 mt-2">
                      "{g.description}"
                    </p>
                    {g.admin_remarks && (
                      <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-1">
                        <strong>Admin Officer Remarks:</strong> {g.admin_remarks}
                      </p>
                    )}
                  </div>

                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResolve(g.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleResolve(g.id, 'Under Review')}
                        className="px-3 py-1.5 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <GrievanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchGrievances}
      />
    </DashboardLayout>
  );
}
