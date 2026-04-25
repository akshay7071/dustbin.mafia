import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const URGENCY_COLOR = {
  CRITICAL: "#EF4444", // Neon Red
  HIGH:     "#F59E0B", // Amber
  MEDIUM:   "#F59E0B", // Amber
  LOW:      "#10B981"  // Emerald
};

const GLOW_STYLE = {
  CRITICAL: { color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.9, weight: 2 },
  HIGH: { color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.8, weight: 2 },
  MEDIUM: { color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.6, weight: 1 },
  LOW: { color: '#10B981', fillColor: '#10B981', fillOpacity: 0.5, weight: 1 }
};

// Component to handle heatmap overlay (simulated with canvas/plasma class)
function HeatmapOverlay() {
  const map = useMap();
  useEffect(() => {
    map.getPane('overlayPane').classList.add('animate-plasma');
    return () => {
      map.getPane('overlayPane').classList.remove('animate-plasma');
    };
  }, [map]);
  return null;
}

export default function LiveMap({ predictions = [], route = [], showHeatmap = false }) {
  const routeCoords = route.map(stop => [stop.lat, stop.lng]);

  return (
    <div className="relative flex-1 h-full w-full">
      <MapContainer 
        center={[19.8744, 75.3445]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0, backgroundColor: '#050914' }}
        zoomControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {showHeatmap && <HeatmapOverlay />}

        {predictions.map(bin => {
          const isCritical = bin.urgency === "CRITICAL";
          return (
            <CircleMarker
              key={bin.bin_id}
              center={[bin.lat, bin.lng]}
              radius={isCritical ? 12 : bin.urgency === "HIGH" ? 9 : 6}
              pathOptions={{
                ...GLOW_STYLE[bin.urgency],
                className: isCritical ? 'animate-pulse-red' : ''
              }}
            >
              <Popup className="custom-popup border-0 bg-transparent">
                <div className="glass-panel p-4 rounded-xl border border-white/10 text-white min-w-[220px] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <strong className="block font-heading text-lg text-cyan-400 mb-3">{bin.area}</strong>
                  <div className="text-xs font-mono grid grid-cols-2 gap-x-4 gap-y-3">
                    <span className="text-slate-400">BIN_ID:</span> <span className="text-white">{bin.bin_id}</span>
                    <span className="text-slate-400">FILL:</span> <span className="text-white font-bold">{bin.predicted_fill}%</span>
                    <span className="text-slate-400">URGENCY:</span> <span className="font-bold" style={{color: URGENCY_COLOR[bin.urgency]}}>{bin.urgency}</span>
                    <span className="text-slate-400">STATUS:</span> <span className="text-emerald-400 capitalize">{bin.status || 'Active'}</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        
        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ 
              color: "#06B6D4", // Neon Cyan
              weight: 4, 
              opacity: 0.9,
              dashArray: "10 10",
              className: 'route-polyline'
            }} 
          />
        )}
      </MapContainer>
    </div>
  );
}
