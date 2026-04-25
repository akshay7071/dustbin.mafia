import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import DriverStop from '../components/DriverStop';
import { AlertTriangle, Map, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Driver() {
  const location = useLocation();
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collectedBins, setCollectedBins] = useState(new Set());

  useEffect(() => {
    // In a real app, we'd extract route_id from URL search params: ?route=123
    // and fetch the specific route from the API.
    // For this hackathon demo, we will simulate fetching a route
    
    const fetchRoute = async () => {
      try {
        // Simulating API call
        // const res = await api.get(`/api/route/${routeId}`);
        // setRouteData(res.data);
        
        setTimeout(() => {
          setRouteData({
            id: 'rt_8f7a9',
            total_km: 18.4,
            est_minutes: 92,
            stops: [
              { bin_id: 'BIN-102', area: 'Nirala Bazaar', fill: 95, urgency: 'CRITICAL', lat: 19.8803, lng: 75.3392 },
              { bin_id: 'BIN-045', area: 'Mondha Market', fill: 88, urgency: 'HIGH', lat: 19.8820, lng: 75.3370 },
              { bin_id: 'BIN-211', area: 'Cidco N-1', fill: 92, urgency: 'CRITICAL', lat: 19.8744, lng: 75.3445 },
              { bin_id: 'BIN-178', area: 'Kranti Chowk', fill: 74, urgency: 'HIGH', lat: 19.8744, lng: 75.3445 },
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        toast.error('Failed to load route');
        setLoading(false);
      }
    };

    fetchRoute();
  }, []);

  const handleCollect = async (bin_id) => {
    try {
      // API call to update bin status
      // await api.patch(`/api/bins/${bin_id}`, { status: 'collected' });
      // await api.post('/webhooks/bin-collected', { bin_id, collected_at: new Date().toISOString() });
      
      setCollectedBins(prev => new Set(prev).add(bin_id));
      toast.success('Stop marked as collected');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleOverflow = async (bin_id) => {
    try {
      // await api.post('/webhooks/overflow', { bin_id, reported_at: new Date().toISOString() });
      toast.success('Overflow reported. Supervisor notified.');
    } catch (err) {
      toast.error('Failed to report overflow');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div>
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Route Not Found</h2>
          <p className="text-gray-500 mt-2">The route link appears to be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24 md:max-w-md md:mx-auto md:shadow-2xl relative">
      {/* Header */}
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-md relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Today's Route</h1>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">{routeData.stops.length} Stops</span>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm border border-white/10">
          <div>
            <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-1">Total Distance</div>
            <div className="text-2xl font-bold">{routeData.total_km} <span className="text-sm font-normal">km</span></div>
          </div>
          <div className="h-10 w-px bg-white/20"></div>
          <div>
            <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-1">Est. Time</div>
            <div className="text-2xl font-bold">{Math.floor(routeData.est_minutes / 60)}h {routeData.est_minutes % 60}m</div>
          </div>
        </div>
      </div>

      {/* Stop List */}
      <div className="p-4 space-y-4 -mt-4 relative z-0">
        {routeData.stops.map((stop, index) => (
          <DriverStop 
            key={stop.bin_id}
            stop={stop}
            stopNumber={index + 1}
            isCollected={collectedBins.has(stop.bin_id)}
            onCollect={handleCollect}
            onOverflow={handleOverflow}
          />
        ))}
        
        {collectedBins.size === routeData.stops.length && (
          <div className="text-center p-8 text-green-600 bg-green-50 rounded-xl border border-green-200 mt-8">
            <h3 className="font-bold text-xl mb-2">Route Complete!</h3>
            <p className="text-sm">Great job. You've collected all assigned bins for this run.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 md:right-auto md:ml-[340px] bg-red-600 text-white p-4 rounded-full shadow-lg shadow-red-600/30 hover:bg-red-700 transition-colors z-50">
        <AlertTriangle className="w-6 h-6" />
      </button>
    </div>
  );
}
