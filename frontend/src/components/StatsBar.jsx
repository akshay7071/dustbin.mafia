import React from 'react';
import { useSelector } from 'react-redux';
import { selectCriticalCount, selectHighCount } from '../store/binsSlice';
import { Activity, Route, AlertCircle, AlertTriangle, Database } from 'lucide-react';

export default function StatsBar() {
  const { predictions, lastPredicted } = useSelector(state => state.bins);
  const { route } = useSelector(state => state.route);
  
  const totalBins = predictions?.length || 278; // Fallback to 278 if not loaded
  const criticalCount = useSelector(selectCriticalCount);
  const highCount = useSelector(selectHighCount);
  const inRouteCount = route.length;

  const timeAgo = lastPredicted 
    ? Math.floor((new Date() - new Date(lastPredicted)) / 60000) 
    : null;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 py-3 shrink-0 shadow-sm z-40 relative">
      <div className="flex space-x-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        <StatBadge 
          icon={<Database className="w-4 h-4" />}
          label="Total Bins" 
          value={totalBins} 
          colorClass="bg-slate-50 text-slate-700 border-slate-200" 
          iconColor="text-slate-400"
        />
        <StatBadge 
          icon={<AlertCircle className="w-4 h-4" />}
          label="Critical" 
          value={criticalCount} 
          colorClass="bg-red-50 text-red-700 border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
          iconColor="text-red-500"
        />
        <StatBadge 
          icon={<AlertTriangle className="w-4 h-4" />}
          label="High" 
          value={highCount} 
          colorClass="bg-orange-50 text-orange-700 border-orange-100" 
          iconColor="text-orange-500"
        />
        <StatBadge 
          icon={<Route className="w-4 h-4" />}
          label="In Route" 
          value={inRouteCount} 
          colorClass="bg-emerald-50 text-emerald-700 border-emerald-100" 
          iconColor="text-emerald-500"
        />
      </div>
      
      <div className="flex items-center space-x-6 shrink-0 pl-4">
        {timeAgo !== null && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Predictions</span>
            <span className="text-xs font-medium text-slate-600">
              {timeAgo === 0 ? 'Updated just now' : `${timeAgo} min ago`}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100" title="Live Connection">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest">Live System</span>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value, colorClass, iconColor }) {
  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl border ${colorClass} transition-transform hover:-translate-y-0.5 min-w-max`}>
      <div className={`${iconColor}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5 leading-none">{label}</span>
        <span className="text-lg font-extrabold leading-none">{value}</span>
      </div>
    </div>
  );
}
