import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      redirectUser(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    switch (role) {
      case 'farmer': navigate('/farmer-dashboard'); break;
      case 'fpo': navigate('/fpo-dashboard'); break;
      case 'buyer': navigate('/buyer-dashboard'); break;
      case 'admin': navigate('/admin-dashboard'); break;
      default: navigate('/market-intelligence');
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Agriculture Branding & Illustration */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-agri-dark text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 border border-white/10">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight">Agri<span className="text-emerald-400">Link</span></span>
                <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold">Maharashtra Platform</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mt-6">
              Connect. Compare. <br /><span className="text-emerald-300">Sell Smarter.</span>
            </h2>

            <p className="text-xs text-emerald-100/80 mt-4 leading-relaxed">
              Empowering Maharashtra farmers and FPOs with live mandi discovery, direct verified buyer linkages, digital offers, and transparent settlements.
            </p>
          </div>

          {/* Abstract Agri Card */}
          <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" /> Government-backed AgriTech
            </div>
            <p className="text-emerald-100/90 text-[11px]">
              Prototype • Live Demo Credentials provided for all role perspectives.
            </p>
          </div>
        </div>

        {/* Right Side: Form & Quick Demo Buttons */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Sign In to AgriLink</h3>
            <p className="text-xs text-slate-500 mt-1">Select a demo account below or enter your credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@agrilink.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts Shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" /> Demo Accounts Shortcuts:
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('farmer@agrilink.demo', 'Farmer@123')}
                className="p-2 text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-medium transition-colors"
              >
                🌾 <strong>Farmer:</strong> farmer@agrilink.demo
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('fpo@agrilink.demo', 'Fpo@123')}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl font-medium transition-colors"
              >
                🚜 <strong>FPO:</strong> fpo@agrilink.demo
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('buyer@agrilink.demo', 'Buyer@123')}
                className="p-2 text-left bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-medium transition-colors"
              >
                🏭 <strong>Buyer:</strong> buyer@agrilink.demo
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin@agrilink.demo', 'Admin@123')}
                className="p-2 text-left bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-medium transition-colors"
              >
                🛡️ <strong>Admin:</strong> admin@agrilink.demo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            New to AgriLink?{' '}
            <Link to="/register" className="font-bold text-emerald-700 hover:underline">
              Register Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
