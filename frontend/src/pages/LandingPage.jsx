import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, TrendingUp, Users, ShieldCheck, Truck, CreditCard, 
  ArrowRight, CheckCircle2, ChevronRight, BarChart3, Warehouse, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

export default function LandingPage() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    api.getMarketPrices()
      .then(data => setPrices((data || []).slice(0, 5)))
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded bg-emerald-700/80 font-bold uppercase tracking-wider text-[9px]">Prototype</span>
        <span>AgriLink • Government of Maharashtra Department of Skills, Employment, Entrepreneurship & Innovation</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900">Agri<span className="text-emerald-600">Link</span></span>
              <p className="text-[10px] text-slate-500 font-medium">Smart Market Linkage & Price Discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Strengthening Farmer Market Linkages across Maharashtra
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Helping Farmers Discover <span className="text-emerald-600">Better Markets.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Compare live market prices across mandis, connect directly with verified buyers, aggregate FPO harvests, schedule logistics, and ensure prompt digital payment settlements.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/market-intelligence"
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              Explore Market Prices
            </Link>
          </div>
        </div>
      </section>

      {/* Prototype Statistics Counter */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">10,400+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Farmers Connected</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">520+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Verified Buyers</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-700">1,200+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Active Crop Lots</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800">₹2.64 Cr</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Transaction Value</p>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3">* Prototype • Demo Platform Statistics</p>
        </div>
      </section>

      {/* Step-by-Step Workflow */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Seamless Transaction Lifecycle</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From harvest declaration to verified payment settlement in 7 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
            {[
              { step: "1", name: "Harvest", icon: Sprout },
              { step: "2", name: "Create Lot", icon: BarChart3 },
              { step: "3", name: "Compare Rates", icon: TrendingUp },
              { step: "4", name: "Find Buyer", icon: Users },
              { step: "5", name: "Digital Offer", icon: CheckCircle2 },
              { step: "6", name: "Transport", icon: Truck },
              { step: "7", name: "Direct Payment", icon: CreditCard },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-2">
                  {s.step}
                </div>
                <s.icon className="w-5 h-5 text-slate-600 mb-1" />
                <span className="text-xs font-bold text-slate-800">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Comprehensive AgriTech Platform</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">Designed to empower smallholders, FPOs, institutional buyers, and governance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Market Intelligence</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Live modal mandi prices across Nashik, Pune, Mumbai, Nagpur & Kolhapur with 7-day historical price trends and arrival volume tracking.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Smart Buyer Matching</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Multi-factor algorithmic matching score based on crop suitability (40%), lot quantity (20%), proximity (20%), and quality grade (20%).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Transparent Digital Offers</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Legally binding digital offers and counter-offer negotiation workflows between verified buyers and farmers/FPOs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. Integrated Logistics</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Book Tata Ace, Mini Trucks, or Heavy Commercial vehicles with distance-based cost estimators and pickup scheduling.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
                <Warehouse className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">5. Storage Availability</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Directory of nearby cold storages and warehouses in Maharashtra with space availability and daily booking rates.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">6. Payment & Grievance Desk</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Transparent transaction stage timeline, digital payment tracking, and dedicated grievance ticket resolution console.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-bold text-sm">AgriLink • Smart Market Linkage & Price Discovery Platform</p>
          <p className="mt-1 text-slate-400">Department of Skills, Employment, Entrepreneurship & Innovation • Government of Maharashtra</p>
          <p className="mt-4 text-[11px] text-slate-500">Prototype • Demo Market Data</p>
        </div>
      </footer>
    </div>
  );
}
