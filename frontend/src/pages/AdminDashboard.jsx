import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, Package, CreditCard, AlertTriangle, 
  TrendingUp, BarChart2, PieChart, CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

const monthlyTradeData = [
  { month: 'Apr', Transactions: 320, ValueCr: 0.22 },
  { month: 'May', Transactions: 450, ValueCr: 0.35 },
  { month: 'Jun', Transactions: 510, ValueCr: 0.41 },
  { month: 'Jul', Transactions: 620, ValueCr: 0.48 },
  { month: 'Aug', Transactions: 740, ValueCr: 0.56 },
  { month: 'Sep', Transactions: 840, ValueCr: 0.62 },
];

const cropDemandPie = [
  { name: 'Tomato', value: 35, color: '#16a34a' },
  { name: 'Onion', value: 30, color: '#2563eb' },
  { name: 'Grapes', value: 15, color: '#9333ea' },
  { name: 'Potato', value: 12, color: '#d97706' },
  { name: 'Wheat', value: 8, color: '#0284c7' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.getAdminStats()
      .then(setStats)
      .catch(console.log);

    api.getUsersList()
      .then(setUsers)
      .catch(console.log);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
              Government Administrative Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">State Agri Market Control Portal</h1>
            <p className="text-xs text-amber-200 mt-1">
              Department of Skills, Employment, Entrepreneurship & Innovation • Maharashtra
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/admin-verification"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" /> Verify Buyer Accounts
            </Link>
          </div>
        </div>

        {/* Admin Overview Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Farmers</span>
              <p className="text-xl font-black text-slate-900 mt-1">{stats.total_farmers?.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Total FPOs</span>
              <p className="text-xl font-black text-blue-700 mt-1">{stats.total_fpos?.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Verified Buyers</span>
              <p className="text-xl font-black text-purple-700 mt-1">{stats.total_buyers?.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Active Crop Lots</span>
              <p className="text-xl font-black text-emerald-700 mt-1">{stats.active_lots?.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Transactions</span>
              <p className="text-xl font-black text-slate-900 mt-1">{stats.total_transactions?.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Trade Value</span>
              <p className="text-xl font-black text-emerald-800 mt-1">₹2.64 Cr</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Grievances</span>
              <p className="text-xl font-black text-amber-700 mt-1">{stats.pending_grievances}</p>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Monthly Transactions Bar Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Monthly Transactions Growth</h3>
            <p className="text-xs text-slate-500 mb-4">Completed digital trade agreements per month</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="Transactions" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Crop Demand Distribution Pie Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Crop Demand Share</h3>
            <p className="text-xs text-slate-500 mb-4">Institutional buyer demand distribution by crop category</p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={cropDemandPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cropDemandPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-100">
              {cropDemandPie.map((c, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  {c.name} ({c.value}%)
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* System User Registry */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">System User Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 font-semibold">User ID</th>
                  <th className="py-2.5 font-semibold">Full Name</th>
                  <th className="py-2.5 font-semibold">Email</th>
                  <th className="py-2.5 font-semibold">Role</th>
                  <th className="py-2.5 font-semibold">District</th>
                  <th className="py-2.5 font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2.5 font-bold text-slate-900">#{u.id}</td>
                    <td className="py-2.5 text-slate-900 font-bold">{u.full_name}</td>
                    <td className="py-2.5 text-slate-600">{u.email}</td>
                    <td className="py-2.5 uppercase font-extrabold text-slate-700">{u.role}</td>
                    <td className="py-2.5 text-slate-600">{u.district}</td>
                    <td className="py-2.5 text-slate-600">{u.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
