import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF, InfoWindowF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 19.876,
  lng: 75.342
};

const LIBRARIES = ['geometry'];

export default function LiveMap({ predictions = [], route = [], liveTruckLocation = null }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCTLQiaw9lqFHSTVhPBQLVO9jtfQwUSvEQ',
    libraries: LIBRARIES
  });

  const [map, setMap] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);

  const center = useMemo(() => {
    if (liveTruckLocation) {
      return liveTruckLocation;
    }
    if (predictions.length > 0) {
      const first = predictions[0];
      if (first.lat && (first.lon || first.lng)) {
        return { lat: first.lat, lng: first.lon || first.lng };
      }
    }
    return defaultCenter;
  }, [predictions, liveTruckLocation]);

  const routeCoords = useMemo(() => {
    return route.map(stop => ({
      lat: stop.lat,
      lng: stop.lon || stop.lng
    }));
  }, [route]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400">Loading Satellite Map...</div>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeId: 'satellite',
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* Route Line */}
        {routeCoords.length > 1 && (
          <PolylineF
            path={routeCoords}
            options={{
              strokeColor: '#6366f1',
              strokeOpacity: 1.0,
              strokeWeight: 4,
            }}
          />
        )}

        {/* Live Truck Marker */}
        {liveTruckLocation && (
          <MarkerF
            position={liveTruckLocation}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/2830/2830310.png', // Trash truck icon
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }}
            zIndex={100}
          />
        )}

        {/* Bin Markers */}
        {predictions.map((bin, idx) => {
          const urgencyKey = (bin.urgency || 'low').toUpperCase();
          const isHigh = urgencyKey === "HIGH" || urgencyKey === "CRITICAL";
          const isMedium = urgencyKey === "MEDIUM";
          
          let iconColor = isHigh ? 'red' : isMedium ? 'yellow' : 'green';
          let url = `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`;

          return (
            <MarkerF
              key={bin.bin_id || idx}
              position={{ lat: bin.lat, lng: bin.lon || bin.lng }}
              icon={{
                url: url,
                scaledSize: new window.google.maps.Size(32, 32)
              }}
              onClick={() => setSelectedBin(bin)}
            />
          );
        })}

        {/* Info Window */}
        {selectedBin && (
          <InfoWindowF
            position={{ lat: selectedBin.lat, lng: selectedBin.lon || selectedBin.lng }}
            onCloseClick={() => setSelectedBin(null)}
          >
            <div className="p-1 min-w-[150px] text-slate-800">
              <strong className="block text-indigo-600 text-sm mb-1 font-bold">
                {selectedBin.name || selectedBin.area_name || 'Bin Location'}
              </strong>
              <div className="text-xs space-y-1">
                <div>ID: {selectedBin.bin_id?.slice(-8) || 'N/A'}</div>
                <div>Fill: {Math.round(selectedBin.fill_pct || 0)}%</div>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Map Legend Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="p-4 rounded-xl border border-black/10 bg-white/90 shadow-lg flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Urgent (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Normal (&lt;50%)</span>
          </div>
          <div className="h-px bg-slate-200 my-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-indigo-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Optimized Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
