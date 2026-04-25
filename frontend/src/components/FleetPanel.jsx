import React from 'react';
import { Truck } from 'lucide-react';

export default function FleetPanel() {
  const fleet = [
    { id: 'Truck A', status: 'En Route', color: 'bg-indigo-500', routeColor: 'bg-indigo-500/20 text-indigo-400', bins: 12 },
    { id: 'Truck B', status: 'Idle', color: 'bg-cyan-500', routeColor: 'bg-cyan-500/20 text-cyan-400', bins: 0 },
    { id: 'Truck C', status: 'En Route', color: 'bg-emerald-500', routeColor: 'bg-emerald-500/20 text-emerald-400', bins: 8 },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
      <h3 className="font-heading text-sm text-slate-400 mb-3 uppercase tracking-widest font-semibold flex items-center">
        <Truck className="w-4 h-4 mr-2" /> Fleet Allocation
      </h3>
      <div className="space-y-3">
        {fleet.map((truck) => (
          <div key={truck.id} className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${truck.color} ${truck.status === 'En Route' ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium text-slate-200">{truck.id}</span>
              </div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${truck.routeColor}`}>
                {truck.status}
              </span>
            </div>
            {truck.bins > 0 && (
              <div className="pl-4">
                <div className="text-xs text-slate-500 font-mono">Assigned Bins: {truck.bins}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
