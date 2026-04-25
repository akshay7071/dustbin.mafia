import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPredictions } from '../store/binsSlice';
import { optimizeRoute, dispatchRoute } from '../store/routeSlice';
import ZoneRanking from './ZoneRanking';
import { BrainCircuit, Route as RouteIcon, Send, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoutePanel() {
  const dispatch = useDispatch();
  const { predictions, loading: binsLoading } = useSelector(state => state.bins);
  const { stats, route, loading: routeLoading, dispatched } = useSelector(state => state.route);
  
  const [driverPhone, setDriverPhone] = useState('+91');

  const handlePredict = async () => {
    try {
      await dispatch(fetchPredictions()).unwrap();
      toast.success('AI Prediction completed');
    } catch (err) {
      toast.error('Failed to run predictions');
    }
  };

  const handleOptimize = async () => {
    try {
      // Mocking depot coordinates for Sambhajinagar
      await dispatch(optimizeRoute({ 
        depot_lat: 19.8744, 
        depot_lng: 75.3445, 
        urgency_filter: 'HIGH' 
      })).unwrap();
      toast.success('Route optimized successfully!');
    } catch (err) {
      toast.error('Failed to optimize route');
    }
  };

  const handleDispatch = async () => {
    if (driverPhone.length < 10) {
      toast.error('Enter a valid phone number');
      return;
    }
    try {
      await dispatch(dispatchRoute({ driver_phone: driverPhone, route_id: 'mock_route_123' })).unwrap();
      toast.success('Route dispatched via SMS!');
    } catch (err) {
      toast.error('Failed to dispatch route');
    }
  };

  const criticalCount = predictions.filter(b => b.urgency === 'CRITICAL').length;
  const highCount = predictions.filter(b => b.urgency === 'HIGH').length;
  const hasPredictions = predictions.length > 0;
  const hasRoute = route.length > 0;

  return (
    <div className="w-96 bg-white border-l border-border flex flex-col h-full overflow-y-auto route-panel shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 relative">
      <div className="p-6 pb-2 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Route Optimizer</h2>
        <p className="text-sm text-text-muted mt-1">Demand-driven collection</p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Prediction Section */}
        <section>
          <button 
            onClick={handlePredict}
            disabled={binsLoading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {binsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            <span>Run AI Prediction</span>
          </button>
          
          {hasPredictions && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="text-red-500 font-semibold mb-1">CRITICAL</div>
                <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <div className="text-orange-500 font-semibold mb-1">HIGH</div>
                <div className="text-2xl font-bold text-orange-700">{highCount}</div>
              </div>
            </div>
          )}
        </section>

        {/* Route Optimization Section */}
        {hasPredictions && (
          <section className="pt-4 border-t border-gray-100 border-dashed">
            <button 
              onClick={handleOptimize}
              disabled={routeLoading || criticalCount + highCount === 0}
              className="w-full py-2.5 px-4 bg-white border-2 border-primary text-primary hover:bg-green-50 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-50"
            >
              {routeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RouteIcon className="w-5 h-5" />}
              <span>Optimize Route</span>
            </button>

            {hasRoute && stats && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Route Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stops</span>
                    <span className="font-medium text-gray-900">{stats.bins_in_route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Optimized Dist.</span>
                    <span className="font-medium text-green-600">{stats.total_km} km</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Baseline Dist.</span>
                    <span className="line-through">{stats.baseline_km} km</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fuel Saved</span>
                    <span className="font-medium text-gray-900">{stats.fuel_saved_L} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CO₂ Avoided</span>
                    <span className="font-medium text-gray-900">{stats.co2_saved_kg} kg</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Dispatch Section */}
        {hasRoute && (
          <section className="pt-4 border-t border-gray-100 border-dashed">
            {dispatched ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start space-x-3 border border-green-200">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold">Route Dispatched</h4>
                  <p className="text-xs mt-1 opacity-80">SMS sent to {driverPhone}. Driver can now access the PWA.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Driver Phone</label>
                <input 
                  type="text" 
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
                <button 
                  onClick={handleDispatch}
                  disabled={routeLoading}
                  className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch via SMS</span>
                </button>
              </div>
            )}
          </section>
        )}

        <ZoneRanking />
      </div>
    </div>
  );
}
