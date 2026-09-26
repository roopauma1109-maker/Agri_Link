import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Search, Filter, BarChart2, Calendar, 
  MapPin, AlertCircle, ArrowUpRight, ArrowDownRight, Layers 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

const arrivalVolumeData = [
  { day: 'Mon', Volume: 140 },
  { day: 'Tue', Volume: 165 },
  { day: 'Wed', Volume: 180 },
  { day: 'Thu', Volume: 210 },
  { day: 'Fri', Volume: 195 },
  { day: 'Sat', Volume: 240 },
  { day: 'Sun', Volume: 260 },
];

export default function MarketIntelligence() {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [marketPrices, setMarketPrices] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [intelligence, setIntelligence] = useState(null);

  useEffect(() => {
    api.getMarketPrices({ crop: selectedCrop, district: districtFilter })
      .then(setMarketPrices)
      .catch(console.log);

    api.getPriceComparison(selectedCrop)
      .then(setComparison)
      .catch(console.log);

    api.getPriceIntelligence(selectedCrop)
      .then(setIntelligence)
      .catch(console.log);
  }, [selectedCrop, districtFilter]);

  const barChartData = comparison?.markets?.map(m => ({
    market: m.market_name.replace(' APMC', ''),
    Price: m.modal_price
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mandi Price Discovery & Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time benchmark mandi prices, historical trends, and arrival volume across Maharashtra</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mr-2">Select Crop:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
            >
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
              <option value="Grapes">Grapes</option>
              <option value="Wheat">Wheat</option>
              <option value="Soybean">Soybean</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 mr-2">District:</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="All">All Districts</option>
              <option value="Nashik">Nashik</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Kolhapur">Kolhapur</option>
            </select>
          </div>
        </div>

        {/* Sale-Window Smart Intelligence Card */}
        {intelligence && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Sale-Window Price Intelligence</span>
                  <StatusBadge status={intelligence.status_badge} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{intelligence.crop_name} Price Trend Analysis</h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                  {intelligence.recommendation}
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs space-y-1 shrink-0">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Expected Range:</span>
                  <strong className="text-emerald-800 font-bold">{intelligence.expected_range}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Market Demand:</span>
                  <strong className="text-slate-900">{intelligence.demand_level}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Arrival Volume:</span>
                  <strong className="text-slate-900">{intelligence.arrival_volume}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mandi Price Comparison Metrics */}
        {comparison && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Highest Nearby Mandi</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">₹{comparison.highest_price}<span className="text-xs font-normal text-slate-500">/kg</span></p>
              <p className="text-[10px] text-slate-500 mt-0.5">Vashi APMC (Mumbai)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Average Mandi Price</span>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{comparison.average_price}<span className="text-xs font-normal text-slate-500">/kg</span></p>
              <p className="text-[10px] text-slate-500 mt-0.5">Across 5 Mandis</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Lowest Nearby Mandi</span>
              <p className="text-2xl font-black text-slate-700 mt-1">₹{comparison.lowest_price}<span className="text-xs font-normal text-slate-500">/kg</span></p>
              <p className="text-[10px] text-slate-500 mt-0.5">Nagpur APMC</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Mandi Price Difference</span>
              <p className="text-2xl font-black text-purple-700 mt-1">₹{comparison.price_difference}<span className="text-xs font-normal text-slate-500">/kg</span></p>
              <p className="text-[10px] text-purple-700 font-semibold mt-0.5">Potential Arbitrage Realization</p>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Mandi Price Comparison Bar Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Mandi Price Comparison (₹/kg)</h3>
            <p className="text-xs text-slate-500 mb-4">Modal price comparison for {selectedCrop} across Maharashtra APMCs</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="market" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="Price" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Arrival Volume Area Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Market Arrival Volume (Tons)</h3>
            <p className="text-xs text-slate-500 mb-4">7-day incoming crop supply volume in major yards</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={arrivalVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Volume" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Detailed Mandi Prices Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">Live Mandi Price Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 font-semibold">Mandi Market</th>
                  <th className="py-2.5 font-semibold">District</th>
                  <th className="py-2.5 font-semibold">Modal Price</th>
                  <th className="py-2.5 font-semibold">Min Price</th>
                  <th className="py-2.5 font-semibold">Max Price</th>
                  <th className="py-2.5 font-semibold">Arrivals</th>
                  <th className="py-2.5 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {marketPrices.map((mp) => (
                  <tr key={mp.id}>
                    <td className="py-3 font-bold text-slate-900">{mp.market_name}</td>
                    <td className="py-3 text-slate-600">{mp.district}</td>
                    <td className="py-3 font-extrabold text-emerald-700">₹{mp.modal_price}/kg</td>
                    <td className="py-3 text-slate-500">₹{mp.min_price}/kg</td>
                    <td className="py-3 text-slate-800">₹{mp.max_price}/kg</td>
                    <td className="py-3 text-slate-600">{mp.arrival_volume} tons</td>
                    <td className={`py-3 font-bold ${mp.trend_percent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {mp.trend_percent >= 0 ? `↑ +${mp.trend_percent}%` : `↓ ${mp.trend_percent}%`}
                    </td>
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
