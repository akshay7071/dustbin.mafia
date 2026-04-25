import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, MapPin, AlertTriangle, Navigation2, CheckCircle,
  Clock, Database, Search, ChevronUp, ChevronDown,
  Terminal, Activity, AlertCircle, Route, X
} from 'lucide-react';
import LiveMap from '../../components/LiveMap';

const ASSIGNED_BINS = [
  { id: 'B04', name: 'City Hall', area: 'Aurangabad City', fill: 95, urgency: 'CRITICAL', lat: 19.876, lng: 75.342 },
  { id: 'B12', name: 'Downtown Plaza', area: 'Station Road', fill: 92, urgency: 'CRITICAL', lat: 19.8756, lng: 75.347 },
  { id: 'B08', name: 'Central Station', area: 'Nirala Bazaar', fill: 85, urgency: 'HIGH', lat: 19.879, lng: 75.351 },
  { id: 'B19', name: 'Market Square', area: 'Mondha Market', fill: 78, urgency: 'HIGH', lat: 19.872, lng: 75.338 },
  { id: 'B45', name: 'Tech Park North', area: 'Cidco N-1', fill: 45, urgency: 'MEDIUM', lat: 19.868, lng: 75.345 },
  { id: 'B22', name: 'Riverside Walk', area: 'Waluj MIDC', fill: 22, urgency: 'LOW', lat: 19.864, lng: 75.332 },
];

const ROUTE_SEQUENCE = ASSIGNED_BINS.map(b => ({ lat: b.lat, lng: b.lng }));

const INIT_LOGS = [
  { id: 1, time: '14:02:01', msg: 'System online. Route initialized.', type: 'info' },
  { id: 2, time: '14:05:12', msg: 'CRITICAL: Bin B04 at 95% — overflow in 45 min.', type: 'alert' },
  { id: 3, time: '14:08:00', msg: 'Emergency bin detected: B12. Added to route.', type: 'warning' },
  { id: 4, time: '14:10:14', msg: 'Route generated. 6 stops. Distance: 8.2 km.', type: 'success' },
];

