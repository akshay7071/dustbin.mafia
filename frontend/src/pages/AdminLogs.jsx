import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { 
  History, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Search,
  Filter,
  ArrowRight,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } }
};

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collect/logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      toast.error('Failed to fetch field logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.bin_id?.toLowerCase().includes(filter.toLowerCase()) ||
    log.area_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="relative flex-1 w-full bg-[#050914] pt-24 min-h-screen">
      <div className="space-dust" />
      
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8"
      >
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white tracking-wide flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <History className="w-7 h-7 text-indigo-400" />
              </div>
              FEEDBACK <span className="text-cyan-400">LOGS</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-tighter">Real-time intelligence from the collector network</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH BIN OR WARD..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none w-72 transition-all backdrop-blur-md"
              />
            </div>
            <button 
              onClick={fetchLogs}
              disabled={loading}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-cyan-400 disabled:opacity-50"
            >
              <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.header>

        <motion.div variants={itemVariants} className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 font-mono">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temporal Signature</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector / Ward</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">AI Pred.</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Manual Obs.</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-mono text-xs animate-pulse">SYNCHRONIZING FEEDBACK STREAM...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => {
                    const isAccurate = (log.error || 0) <= 25;
                    return (
                      <motion.tr 
                        key={log.id || idx} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="text-xs text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleDateString()}
                            <span className="block text-[10px] text-slate-600 mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-white bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-mono">
                            {log.bin_id?.slice(-12) || 'UNK-BIN'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                            {log.area_name || 'Central Sector'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-xs font-mono text-slate-400">{Math.round(log.predicted_fill)}%</span>
                        </td>
                        <td className="px-8 py-5 text-center font-bold text-white">
                          <div className="flex items-center justify-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${log.actual_color === 'red' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : log.actual_color === 'yellow' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                             <span className="text-xs font-mono uppercase tracking-tighter">{log.actual_color}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold font-mono ${!isAccurate ? 'text-red-400' : 'text-emerald-400'}`}>
                              {Math.round(log.error || 0)}%
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${!isAccurate ? 'text-red-500/50' : 'text-emerald-500/50'}`}>
                              {isAccurate ? 'NOMINAL' : 'DEVIATION'}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <Database className="w-16 h-16 text-slate-600 mb-6 stroke-[1]" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2 font-heading">Zero Logs Found</h3>
                        <p className="text-slate-500 text-xs font-mono">Collect feedback to see historical performance data.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
