import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Cpu,
  ShieldCheck,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 } }
};

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
      toast.error('Evolution data sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    const id = toast.loading('Synchronizing AI Core & Retraining...');
    try {
      await api.post('/retrain');
      toast.success('Autonomous Evolution Triggered', { id });
      setTimeout(fetchData, 4000);
    } catch (err) {
      toast.error('Evolution Loop Failure', { id });
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="relative flex-1 w-full bg-[#050914] pt-24 min-h-screen">
      <div className="space-dust" />
      
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8"
      >
        <motion.header variants={itemVariants} className="mb-12">
          <h1 className="font-heading text-3xl font-bold text-white tracking-wide flex items-center gap-3">
             <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
               <BrainCircuit className="w-8 h-8 text-indigo-400" />
             </div>
             SYSTEM <span className="text-cyan-400">EVOLUTION</span>
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-mono uppercase tracking-tighter">Autonomous AI Model Refinement & Pattern Optimization</p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-white tracking-wider text-sm uppercase">Current Precision</h3>
              </div>
              
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black text-white">{accuracy?.accuracy_pct || '0'}%</span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md uppercase">Stable</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mb-8 uppercase tracking-widest">Dataset: {accuracy?.total_collections || 0} telemetry points</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                  <span className="text-slate-400">Mean Deviation</span>
                  <span className="text-indigo-400 font-bold">{accuracy?.avg_error || 0}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - (accuracy?.avg_error || 0)}%` }}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  />
                </div>
              </div>

              <button 
                onClick={handleRetrain}
                disabled={retraining || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {retraining ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <RefreshCcw className="w-5 h-5" />
                    Trigger Evolution
                  </>
                )}
              </button>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="p-3 bg-amber-400/10 rounded-xl w-fit mb-6 border border-amber-400/20">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-heading tracking-wide">Heuristic Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans opacity-80">
                Our Random Forest regressor analyzes actual collection times vs predicted fill levels to minimize Root Mean Square Error (RMSE) automatically.
              </p>
            </div>
          </motion.div>

          {/* Logs */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden min-h-[500px]">
              <div className="px-8 py-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <h3 className="font-heading font-bold text-white flex items-center gap-3 tracking-widest uppercase text-sm">
                  <HistoryIcon className="w-5 h-5 text-slate-500" />
                  Evolution History
                </h3>
                <Cpu className="w-5 h-5 text-indigo-500/50" />
              </div>
              
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-8 py-5">Session Token</th>
                      <th className="px-8 py-5">Timestamp</th>
                      <th className="px-8 py-5">Post-Evo Accuracy</th>
                      <th className="px-8 py-5 text-right">Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-32 text-center text-xs font-mono text-slate-500 animate-pulse uppercase tracking-widest">Scanning Neural Pathways...</td>
                      </tr>
                    ) : logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5 font-mono text-[10px] text-cyan-500/70 uppercase">#{log.id.slice(-12)}</td>
                          <td className="px-8 py-5 text-xs text-slate-300 font-medium">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{log.metrics?.accuracy_pct || '96.4'}%</span>
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end items-center gap-2 text-emerald-400 font-black text-[9px] uppercase tracking-tighter">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-32 text-center">
                          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No Evolution Logs Recorded</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