export default function CollectorDashboard() {
  const [collectionStarted, setCollectionStarted] = useState(false);
  const [currentStop, setCurrentStop] = useState(0);
  const [collected, setCollected] = useState(new Set());
  const [showEmergency, setShowEmergency] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState(INIT_LOGS);

  const addLog = (msg, type = 'info') => {
    const now = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLogs(prev => [...prev, { id: Date.now(), time: now, msg, type }]);
  };

  // Simulate emergency alert for a CRITICAL bin
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmergency(true);
      addLog('🚨 EMERGENCY: Bin B04 overflow imminent! Please divert.', 'alert');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCollect = (binId) => {
    setCollected(prev => new Set(prev).add(binId));
    addLog(`Bin ${binId} marked as collected. Proceeding to next stop.`, 'success');
    if (currentStop < ASSIGNED_BINS.length - 1) setCurrentStop(p => p + 1);
  };

  const mapPredictions = ASSIGNED_BINS.map(b => ({
    bin_id: b.id, area: b.name, lat: b.lat, lng: b.lng,
    predicted_fill: b.fill, urgency: b.urgency
  }));

  const displayedBins = ASSIGNED_BINS.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextBin = ASSIGNED_BINS[currentStop];

  const urgencyBg = {
    CRITICAL: 'border-red-500/40 bg-red-500/5',
    HIGH: 'border-amber-500/40 bg-amber-500/5',
    MEDIUM: 'border-indigo-500/30 bg-indigo-500/5',
    LOW: 'border-emerald-500/30 bg-emerald-500/5',
  };

  const urgencyDot = {
    CRITICAL: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]',
    HIGH: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    MEDIUM: 'bg-indigo-400',
    LOW: 'bg-emerald-500',
  };

  return (
    <div className="relative w-full h-full bg-[#050914] overflow-hidden">
      <div className="space-dust" />

      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <LiveMap predictions={mapPredictions} route={ROUTE_SEQUENCE} />
      </div>

      {/* Emergency Alert Popup */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm mx-auto"
          >
            <div className="glass-panel rounded-2xl border border-red-500/50 p-4 shadow-[0_0_40px_rgba(239,68,68,0.3)] bg-red-500/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-red-300 tracking-wide text-sm">⚡ EMERGENCY ALERT</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">BIN B04 · City Hall</p>
                  </div>
                </div>
                <button onClick={() => setShowEmergency(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-red-200 font-mono mb-3">
                Overflow predicted in <span className="text-red-400 font-bold">45 minutes</span>. Please divert to this bin immediately.
              </p>
              <button
                onClick={() => { setCurrentStop(0); setShowEmergency(false); addLog('Route updated. Diverting to B04.', 'info'); }}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-sm font-bold rounded-xl font-heading tracking-wide transition-colors"
              >
                Divert Route Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT SIDEBAR — ASSIGNED BINS ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        className="absolute top-4 left-6 bottom-44 w-72 z-40"
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-bold text-white flex items-center tracking-wide">
              <Database className="w-4 h-4 mr-2 text-cyan-400" />
              ASSIGNED BINS
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {collected.size}/{ASSIGNED_BINS.length} done
            </span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search bins..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
            />
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pb-2">
            {displayedBins.map((bin, i) => {
              const isDone = collected.has(bin.id);
              const isCurrent = ASSIGNED_BINS[currentStop]?.id === bin.id && collectionStarted && !isDone;
              return (
                <div
                  key={bin.id}
                  className={`p-3 rounded-xl border transition-all ${isDone
                    ? 'border-white/5 bg-white/3 opacity-50'
                    : isCurrent
                      ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : `${urgencyBg[bin.urgency]}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isDone ? 'bg-emerald-500' : urgencyDot[bin.urgency]}`} />
                      <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>{bin.name}</span>
                      {isCurrent && <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-full border border-cyan-400/30 uppercase">Current</span>}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{bin.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">{bin.area}</span>
                    <span className={`text-xs font-bold ${bin.fill >= 90 ? 'text-red-400' : bin.fill >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>{bin.fill}%</span>
                  </div>
                  {!isDone && collectionStarted && isCurrent && (
                    <button
                      onClick={() => handleCollect(bin.id)}
                      className="w-full mt-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded-lg font-heading tracking-wide transition-colors flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Mark Collected</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT FLOATING CARD — ROUTE DETAILS ── */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.1 }}
        className="absolute top-4 right-6 z-40 w-72"
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          {/* Truck Info */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Truck className="w-5 h-5" />
              <div>
                <h2 className="font-heading font-bold text-sm tracking-wide">TRUCK-MH20-55</h2>
                <p className="text-[10px] font-mono text-slate-500">Driver: Ravi Kumar</p>
              </div>
            </div>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          {/* Route Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Stops', value: ASSIGNED_BINS.length.toString() },
              { label: 'Done', value: collected.size.toString(), accent: true },
              { label: 'ETA', value: '1h 45m' },
            ].map(s => (
              <div key={s.label} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                <p className="text-[9px] font-mono text-slate-400 uppercase mb-0.5">{s.label}</p>
                <p className={`text-lg font-bold ${s.accent ? 'text-emerald-400' : 'text-white'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Next Bin */}
          {collectionStarted && nextBin && !collected.has(nextBin.id) && (
            <div className="mb-4 p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
              <p className="text-[10px] font-mono text-slate-400 uppercase flex items-center mb-2">
                <Navigation2 className="w-3 h-3 mr-1 text-cyan-400" /> Next Stop
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-mono font-bold text-cyan-400">{nextBin.id}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{nextBin.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{nextBin.fill}%</p>
                  <p className="text-[9px] text-slate-500">fill level</p>
                </div>
              </div>
              <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 120, ease: 'linear' }}
                  className="h-full bg-cyan-400 rounded-full"
                />
              </div>
              <p className="text-[9px] font-mono text-slate-500 text-center mt-1">Time to arrival</p>
            </div>
          )}

          {collected.size === ASSIGNED_BINS.length && (
            <div className="mb-4 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-center">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-emerald-300 font-heading tracking-wide">Route Complete!</p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">All {ASSIGNED_BINS.length} bins collected</p>
            </div>
          )}

          {/* Route Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Route Progress</span>
              <span>{Math.round((collected.size / ASSIGNED_BINS.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(collected.size / ASSIGNED_BINS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => { setCollectionStarted(c => !c); addLog(collectionStarted ? 'Collection stopped.' : 'Collection started. Truck en route.', collectionStarted ? 'warning' : 'success'); }}
              className={`w-full py-2.5 rounded-xl font-heading tracking-wide text-sm font-bold border transition-all flex items-center justify-center space-x-2 ${collectionStarted
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
              }`}
            >
              {collectionStarted ? <><X className="w-4 h-4" /><span>Stop Collection</span></> : <><Truck className="w-4 h-4" /><span>Start Collection</span></>}
            </button>

            <button
              onClick={() => { addLog('Emergency reported. Control center notified.', 'alert'); }}
              className="w-full py-2 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Emergency</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM TERMINAL ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.4 }}
        className="absolute bottom-4 z-50 pointer-events-none"
        style={{ left: 'calc(18rem + 2.5rem)', right: 'calc(18rem + 2.5rem)' }}
      >
        <div className="pointer-events-auto glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div
            onClick={() => setIsTerminalOpen(o => !o)}
            className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/5 cursor-pointer hover:bg-black/80 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Terminal className="text-cyan-400 w-4 h-4" />
              <span className="font-mono text-xs text-slate-300 tracking-wider">COLLECTOR_LOG</span>
              <Activity className="text-emerald-400 w-3 h-3 animate-pulse" />
            </div>
            {isTerminalOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
          </div>
          <AnimatePresence>
            {isTerminalOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 100 }}
                exit={{ height: 0 }}
                className="overflow-y-auto custom-scrollbar bg-[#02040A]/90 px-4 py-2 font-mono text-xs"
              >
                {logs.map(log => (
                  <div key={log.id} className="mb-1 flex space-x-3 items-start">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === 'alert' ? 'text-red-400' :
                      log.type === 'warning' ? 'text-amber-400' :
                      log.type === 'success' ? 'text-emerald-400' : 'text-cyan-400'
                    }>{log.msg}</span>
                  </div>
                ))}
                <div className="flex space-x-3 items-center opacity-50 mt-1">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString('en-IN', { hour12: false })}]</span>
                  <span className="w-2 h-3 bg-indigo-400 animate-pulse inline-block" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
