import React from 'react';

export default function StatusBadge({ status, type = 'default' }) {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  const s = String(status || '').toLowerCase();

  if (s.includes('active') || s.includes('verified') || s.includes('paid') || s.includes('accepted') || s.includes('completed') || s.includes('favorable') || s.includes('delivered')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
  } else if (s.includes('pending') || s.includes('review') || s.includes('received') || s.includes('offer received') || s.includes('scheduled')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
  } else if (s.includes('rejected') || s.includes('declined') || s.includes('delayed') || s.includes('disputed')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
  } else if (s.includes('sold') || s.includes('countered') || s.includes('transit')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
}
