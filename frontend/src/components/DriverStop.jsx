import React from 'react';
import { CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';

export default function DriverStop({ stop, stopNumber, onCollect, onOverflow, isCollected }) {
  
  const getProgressColor = (fill) => {
    if (fill >= 90) return 'bg-critical';
    if (fill >= 70) return 'bg-high';
    if (fill >= 50) return 'bg-medium';
    return 'bg-low';
  };

  const isUrgent = stop.urgency === 'CRITICAL' || stop.urgency === 'HIGH';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${isCollected ? 'opacity-60 border-gray-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isCollected ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
            {stopNumber}
          </div>
          <div>
            <h3 className={`font-semibold text-gray-900 leading-tight ${isCollected ? 'line-through text-gray-500' : ''}`}>
              {stop.area || `Bin ${stop.bin_id}`}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{stop.bin_id}</span>
            </div>
          </div>
        </div>
        
        {isUrgent && !isCollected && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${stop.urgency === 'CRITICAL' ? 'bg-critical/10 text-critical' : 'bg-high/10 text-high'}`}>
            {stop.urgency}
          </span>
        )}
      </div>

      {!isCollected && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Predicted Fill</span>
            <span className="font-bold">{stop.fill || stop.predicted_fill}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full ${getProgressColor(stop.fill || stop.predicted_fill)}`} 
              style={{ width: `${Math.min(stop.fill || stop.predicted_fill || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        {!isCollected ? (
          <>
            <button 
              onClick={() => onOverflow(stop.bin_id)}
              className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center p-2 -ml-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              Report Issue
            </button>
            <button 
              onClick={() => onCollect(stop.bin_id)}
              className="bg-low hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Mark Collected
            </button>
          </>
        ) : (
          <div className="w-full text-center text-sm font-medium text-green-600 flex items-center justify-center py-1">
            <CheckCircle2 className="w-5 h-5 mr-1.5" />
            Collected
          </div>
        )}
      </div>
    </div>
  );
}
