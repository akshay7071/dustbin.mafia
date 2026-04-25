import React from 'react';
import { CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';

export default function DriverStop({ stop, stopNumber, onCollect, onOverflow, isCollected }) {
  
  const getProgressColor = (fill) => {
    if (fill >= 90) return 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
    if (fill >= 70) return 'bg-gradient-to-r from-orange-400 to-amber-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]';
    if (fill >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
  };

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'CRITICAL') return 'bg-red-100/80 text-red-700 border border-red-200 shadow-sm';
    if (urgency === 'HIGH') return 'bg-orange-100/80 text-orange-700 border border-orange-200 shadow-sm';
    return 'bg-emerald-100/80 text-emerald-700 border border-emerald-200 shadow-sm';
  };

  const isUrgent = stop.urgency === 'CRITICAL' || stop.urgency === 'HIGH';

  return (
    <div className={`relative group overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
      isCollected 
        ? 'bg-gray-50/80 opacity-70 border border-gray-200' 
        : 'bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1'
    }`}>
      {/* Subtle gradient background decoration */}
      {!isCollected && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent opacity-50 rounded-bl-full pointer-events-none" />
      )}

      <div className="relative flex items-start justify-between mb-4 z-10">
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
            isCollected 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 shadow-inner'
          }`}>
            {stopNumber}
          </div>
          <div>
            <h3 className={`font-bold text-gray-900 leading-tight tracking-tight ${isCollected ? 'line-through text-gray-500' : ''}`}>
              {stop.area || `Bin ${stop.bin_id}`}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500/70" />
              <span>{stop.bin_id}</span>
            </div>
          </div>
        </div>
        
        {isUrgent && !isCollected && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getUrgencyBadge(stop.urgency)}`}>
            {stop.urgency}
          </span>
        )}
      </div>

      {!isCollected && (
        <div className="mb-5 relative z-10">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500 font-medium">Predicted Fill Level</span>
            <span className="font-bold text-gray-700">{stop.fill || stop.predicted_fill}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(stop.fill || stop.predicted_fill)}`} 
              style={{ width: `${Math.min(stop.fill || stop.predicted_fill || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50/50 relative z-10">
        {!isCollected ? (
          <>
            <button 
              onClick={() => onOverflow(stop.bin_id)}
              className="text-xs text-red-500 font-semibold hover:text-red-700 flex items-center p-2 -ml-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Report Issue
            </button>
            <button 
              onClick={() => onCollect(stop.bin_id)}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center transition-all shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Collect
            </button>
          </>
        ) : (
          <div className="w-full text-center text-sm font-semibold text-emerald-600 flex items-center justify-center py-2 bg-emerald-50/50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Completed
          </div>
        )}
      </div>
    </div>
  );
}
