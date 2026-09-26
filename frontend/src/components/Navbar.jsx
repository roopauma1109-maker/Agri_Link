import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Search, User, LogOut, Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { api } from '../services/api';

export default function Navbar({ toggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const results = await api.globalSearch(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.log('Search error:', err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'farmer': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'fpo': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'buyer': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-agri-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Agri<span className="text-emerald-600">Link</span></span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  Prototype • Demo Market Data
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block font-medium">Smart Market Linkage & Price Discovery Platform</p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search crops, mandis, buyers, lots, transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Search Dropdown Overlay */}
          {searchResults && (
            <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs max-h-80 overflow-y-auto">
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-700">Search Results</span>
                <button onClick={() => setSearchResults(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {searchResults.crop_lots?.length > 0 && (
                <div className="mb-3">
                  <span className="font-semibold text-emerald-700 text-[11px] uppercase">Matching Crop Lots</span>
                  {searchResults.crop_lots.map((l, idx) => (
                    <div key={idx} className="p-1.5 hover:bg-slate-50 rounded-lg flex justify-between">
                      <span className="font-medium">{l.crop} ({l.quantity})</span>
                      <span className="text-slate-500">{l.location}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.market_prices?.length > 0 && (
                <div>
                  <span className="font-semibold text-emerald-700 text-[11px] uppercase">Market Mandi Rates</span>
                  {searchResults.market_prices.map((m, idx) => (
                    <div key={idx} className="p-1.5 hover:bg-slate-50 rounded-lg flex justify-between">
                      <span className="font-medium">{m.crop} @ {m.market}</span>
                      <span className="font-bold text-emerald-800">₹{m.modal_price}/kg</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Notifications & Profile Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationDropdown />

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.full_name}</p>
                    <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={
                        user.role === 'farmer' ? '/farmer-dashboard' :
                        user.role === 'fpo' ? '/fpo-dashboard' :
                        user.role === 'buyer' ? '/buyer-dashboard' : '/admin-dashboard'
                      }
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> My Role Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
