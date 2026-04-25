import React from 'react';

// Mock data as per requirements since we don't have the API fully wired yet for stats
const MOCK_ZONES = [
  { zone: "Nirala Bazaar", avg_fill: 78, bin_count: 14 },
  { zone: "Mondha Market", avg_fill: 74, bin_count: 22 },
  { zone: "Cidco N-1", avg_fill: 68, bin_count: 31 },
  { zone: "Kranti Chowk", avg_fill: 61, bin_count: 18 },
  { zone: "Aurangpura", avg_fill: 58, bin_count: 12 },
];

export default function ZoneRanking({ zones = MOCK_ZONES }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Highest Fill Zones
      </h3>
      <div className="space-y-4">
        {zones.map((zone, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex justify-between items-end mb-1.5">
              <span className="font-medium text-sm">{zone.zone}</span>
              <span className="text-xs font-bold">{zone.avg_fill}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${getBarColor(zone.avg_fill)}`} 
                style={{ width: `${zone.avg_fill}%` }}
              ></div>
            </div>
            <div className="mt-1.5 text-[10px] text-gray-400 text-right">
              {zone.bin_count} bins
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getBarColor(fill) {
  if (fill >= 90) return 'bg-critical';
  if (fill >= 70) return 'bg-high';
  if (fill >= 50) return 'bg-medium';
  return 'bg-low';
}
