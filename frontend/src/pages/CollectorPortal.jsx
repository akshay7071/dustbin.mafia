import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  User, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  BarChart3, 
  ChevronRight, 
  Loader2, 
  ArrowLeft,
  CircleDot
} from 'lucide-react';
import toast from 'react-hot-toast';

const URGENCY_COLORS = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500'
};

export default function CollectorPortal() {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [collectorData, setCollectorData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      const res = await api.get('/collectors');
      setCollectors(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch collectors');
      setLoading(false);
    }
  };

  const selectCollector = async (collector) => {
    setLoading(true);
    setSelectedCollector(collector);
    try {
      const [binsRes, statsRes] = await Promise.all([
        api.get(`/collector/${collector.collector_id}/bins`),
        api.get(`/collector/${collector.collector_id}/stats`)
      ]);
      setCollectorData(binsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load collector data');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (bin) => {
    setActionLoading(bin.bin_id);
    try {
      // The backend expects specific fields for the self-evolution logic
      const payload = {
        bin_id: bin.bin_id,
        area_name: bin.name || 'Unknown',
        last_collected_hours: bin.last_collected_hours || 24,
        predicted_fill: bin.predicted_fill,
        actual_color: bin.predicted_fill > 90 ? 'red' : bin.predicted_fill > 70 ? 'orange' : 'green' 
        // In a real app, the collector would select the actual color/fill
      };
      
      await api.post('/collect', payload);
      toast.success(`${bin.bin_id} collected successfully`);
      
      // Refresh data
      selectCollector(selectedCollector);
    } catch (err) {
      toast.error('Collection failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !selectedCollector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!selectedCollector) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary p-2 rounded-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Collector Portal</h1>
          </div>
          <p className="text-gray-500">Select your name to see assigned bins and route</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectors.map((c) => (
            <button
              key={c.collector_id}
              onClick={() => selectCollector(c)}
              className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-primary/10 transition-colors">
                  <User className="w-6 h-6 text-gray-600 group-hover:text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.status || 'Active'}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-8 rounded-b-[2rem] shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-6 opacity-80 cursor-pointer" onClick={() => setSelectedCollector(null)}>
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Selection</span>
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{selectedCollector.name}</h1>
            <div className="flex items-center gap-2 text-white/70 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{(selectedCollector.assigned_zone || []).join(', ')}</span>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-xs text-white/60 uppercase tracking-wider font-bold">Accuracy</div>
            <div className="text-xl font-bold">{stats?.avg_accuracy_pct || '--'}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg">
              <Trash2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">{collectorData?.total_bins || 0}</div>
              <div className="text-[10px] text-white/60 uppercase font-bold">Total Bins</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.bins_collected_today || 0}</div>
              <div className="text-[10px] text-white/60 uppercase font-bold">Collected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bin List */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-primary" />
          Today's Route
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          collectorData?.bins.map((bin, idx) => (
            <div 
              key={bin.bin_id}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden ${bin.status === 'collected' ? 'opacity-60' : ''}`}
            >
              {/* Urgency Indicator */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${URGENCY_COLORS[bin.urgency] || 'bg-gray-200'}`}></div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{bin.bin_id}</div>
                  <h3 className="text-xl font-bold text-gray-900">{bin.name || bin.area_name || 'Municipal Bin'}</h3>
                  <div className="text-sm text-gray-500 mt-0.5">{bin.zone}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${URGENCY_COLORS[bin.urgency]} text-white`}>
                  {bin.urgency}
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">Predicted Fill</div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${URGENCY_COLORS[bin.urgency]}`} 
                      style={{ width: `${bin.predicted_fill}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs font-bold text-gray-900 mt-1">{bin.predicted_fill}%</div>
                </div>
                <div className="h-10 w-px bg-gray-100"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-bold uppercase">Stop</div>
                  <div className="text-2xl font-black text-primary">#{idx + 1}</div>
                </div>
              </div>

              {bin.status !== 'collected' ? (
                <button
                  onClick={() => handleCollect(bin)}
                  disabled={actionLoading === bin.bin_id}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading === bin.bin_id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Collected
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full bg-green-50 text-green-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-green-100">
                  <CheckCircle2 className="w-5 h-5" />
                  Collected
                </div>
              )}
            </div>
          ))
        )}

        {collectorData?.bins.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Bins Assigned</h3>
            <p className="text-gray-500 text-sm mt-1">Looks like you're all clear for today!</p>
          </div>
        )}
      </div>
    </div>
  );
}
