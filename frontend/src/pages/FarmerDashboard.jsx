import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, TrendingUp, Tag, CreditCard, Sparkles, 
  ArrowUpRight, ArrowDownRight, Package, Calculator, CheckCircle2 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const trendData7Days = [
  { day: 'Mon', Tomato: 21.0, Onion: 28.0, Potato: 21.0 },
  { day: 'Tue', Tomato: 22.0, Onion: 29.0, Potato: 21.5 },
  { day: 'Wed', Tomato: 21.5, Onion: 30.0, Potato: 22.0 },
  { day: 'Thu', Tomato: 23.0, Onion: 29.5, Potato: 22.0 },
  { day: 'Fri', Tomato: 23.5, Onion: 30.5, Potato: 21.8 },
  { day: 'Sat', Tomato: 24.0, Onion: 31.0, Potato: 22.0 },
  { day: 'Sun', Tomato: 24.5, Onion: 31.5, Potato: 22.5 },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [offers, setOffers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);

  useEffect(() => {
    api.getCropLots({ my_lots: true })
      .then(setLots)
      .catch(console.log);

    api.getOffers()
      .then(setOffers)
      .catch(console.log);

    api.getPayments()
      .then(setPayments)
      .catch(console.log);

    api.getMarketPrices()
      .then(data => setMarketPrices(data || []))
      .catch(console.log);
  }, []);

  const activeLotsCount = lots.filter(l => l.status === 'Active' || l.status === 'Offer Received').length;
  const pendingOffersCount = offers.filter(o => o.status === 'Pending').length;
  const pendingPaymentsTotal = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-agri-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider mb-2">
              Farmer Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.full_name || 'Farmer'}!</h1>
            <p className="text-xs text-emerald-100 mt-1">
              District: {user?.district || 'Nashik'} • Compare Mandi Prices & Connect Direct with Buyers
            </p>
          </div>

          <div className="flex gap-2 relative z-10">
            <Link
              to="/create-crop-lot"
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Create Crop Lot
            </Link>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-600">Today's Best Price</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">₹24<span className="text-xs font-normal text-slate-500">/kg</span></p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Tomato (+8.2% in Nashik APMC)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-600">Active Crop Lots</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{activeLotsCount}</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Ready for buyer bids</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-600">Buyer Offers</span>
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{pendingOffersCount}</p>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">Pending review</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-600">Pending Payments</span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">₹{pendingPaymentsTotal.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">Due within 2 days</p>
          </div>
        </div>

        {/* Market Snapshot Table & 7-Day Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Market Snapshot */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Market Snapshot</h3>
                <p className="text-xs text-slate-500">Benchmark prices across major Maharashtra Mandis</p>
              </div>
              <Link to="/market-intelligence" className="text-xs font-bold text-emerald-700 hover:underline">
                View All Mandis →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 font-semibold">Crop</th>
                    <th className="py-2.5 font-semibold">Current Price</th>
                    <th className="py-2.5 font-semibold">Highest Nearby</th>
                    <th className="py-2.5 font-semibold">Lowest Nearby</th>
                    <th className="py-2.5 font-semibold">Trend</th>
                    <th className="py-2.5 font-semibold">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 font-bold text-slate-900">Tomato</td>
                    <td className="py-3 font-bold text-emerald-700">₹24/kg</td>
                    <td className="py-3 text-slate-700">₹27/kg (Mumbai)</td>
                    <td className="py-3 text-slate-500">₹21/kg (Nagpur)</td>
                    <td className="py-3 text-emerald-600 font-bold">↑ +8.2%</td>
                    <td className="py-3"><StatusBadge status="Favorable Selling Window" /></td>
                  </tr>

                  <tr>
                    <td className="py-3 font-bold text-slate-900">Onion</td>
                    <td className="py-3 font-bold text-emerald-700">₹31/kg</td>
                    <td className="py-3 text-slate-700">₹35/kg (Mumbai)</td>
                    <td className="py-3 text-slate-500">₹29/kg (Ahmednagar)</td>
                    <td className="py-3 text-emerald-600 font-bold">↑ +5.4%</td>
                    <td className="py-3"><StatusBadge status="Favorable Selling Window" /></td>
                  </tr>

                  <tr>
                    <td className="py-3 font-bold text-slate-900">Potato</td>
                    <td className="py-3 font-bold text-slate-800">₹22/kg</td>
                    <td className="py-3 text-slate-700">₹25/kg (Mumbai)</td>
                    <td className="py-3 text-slate-500">₹20/kg (Nashik)</td>
                    <td className="py-3 text-rose-600 font-bold">↓ -0.8%</td>
                    <td className="py-3"><StatusBadge status="Stable Market Window" /></td>
                  </tr>

                  <tr>
                    <td className="py-3 font-bold text-slate-900">Grapes</td>
                    <td className="py-3 font-bold text-emerald-700">₹75/kg</td>
                    <td className="py-3 text-slate-700">₹95/kg (Mumbai)</td>
                    <td className="py-3 text-slate-500">₹70/kg (Sangli)</td>
                    <td className="py-3 text-emerald-600 font-bold">↑ +12.0%</td>
                    <td className="py-3"><StatusBadge status="Favorable Selling Window" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: 7-Day Market Trend Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">7-Day Market Price Trend</h3>
              <p className="text-xs text-slate-500 mb-4">Price movements (₹/kg) in Nashik APMC</p>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Tomato" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Onion" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Potato" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Tomato</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Onion</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Potato</span>
            </div>
          </div>
        </div>

        {/* Bottom: My Active Lots & Offers Quick Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* My Crop Lots */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">My Crop Lots</h3>
              <Link to="/my-crop-lots" className="text-xs font-bold text-emerald-700 hover:underline">
                View All ({lots.length})
              </Link>
            </div>

            {lots.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">No crop lots created yet.</p>
                <Link to="/create-crop-lot" className="mt-2 inline-block text-xs font-bold text-emerald-700 hover:underline">
                  + Create First Crop Lot
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lots.slice(0, 3).map((lot) => (
                  <div key={lot.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{lot.crop_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-semibold text-slate-700">#{lot.lot_number}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {lot.quantity} {lot.unit} • Grade {lot.quality_grade} • Expected ₹{lot.expected_price}/kg
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={lot.status} />
                      <Link
                        to={`/buyer-matching?lot_id=${lot.id}`}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-700"
                      >
                        Matches
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Buyer Offers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Buyer Offers</h3>
              <Link to="/offers" className="text-xs font-bold text-emerald-700 hover:underline">
                Manage Offers ({offers.length})
              </Link>
            </div>

            {offers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                No active buyer offers received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {offers.slice(0, 3).map((offer) => (
                  <div key={offer.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{offer.buyer_company || offer.buyer_name}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Offer: <strong className="text-emerald-700">₹{offer.price_per_unit}/kg</strong> for {offer.quantity} kg • Total: ₹{offer.total_amount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <StatusBadge status={offer.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
