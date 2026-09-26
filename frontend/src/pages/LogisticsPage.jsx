import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calendar, Calculator, CheckCircle2, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function LogisticsPage() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('Mini Truck (3 Ton)');
  const [distanceKm, setDistanceKm] = useState(45);
  const [pickupLoc, setPickupLoc] = useState('Pimpalgaon, Nashik');
  const [destination, setDestination] = useState('Vashi APMC, Navi Mumbai');
  const [pickupDate, setPickupDate] = useState('2026-09-28');
  
  const [estimatedCost, setEstimatedCost] = useState(2975);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api.getVehicles()
      .then(setVehicles)
      .catch(console.log);

    api.getMyBookings()
      .then(setBookings)
      .catch(console.log);
  }, []);

  useEffect(() => {
    // Recalculate estimated cost
    api.estimateTransportCost(selectedVehicle, distanceKm)
      .then(res => setEstimatedCost(res.estimated_cost))
      .catch(console.log);
  }, [selectedVehicle, distanceKm]);

  const handleBookTransport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const selectedVObj = vehicles.find(v => v.vehicle_type === selectedVehicle) || { capacity_tons: 3.0 };
      await api.bookTransport({
        vehicle_type: selectedVehicle,
        capacity_tons: selectedVObj.capacity_tons,
        distance_km: Number(distanceKm),
        estimated_cost: estimatedCost,
        pickup_location: pickupLoc,
        destination: destination,
        pickup_date: pickupDate
      });

      setSuccessMsg(`Transport booked successfully! Status: Transport Scheduled`);
      api.getMyBookings().then(setBookings);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integrated Logistics & Transport Booking</h1>
          <p className="text-xs text-slate-500 mt-1">Book verified farm-to-mandi agricultural transport with transparent distance rates</p>
        </div>

        {/* Vehicle Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Tata Ace (1.5 Ton)", capacity: "1.5 Tons", base: "₹800", rate: "₹22/km", suitable: "Small batches & local mandi supply" },
            { name: "Mini Truck (3 Ton)", capacity: "3.0 Tons", base: "₹1,400", rate: "₹35/km", suitable: "Medium harvest lots & regional buyers" },
            { name: "Heavy Commercial Truck (10 Ton)", capacity: "10.0 Tons", base: "₹4,500", rate: "₹55/km", suitable: "Bulk FPO shipments & interstate transport" },
          ].map((v, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedVehicle(v.name)}
              className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                selectedVehicle === v.name
                  ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {v.capacity}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{v.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1">{v.suitable}</p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between text-xs text-slate-700">
                <span>Base Rate: <strong>{v.base}</strong></span>
                <span>Distance Rate: <strong className="text-emerald-700">{v.rate}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Transport Booking Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Book Transportation</h3>

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleBookTransport} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup Location</label>
                <input
                  type="text"
                  required
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Distance (km)</label>
                <input
                  type="number"
                  required
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Transport Cost</label>
                <div className="px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-extrabold text-emerald-800">
                  ₹{estimatedCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" /> {loading ? 'Scheduling...' : 'Book Transport Now'}
              </button>
            </div>
          </form>
        </div>

        {/* My Bookings History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">Transport Bookings History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 font-semibold">Vehicle</th>
                  <th className="py-2.5 font-semibold">Pickup → Destination</th>
                  <th className="py-2.5 font-semibold">Pickup Date</th>
                  <th className="py-2.5 font-semibold">Distance</th>
                  <th className="py-2.5 font-semibold">Estimated Cost</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 font-bold text-slate-900">{b.vehicle_type}</td>
                    <td className="py-3 text-slate-700">{b.pickup_location} → {b.destination}</td>
                    <td className="py-3 text-slate-600">{b.pickup_date}</td>
                    <td className="py-3 text-slate-600">{b.distance_km} km</td>
                    <td className="py-3 font-bold text-emerald-700">₹{b.estimated_cost?.toLocaleString('en-IN')}</td>
                    <td className="py-3"><StatusBadge status={b.status} /></td>
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
