import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800">AgriLink</span>
          <span>• Smart Market Linkage & Price Discovery Platform</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Dept. of Skills, Employment, Entrepreneurship & Innovation
          </span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
            Prototype • Demo Market Data
          </span>
        </div>
      </div>
    </footer>
  );
}
