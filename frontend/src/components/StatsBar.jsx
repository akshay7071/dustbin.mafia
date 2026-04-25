import React from 'react';
import { useSelector } from 'react-redux';
import { selectCriticalCount, selectHighCount } from '../store/binsSlice';
import { Activity } from 'lucide-react';

export default function StatsBar() {
  const { predictions, lastPredicted } = useSelector(state => state.bins);
  const { route } = useSelector(state => state.route);
  
  const totalBins = predictions.length || 278; // Fallback to 278 if not loaded
  const criticalCount = useSelector(selectCriticalCount);
  const highCount = useSelector(selectHighCount);
  const inRouteCount = route.length;

  const timeAgo = lastPredicted 
    ? Math.floor((new Date() - new Date(lastPredicted)) / 60000) 
    : null;

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex space-x-6">
        <StatBadge label="Total" value={totalBins} color="bg-gray-100 text-gray-800" />
        <StatBadge label="Critical" value={criticalCount} color="bg-critical/10 text-critical border border-critical/20" />
        <StatBadge label="High" value={highCount} color="bg-high/10 text-high border border-high/20" />
        <StatBadge label="In Route" value={inRouteCount} color="bg-blue-100 text-blue-700 border border-blue-200" />
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-text-muted">
        {timeAgo !== null && (
          <span>Last predicted: {timeAgo === 0 ? 'Just now' : `${timeAgo} min ago`}</span>
        )}
        <div className="flex items-center space-x-1.5" title="Live Connection">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-low opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-low"></span>
          </span>
          <span className="text-low font-medium text-xs">LIVE</span>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${color}`}>
      <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}
