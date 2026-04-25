import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Truck, MapPin, AlertTriangle, Navigation2, CheckCircle,
  Clock, Database, Search, ChevronUp, ChevronDown,
  Terminal, Activity, AlertCircle, Route, X, Map as MapIcon,
  Target, Loader2
} from 'lucide-react';
import LiveMap from '../../components/LiveMap';
import { fetchAllBins } from '../../store/binsSlice';
import { optimizeRoute } from '../../store/routeSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CollectorDashboard() {
  const dispatch = useDispatch();
  const { bins } = useSelector(state => state.bins);
  const { route, stats, loading: routeLoading } = useSelector(state => state.route);
  
  const [collectionStarted, setCollectionStarted] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [collected, setCollected] = useState(new Set());
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), msg: 'SYSTEM_BOOT: Collector OS v4.2 initialized.', type: 'info' }
  ]);

  useEffect(() => {
    dispatch(fetchAllBins());
    // Auto-optimize route on mount for collector if none exists
    if (route.length === 0) {
      dispatch(optimizeRoute());
    }
  }, [dispatch]);

  const addLog = (msg, type = 'info') => {
    const now = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLogs(prev => [{ id: Date.now(), time: now, msg, type }, ...prev].slice(0, 50));
  };

  const handleCollect = async (bin) => {
    const loadingToast = toast.loading(`Verifying collection for ${bin.bin_id}...`);
    try {
      // Backend /collect endpoint
      await api.post('/collect', {
        bin_id: bin.bin_id,
        area_name: bin.area_name || bin.name || 'Unknown',
        last_collected_hours: bin.last_collected_hours || 0,
        predicted_fill: bin.fill_pct || bin.fill || 0,
        actual_color: bin.fill_pct > 80 ? 'red' : 'yellow' // Simulated observation
      });

      setCollected(prev => new Set(prev).add(bin.bin_id));
      addLog(`SUCCESS: Bin ${bin.bin_id?.slice(-8)} collection verified. Pattern logged to AI core.`, 'success');
      toast.success('Collection Logged & Verified', { id: loadingToast });
      
      // Move to next stop if available
      if (currentStopIndex < route.length - 1) {
        setCurrentStopIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Telemetry Sync Failed', { id: loadingToast });
      addLog(`ERROR: Bin ${bin.bin_id?.slice(-8)} sync failure. Retry recommended.`, 'alert');
    }
  };

  const displayedBins = route.filter(b =>
    (b.area_name || b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.bin_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBin = route[currentStopIndex];

  return (
    <div className="relative w-full h-full bg-[#050914] overflow-hidden">
      <div className="space-dust" />

      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <LiveMap predictions={bins} route={route} />
      </div>

      {/* ── LEFT SIDEBAR — MISSION PROFILE ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        className="absolute top-4 left-6 bottom-44 w-80 z-40"
      >
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xs font-bold text-white flex items-center tracking-[0.2em] uppercase">
              <Database className="w-4 h-4 mr-2 text-indigo-400" />
              Route Sequence
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
              {collected.size}/{route.length} STOPS
            </span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="SEARCH ENTITY..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
            />
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pb-4">
            {routeLoading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                 <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
                 <span className="text-[10px] font-mono uppercase">Optimizing...</span>
              </div>
            ) : displayedBins.map((bin, i) => {
              const isDone = collected.has(bin.bin_id);
              const isNext = route[currentStopIndex]?.bin_id === bin.bin_id && !isDone;
              const urgency = (bin.urgency || 'low').toUpperCase();

              return (
                <div
                  key={bin.bin_id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${isDone
                    ? 'border-white/5 bg-white/[0.02] opacity-40 grayscale'
                    : isNext
                      ? 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : urgency === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'}`} />
                      <span className={`text-[11px] font-bold font-mono tracking-tight ${isDone ? 'text-slate-500' : 'text-white'}`}>
                        {bin.bin_id?.slice(-12) || `STOP-${i+1}`}
                      </span>
                    </div>
                    {isNext && <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/30 uppercase tracking-tighter">Target</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono uppercase truncate max-w-[120px]">{bin.area_name || 'Central Ward'}</span>
                    <span className={`text-xs font-black font-mono ${bin.fill_pct > 80 ? 'text-red-400' : 'text-slate-400'}`}>{Math.round(bin.fill_pct)}%</span>
                  </div>
                  {isNext && collectionStarted && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCollect(bin)}
                      className="w-full mt-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-black rounded-xl font-heading tracking-[0.1em] transition-all flex items-center justify-center space-x-2 uppercase"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Collection</span>
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT OVERLAY — MISSION OPS ── */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.1 }}
        className="absolute top-4 right-6 z-40 w-80"
      >
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Truck className="text-indigo-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-black text-xs text-white tracking-[0.2em] uppercase">Unit 7-Alpha</h2>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Active Dispatch</p>
              </div>
            </div>
            <div className="flex h-2 w-2 relative">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center bg-white/[0.03] rounded-2xl p-3 border border-white/5">
              <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">Queue</p>
              <p className="text-sm font-black text-white">{route.length}</p>
            </div>
            <div className="text-center bg-indigo-500/10 rounded-2xl p-3 border border-indigo-500/20">
              <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">Done</p>
              <p className="text-sm font-black text-indigo-400">{collected.size}</p>
            </div>
            <div className="text-center bg-white/[0.03] rounded-2xl p-3 border border-white/5">
              <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">Impact</p>
              <p className="text-sm font-black text-emerald-400">{stats?.co2_saved_kg || '0'}kg</p>
            </div>
          </div>

          {/* Current Target Focus */}
          {collectionStarted && currentBin && !collected.has(currentBin.bin_id) ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-5 rounded-3xl border border-cyan-500/30 bg-cyan-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Navigation2 className="w-12 h-12 text-cyan-400 -rotate-45" />
              </div>
              <p className="text-[9px] font-mono text-cyan-400 uppercase font-black tracking-widest mb-3 flex items-center">
                <Target className="w-3 h-3 mr-1.5" /> Direct Targeting
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-mono font-black text-white tracking-tighter">{currentBin.bin_id?.slice(-8)}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-tight">{currentBin.area_name || 'PRIMARY SECTOR'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-cyan-400 leading-none">{Math.round(currentBin.fill_pct)}%</p>
                  <p className="text-[8px] text-slate-500 uppercase font-mono mt-1">Saturate</p>
                </div>
              </div>
            </motion.div>
          ) : route.length > 0 && collected.size === route.length ? (
            <div className="mb-6 p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-black text-white font-heading tracking-widest uppercase">Mission Complete</p>
              <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">Awaiting Control Command</p>
            </div>
          ) : (
            <div className="mb-6 p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-center opacity-50">
               <MapIcon className="w-8 h-8 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
               <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">Ready for Dispatch</p>
            </div>
          )}

          {/* Primary Action */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { 
                setCollectionStarted(!collectionStarted); 
                addLog(collectionStarted ? 'MISSION_ABORTED: Collector offline.' : 'MISSION_START: Telemetry streaming...', collectionStarted ? 'warning' : 'success'); 
              }}
              className={`w-full py-4 rounded-2xl font-heading tracking-[0.2em] text-[10px] font-black border transition-all flex items-center justify-center space-x-3 uppercase ${collectionStarted
                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                : 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500 shadow-[0_10px_30px_rgba(79,70,229,0.3)]'
              }`}
            >
              {collectionStarted ? <><X className="w-4 h-4" /><span>Abort Mission</span></> : <><Activity className="w-4 h-4" /><span>Initiate Route</span></>}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── CENTRAL TERMINAL FEED ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.4 }}
        className="absolute bottom-4 z-50 pointer-events-none"
        style={{ left: 'calc(20rem + 2.5rem)', right: 'calc(20rem + 2.5rem)' }}
      >
        <div className="pointer-events-auto glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-3xl">
          <div
            onClick={() => setIsTerminalOpen(o => !o)}
            className="flex items-center justify-between px-6 py-3.5 bg-black/40 border-b border-white/5 cursor-pointer hover:bg-black/60 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Terminal className="text-indigo-400 w-4 h-4" />
              <span className="font-mono text-[10px] text-slate-300 tracking-[0.3em] font-bold uppercase">Mission_Telemetry.log</span>
            </div>
            {isTerminalOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
          </div>
          <AnimatePresence>
            {isTerminalOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 120 }}
                exit={{ height: 0 }}
                className="overflow-y-auto custom-scrollbar bg-[#02040A]/60 px-6 py-4 font-mono text-[10px]"
              >
                {logs.map(log => (
                  <div key={log.id} className="mb-2 flex space-x-4 items-start border-l border-white/5 pl-3">
                    <span className="text-slate-600 shrink-0 text-[9px]">[{log.time}]</span>
                    <span className={
                      log.type === 'alert' ? 'text-red-400 font-bold' :
                      log.type === 'warning' ? 'text-amber-400 font-bold' :
                      log.type === 'success' ? 'text-emerald-400 font-bold' : 'text-indigo-300'
                    }>{log.msg}</span>
                  </div>
                ))}
                <div className="flex space-x-3 items-center opacity-30 mt-2">
                   <span className="w-2 h-3 bg-indigo-400 animate-pulse inline-block" />
                   <span className="text-slate-500 tracking-widest text-[9px]">WAITING_FOR_DATA_STREAM...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
