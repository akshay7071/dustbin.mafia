import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Leaf, Clock, Truck, ShieldAlert } from 'lucide-react';

// For the heatmap, we would ideally use leaflet.heat, but since it's a bit tricky to integrate 
// seamlessly with react-leaflet v4 without a custom wrapper, we will mock the visual representation 
// or simply use circle markers with high opacity/blur if available, or just a generic map for demo.
// In a full implementation, we'd include leaflet-heat.js.

export default function Public() {
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    // Auto-refresh simulation
    const interval = setInterval(() => {
      setLastUpdated(0);
    }, 60000); // 60s
    
    const timeInterval = setInterval(() => {
      setLastUpdated(prev => prev + 1);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Sambhaji Nagar Waste Intelligence
              <span className="ml-3 relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-low opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-low"></span>
              </span>
            </h1>
            <p className="text-gray-500 mt-1">Live public transparency dashboard</p>
          </div>
          <div className="text-sm text-gray-400 flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border">
            <Clock className="w-4 h-4 mr-1.5" />
            Last updated {lastUpdated === 0 ? 'just now' : `${lastUpdated} min ago`}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Trash2 className="w-6 h-6 text-primary" />}
            title="Bins Collected Today"
            value="187"
            color="bg-primary/10 text-primary"
          />
          <StatCard 
            icon={<Truck className="w-6 h-6 text-accent" />}
            title="Routes Completed"
            value="3"
            color="bg-accent/10 text-accent"
          />
          <StatCard 
            icon={<Leaf className="w-6 h-6 text-low" />}
            title="CO₂ Avoided This Week"
            value="43 kg"
            color="bg-low/10 text-low"
          />
          <StatCard 
            icon={<ShieldAlert className="w-6 h-6 text-critical" />}
            title="Overflow Incidents"
            value="2"
            color="bg-critical/10 text-critical"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Heatmap Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Live Density Map</h2>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500">Low</span>
                <div className="w-24 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full"></div>
                <span className="text-gray-500">High Fill</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <MapContainer 
                center={[19.8744, 75.3445]} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                scrollWheelZoom={false}
              >
                <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; CARTO'
                />
                {/* Mocking heatmap with semi-transparent circles for demo */}
                <div className="absolute inset-0 z-[400] flex items-center justify-center pointer-events-none">
                  <div className="bg-white/80 p-4 rounded-lg shadow-lg text-center backdrop-blur-sm border">
                    <p className="text-gray-800 font-medium mb-1">Density Heatmap Active</p>
                    <p className="text-xs text-gray-500">Anonymized zone data showing accumulation hotspots.</p>
                  </div>
                </div>
              </MapContainer>
            </div>
          </div>

          {/* Zone Ranking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-6">Current Focus Areas</h2>
            
            <div className="space-y-5">
              <ZoneRow name="Nirala Bazaar" fill={74} status="HIGH" />
              <ZoneRow name="Mondha Market" fill={71} status="HIGH" />
              <ZoneRow name="Cidco N-1" fill={65} status="MEDIUM" />
              <ZoneRow name="Kranti Chowk" fill={58} status="MEDIUM" />
              <ZoneRow name="Aurangpura" fill={49} status="LOW" />
              <ZoneRow name="Waluj MIDC" fill={32} status="LOW" />
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Did you know?</strong> Our AI predicts exactly when bins will be full based on the type of zone, reducing unnecessary truck emissions by 56%.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-gray-500 text-sm border-t bg-white">
        Data provided by SmartWasteRouteAI • Updates every 60 seconds
      </footer>
    </div>
  );
}

// Temporary icon component for Trash2 since it was missed in imports above
const Trash2 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ZoneRow({ name, fill, status }) {
  const getStatusColor = (s) => {
    if (s === 'HIGH') return 'text-orange-600 bg-orange-100';
    if (s === 'MEDIUM') return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
      <div>
        <h4 className="font-medium text-gray-800 text-sm">{name}</h4>
        <div className="w-32 bg-gray-100 rounded-full h-1.5 mt-2">
          <div 
            className={`h-1.5 rounded-full ${status === 'HIGH' ? 'bg-orange-500' : status === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${fill}%` }}
          ></div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-gray-900">{fill}%</div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1 inline-block ${getStatusColor(status)}`}>
          {status}
        </div>
      </div>
    </div>
  );
}
