import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Package, TrendingUp, Tag, PlusCircle, 
  ShieldCheck, Layers, ArrowUpRight, CreditCard 
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FPODashboard() {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    api.getCropLots({ my_lots: true })
      .then(setLots)
      .catch(console.log);

    api.getOffers()
      .then(setOffers)
      .catch(console.log);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
              FPO Collective Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.full_name || 'Nashik Farmer Producer Org'}</h1>
            <p className="text-xs text-blue-200 mt-1">
              Registration: FPO-MH-2023-8891 • District: {user?.district || 'Nashik'} • 65 Member Farmers
            </p>
          </div>

          <Link
            to="/create-crop-lot"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create Aggregated Bulk Lot
          </Link>
        </div>

        {/* FPO Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Registered Farmers</span>
            <p className="text-2xl font-black text-slate-900">65</p>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">Niphad & Dindori Clusters</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Total Crop Volume</span>
            <p className="text-2xl font-black text-slate-900">12.5 <span className="text-xs font-normal">Tons</span></p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Aggregated Produce</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Active Bulk Lots</span>
            <p className="text-2xl font-black text-slate-900">{lots.length || 1}</p>
            <p className="text-[11px] text-slate-500 mt-1">Listed on Marketplace</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Buyer Offers</span>
            <p className="text-2xl font-black text-slate-900">{offers.length || 2}</p>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">Institutional Bids</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 block mb-1">Total Sales Value</span>
            <p className="text-2xl font-black text-emerald-700">₹3.85 L</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">This Season</p>
          </div>
        </div>

        {/* Aggregated Lots Showcase */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active FPO Aggregated Lots</h3>
              <p className="text-xs text-slate-500">Combined produce from smallholders to command higher institutional buyer prices</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl font-black text-sm">
                  FPO
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Onion (Garwa Red) Aggregated Lot</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">LOT-2026-00126</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>18 Member Farmers</strong> Pooled • Total Quantity: <strong>12,500 kg (12.5 Tons)</strong>
                  </p>
                </div>
              </div>

              <StatusBadge status="Active" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Avg Expected Rate</span>
                <span className="font-bold text-emerald-700 text-sm">₹31.50/kg</span>
              </div>
              <div>
                <span className="text-slate-500 block">Quality Grade</span>
                <span className="font-bold text-slate-800 text-sm">Grade A (Premium)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="font-bold text-slate-800 text-sm">Nashik APMC Yard</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lot Value</span>
                <span className="font-bold text-slate-900 text-sm">₹3,93,750</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link
                to="/buyer-matching?lot_id=3"
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                Find Matched Institutional Buyers →
              </Link>
            </div>
          </div>
        </div>

        {/* Member Farmers Directory Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">FPO Member Farmers Cluster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 font-semibold">Farmer Name</th>
                  <th className="py-2.5 font-semibold">Village / Location</th>
                  <th className="py-2.5 font-semibold">Acres</th>
                  <th className="py-2.5 font-semibold">Crops Harvested</th>
                  <th className="py-2.5 font-semibold">Aggregated Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">Ramesh Patil</td>
                  <td className="py-2.5 text-slate-600">Pimpalgaon, Nashik</td>
                  <td className="py-2.5 text-slate-600">4.5</td>
                  <td className="py-2.5 text-slate-700">Tomato, Onion</td>
                  <td className="py-2.5 font-bold text-emerald-700">1,500 kg</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">Sanjay Gite</td>
                  <td className="py-2.5 text-slate-600">Niphad, Nashik</td>
                  <td className="py-2.5 text-slate-600">3.0</td>
                  <td className="py-2.5 text-slate-700">Onion</td>
                  <td className="py-2.5 font-bold text-emerald-700">2,000 kg</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">Bhaskar Jadhav</td>
                  <td className="py-2.5 text-slate-600">Dindori, Nashik</td>
                  <td className="py-2.5 text-slate-600">5.2</td>
                  <td className="py-2.5 text-slate-700">Grapes, Onion</td>
                  <td className="py-2.5 font-bold text-emerald-700">3,500 kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
