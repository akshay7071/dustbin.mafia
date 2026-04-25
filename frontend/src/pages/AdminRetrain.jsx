import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Zap, 
  RefreshCcw, 
  History as HistoryIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BrainCircuit,
  TrendingUp,
  Cpu
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminRetrain() {
  const [logs, setLogs] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, logRes] = await Promise.all([
        api.get('/collect/accuracy'),
        api.get('/retrain/logs')
      ]);
      setAccuracy(accRes.data);
      setLogs(logRes.data.logs || []);
    } catch (err) {
      toast.error('Failed to fetch retraining data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    const id = toast.loading('Initiating AI Model Retraining...');
    try {
      const res = await api.post('/retrain');
      toast.success('Retraining triggered successfully!', { id });
      // Poll for updates after 5 seconds
      setTimeout(fetchData, 5000);
    } catch (err) {
      toast.error('Failed to trigger retraining', { id });
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BrainCircuit className="w-7 h-7 text-primary" />
          Model Self-Evolution
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage the AI training loop and track performance improvements.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Action */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-gray-900">Current Accuracy</h3>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-primary">{accuracy?.accuracy_pct || '0'}%</span>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Optimal</span>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-6">Based on {accuracy?.total_collections || 0} samples in feedback loop.</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg. Error</span>
                <span className="font-bold text-gray-900">{accuracy?.avg_error || 0}%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${100 - (accuracy?.avg_error || 0)}%` }}></div>
              </div>
            </div>

            <button 
              onClick={handleRetrain}
              disabled={retraining || loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {retraining ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <RefreshCcw className="w-5 h-5" />
                  Retrain Model Now
                </>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl text-white">
            <div className="bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">How it evolves</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every collection feedback is logged. When retraining is triggered, the Random Forest model incorporates new patterns to minimize RMSE.
            </p>
          </div>
        </div>

        {/* Right Column: Logs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-gray-400" />
                Retraining Logs
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Session ID</th>
                    <th className="px-6 py-4">Triggered At</th>
                    <th className="px-6 py-4">New Accuracy</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-sm text-gray-400">Loading evolution history...</td>
                    </tr>
                  ) : logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{log.id.slice(-8)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{log.metrics?.accuracy_pct || '--'}%</span>
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Success</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <p className="text-gray-400 text-sm">No retraining logs yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
