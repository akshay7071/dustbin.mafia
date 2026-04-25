import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const URGENCY_COLOR = {
  CRITICAL: "#DC2626",
  HIGH:     "#EA580C",
  MEDIUM:   "#D97706",
  LOW:      "#16A34A"
};

export default function BinMap({ predictions = [], route = [] }) {
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
        
        {predictions.map(bin => (
          <CircleMarker
            key={bin.bin_id}
            center={[bin.lat, bin.lng]}
            radius={bin.urgency === "CRITICAL" ? 10 : bin.urgency === "HIGH" ? 8 : 6}
            pathOptions={{
              color: URGENCY_COLOR[bin.urgency],
              fillColor: URGENCY_COLOR[bin.urgency],
              fillOpacity: 0.8,
              weight: 1
            }}
          >
            <Popup className="rounded-lg shadow-sm">
              <div className="p-1">
                <strong className="block text-gray-800 mb-1">{bin.area}</strong>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-3 gap-y-1">
                  <span>Bin ID:</span> <span className="font-medium text-gray-900">{bin.bin_id}</span>
                  <span>Fill Level:</span> <span className="font-bold text-gray-900">{bin.predicted_fill}%</span>
                  <span>Urgency:</span> <span className="font-bold" style={{color: URGENCY_COLOR[bin.urgency]}}>{bin.urgency}</span>
                  <span>Status:</span> <span className="capitalize">{bin.status || 'Pending'}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ color: "#3B82F6", weight: 4, dashArray: "8 6", opacity: 0.8 }} 
          />
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-[400] bg-white p-3 rounded-lg shadow-lg border border-gray-100 flex flex-col space-y-2">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
        {Object.entries(URGENCY_COLOR).map(([level, color]) => (
          <div key={level} className="flex items-center space-x-2 text-sm">
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }}></span>
            <span className="capitalize text-gray-700">{level.toLowerCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
