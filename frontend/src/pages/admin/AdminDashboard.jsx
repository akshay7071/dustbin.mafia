import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBins, fetchPredictions } from '../../store/binsSlice';
import { optimizeRoute, dispatchRoute } from '../../store/routeSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../../socket';
import { updateBinStatus, setPredictionFromSocket } from '../../store/binsSlice';
import { setRouteFromSocket } from '../../store/routeSlice';
import LiveMap from '../../components/LiveMap';
import CommandPalette from '../../components/CommandPalette';
import {
  BrainCircuit, Route, AlertTriangle, Layers, Send, Download,
  Truck, Zap, Leaf, Clock, AlertCircle, Database, Search,
  Filter, Server, Radio, Activity, Terminal, ChevronDown,
  ChevronUp, X, Plus, ShieldAlert, RefreshCw, IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Mock Data ─── */
const MOCK_BINS = [
  { id: 'B04', name: 'City Hall', area: 'Aurangabad City', fill: 95, status: 'critical', lat: 19.876, lng: 75.342 },
  { id: 'B12', name: 'Downtown Plaza', area: 'Station Road', fill: 92, status: 'critical', lat: 19.8756, lng: 75.347 },
  { id: 'B08', name: 'Central Station', area: 'Nirala Bazaar', fill: 85, status: 'high', lat: 19.879, lng: 75.351 },
  { id: 'B19', name: 'Market Square', area: 'Mondha Market', fill: 78, status: 'high', lat: 19.872, lng: 75.338 },
  { id: 'B45', name: 'Tech Park North', area: 'Cidco N-1', fill: 45, status: 'medium', lat: 19.868, lng: 75.345 },
  { id: 'B22', name: 'Riverside Walk', area: 'Waluj MIDC', fill: 22, status: 'low', lat: 19.864, lng: 75.332 },
  { id: 'B33', name: 'University Campus', area: 'Paithan Road', fill: 18, status: 'low', lat: 19.880, lng: 75.360 },
];

const QUICK_ACTIONS = [
  { icon: BrainCircuit, label: 'Predict Fill Levels', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20', key: 'predict' },
  { icon: Route, label: 'Generate Route', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20', key: 'route' },
  { icon: Layers, label: 'Toggle Heatmap', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20', key: 'heatmap' },
  { icon: Send, label: 'Send SMS Alert', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20', key: 'sms' },
  { icon: ShieldAlert, label: 'Emergency Mode', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20', key: 'emergency' },
  { icon: Download, label: 'Export Report', color: 'text-slate-300', bg: 'bg-white/5 border-white/10 hover:bg-white/10', key: 'export' },
];

const INIT_LOGS = [
  { id: 1, time: '14:23:01', msg: 'System initialized. Fleet tracker online.', type: 'info' },
  { id: 2, time: '14:23:05', msg: 'AI model loaded: RandomForest v2.1', type: 'info' },
  { id: 3, time: '14:24:12', msg: 'CRITICAL: Bin B04 at 95% capacity. ETA overflow: 45 min.', type: 'alert' },
  { id: 4, time: '14:25:18', msg: 'Route recalculated. Distance reduced by 38%.', type: 'success' },
  { id: 5, time: '14:26:45', msg: 'SMS alert dispatched to Driver A (+91-98765-43210).', type: 'success' },
  { id: 6, time: '14:28:03', msg: 'WARNING: IoT Sensor S-19 reporting intermittent signal.', type: 'warning' },
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { predictions } = useSelector(state => state.bins);
  const { route } = useSelector(state => state.route);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBin, setActiveBin] = useState('B04');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [logs, setLogs] = useState(INIT_LOGS);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState({ predict: false, route: false, sms: false });

  useEffect(() => {
    dispatch(fetchAllBins());
    dispatch(fetchPredictions());
    socket.on('bin_status_change', (data) => dispatch(updateBinStatus(data)));
    socket.on('prediction_ready', (data) => dispatch(setPredictionFromSocket(data)));
    socket.on('route_ready', (data) => dispatch(setRouteFromSocket(data)));
    return () => {
      socket.off('bin_status_change');
      socket.off('prediction_ready');
      socket.off('route_ready');
    };
  }, [dispatch]);

  const addLog = (msg, type = 'info') => {
    const now = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLogs(prev => [...prev, { id: Date.now(), time: now, msg, type }]);
  };

  const handleAction = async (key) => {
    switch (key) {
      case 'predict':
        setIsLoading(p => ({ ...p, predict: true }));
        addLog('Running AI fill level prediction...', 'info');
        await new Promise(r => setTimeout(r, 1500));
        dispatch(fetchPredictions());
        addLog('Prediction complete. 12 bins flagged for collection.', 'success');
        toast.success('AI Prediction complete!');
        setIsLoading(p => ({ ...p, predict: false }));
        break;
      case 'route':
        setIsLoading(p => ({ ...p, route: true }));
        addLog('Optimizing route using Nearest Neighbor + 2-opt...', 'info');
        await new Promise(r => setTimeout(r, 2000));
        dispatch(optimizeRoute({ depot_lat: 19.8744, depot_lng: 75.3445, urgency_filter: 'HIGH' }));
        addLog('Route generated. 23 stops. Distance: 18.4 km (saved 58%).', 'success');
        toast.success('Route optimized!');
        setIsLoading(p => ({ ...p, route: false }));
        break;
      case 'heatmap':
        setShowHeatmap(h => !h);
        addLog(`Heatmap overlay ${!showHeatmap ? 'enabled' : 'disabled'}.`, 'info');
        break;
      case 'sms':
        setIsLoading(p => ({ ...p, sms: true }));
        addLog('Dispatching SMS alert to all registered drivers...', 'info');
        await new Promise(r => setTimeout(r, 1000));
        addLog('SMS alert sent to 3 drivers via Twilio.', 'success');
        toast.success('SMS alerts sent!');
        setIsLoading(p => ({ ...p, sms: false }));
        break;
      case 'emergency':
        setIsEmergency(e => !e);
        const msg = !isEmergency ? '🚨 EMERGENCY MODE ACTIVATED. All vehicles redirected.' : 'Emergency mode deactivated. Normal operations resumed.';
        addLog(msg, !isEmergency ? 'alert' : 'info');
        toast(msg, { icon: !isEmergency ? '🚨' : '✅' });
        break;
      case 'export':
        addLog('Generating PDF/CSV report...', 'info');
        setTimeout(() => addLog('Report exported: waste_report_2026-04-25.pdf', 'success'), 800);
        toast.success('Report exported!');
        break;
    }
  };

  const displayBins = MOCK_BINS.filter(b => {
    const matchesFilter = activeFilter === 'all' || b.status === activeFilter;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusColors = {
    critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]',
    high: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    medium: 'bg-indigo-400',
    low: 'bg-emerald-500',
  };

  // Use predictions from Redux or fall back to mock
  const mapPredictions = predictions.length > 0 ? predictions : MOCK_BINS.map(b => ({
    bin_id: b.id, area: b.name, lat: b.lat, lng: b.lng,
    predicted_fill: b.fill,
    urgency: b.status === 'critical' ? 'CRITICAL' : b.status === 'high' ? 'HIGH' : b.status === 'medium' ? 'MEDIUM' : 'LOW'
  }));

  return (
    <div className={`relative w-full h-full bg-[#050914] overflow-hidden transition-all duration-500 ${isEmergency ? 'outline outline-2 outline-red-500/50' : ''}`}>
      <div className="space-dust" />

      {/* Emergency Banner */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            className="absolute top-0 left-0 right-0 z-[200] bg-red-500/20 border-b border-red-500/50 backdrop-blur-md text-red-300 text-center py-2 font-mono text-xs tracking-widest uppercase flex items-center justify-center space-x-3"
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>⚡ EMERGENCY MODE ACTIVE — All vehicles rerouted to critical bins</span>
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Map */}
      <div className="absolute inset-0 z-0">
        <LiveMap predictions={mapPredictions} route={route} showHeatmap={showHeatmap} />
      </div>

      {/* ── TOP COMMAND BAR ── */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        className={`absolute left-[calc(20rem+2rem)] right-[calc(18rem+2rem)] z-50 ${isEmergency ? 'top-16' : 'top-4'}`}
      >
        <div className="glass-panel px-3 py-2 rounded-2xl flex items-center justify-center flex-wrap gap-2 border border-white/10">
          {QUICK_ACTIONS.map((action) => (
            <motion.button
              key={action.key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction(action.key)}
              disabled={isLoading[action.key]}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${action.bg} ${action.key === 'emergency' && isEmergency ? 'ring-1 ring-red-400' : ''}`}
            >
              {isLoading[action.key]
                ? <RefreshCw className={`w-4 h-4 ${action.color} animate-spin`} />
                : <action.icon className={`w-4 h-4 ${action.color}`} />
              }
              <span className="text-slate-200 hidden lg:inline">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── LEFT SIDEBAR — BIN EXPLORER ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        className={`absolute left-6 bottom-6 w-80 z-40 flex flex-col ${isEmergency ? 'top-16' : 'top-4'}`}
        style={{ paddingTop: '4rem' }}
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-base font-bold text-white flex items-center tracking-wide">
              <Database className="w-4 h-4 mr-2 text-cyan-400" />BIN EXPLORER
            </h2>
            <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-500">
              {['all', 'critical', 'high', 'low'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-2 py-0.5 rounded-md uppercase transition-colors ${activeFilter === f ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'hover:text-slate-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search bin ID or sector..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
            />
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pb-2">
            {displayBins.map(bin => (
              <motion.div
                key={bin.id}
                onClick={() => setActiveBin(bin.id)}
                whileHover={{ x: 4 }}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${activeBin === bin.id
                  ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                  : 'bg-black/20 border-transparent hover:bg-black/40 hover:border-white/5'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${statusColors[bin.status]}`} />
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight">{bin.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{bin.id} · {bin.area}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-bold ${bin.fill >= 90 ? 'text-red-400' : bin.fill >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>{bin.fill}%</span>
                    <div className="w-12 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bin.fill >= 90 ? 'bg-red-500' : bin.fill >= 70 ? 'bg-amber-500' : bin.fill >= 40 ? 'bg-indigo-400' : 'bg-emerald-500'}`}
                        style={{ width: `${bin.fill}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Health */}
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 flex items-center"><Activity className="w-3 h-3 mr-1 text-cyan-400" />SYSTEM HEALTH</p>
            {[
              { label: 'API Server', status: 'Operational', ok: true },
              { label: 'Database', status: '98ms', ok: true },
              { label: 'IoT Sensors', status: '2 Offline', ok: false },
            ].map(h => (
              <div key={h.label} className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">{h.label}</span>
                <div className="flex items-center space-x-1.5">
                  <span className={h.ok ? 'text-emerald-400' : 'text-amber-400'}>{h.status}</span>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${h.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL — KPI STATS ── */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.1 }}
        className={`absolute right-6 bottom-6 w-72 z-40 flex flex-col ${isEmergency ? 'top-16' : 'top-4'}`}
        style={{ paddingTop: '4rem' }}
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col h-full">
          <h2 className="font-heading text-base font-bold text-white mb-4 flex items-center tracking-wide">
            <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse" />KPI METRICS
          </h2>

          <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar pr-1">
            {[
              { label: 'Distance Saved', value: '124', unit: 'km', icon: Route, color: 'text-indigo-400', border: 'border-indigo-500/20' },
              { label: 'Fuel Saved', value: '45.2', unit: 'L', icon: Zap, color: 'text-cyan-400', border: 'border-cyan-500/20' },
              { label: 'CO₂ Reduced', value: '112', unit: 'kg', icon: Leaf, color: 'text-emerald-400', border: 'border-emerald-500/20' },
              { label: 'Time Saved', value: '85', unit: 'min', icon: Clock, color: 'text-blue-400', border: 'border-blue-500/20' },
              { label: 'Cost Saved', value: '₹4,269', unit: '', icon: IndianRupee, color: 'text-amber-400', border: 'border-amber-500/20' },
              { label: 'Critical Bins', value: '3', unit: '', icon: AlertCircle, color: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ x: -3 }}
                className={`p-3 rounded-xl bg-black/40 border ${s.border} ${s.glow || ''} flex items-center justify-between`}
              >
                <div className="flex items-center space-x-3">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{s.label}</span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold text-white">{s.value}</span>
                  {s.unit && <span className="text-xs text-slate-500">{s.unit}</span>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fleet Status */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-3 flex items-center">
              <Truck className="w-3 h-3 mr-1 text-cyan-400" />FLEET STATUS
            </p>
            {[
              { id: 'MH-20-AA-55', driver: 'Ravi K.', status: 'En Route', bins: 8, color: 'text-emerald-400' },
              { id: 'MH-20-BB-12', driver: 'Suresh M.', status: 'Loading', bins: 0, color: 'text-amber-400' },
              { id: 'MH-20-CC-87', driver: 'Ajit P.', status: 'Standby', bins: 0, color: 'text-slate-400' },
            ].map(truck => (
              <div key={truck.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-[10px] font-mono text-slate-300">{truck.id}</div>
                  <div className="text-[9px] text-slate-500">{truck.driver}</div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-mono font-bold ${truck.color}`}>{truck.status}</div>
                  {truck.bins > 0 && <div className="text-[9px] text-slate-500">{truck.bins} bins left</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM TERMINAL ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.3 }}
        className="absolute bottom-4 z-50 pointer-events-none"
        style={{ left: 'calc(20rem + 2rem)', right: 'calc(18rem + 2rem)' }}
      >
        <div className="pointer-events-auto glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div
            onClick={() => setIsTerminalOpen(o => !o)}
            className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/5 cursor-pointer hover:bg-black/80 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Terminal className="text-cyan-400 w-4 h-4" />
              <span className="font-mono text-xs text-slate-300 tracking-wider">SMARTWASTE.SYSTEM_TERMINAL</span>
              <Activity className="text-emerald-400 w-3 h-3 animate-pulse" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-[10px] text-slate-500 uppercase">⌘K to open palette</span>
              {isTerminalOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
            </div>
          </div>
          <AnimatePresence>
            {isTerminalOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 140 }}
                exit={{ height: 0 }}
                className="overflow-y-auto custom-scrollbar bg-[#02040A]/90 px-4 py-3 font-mono text-xs"
              >
                {logs.map(log => (
                  <div key={log.id} className="mb-1.5 flex space-x-3 items-start hover:bg-white/3 px-1 py-0.5 rounded transition-colors">
                    <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                    <span className={
                      log.type === 'alert' ? 'text-red-400' :
                      log.type === 'warning' ? 'text-amber-400' :
                      log.type === 'success' ? 'text-emerald-400' : 'text-cyan-400'
                    }>{log.msg}</span>
                  </div>
                ))}
                <div className="flex space-x-3 items-center opacity-50 mt-1 px-1">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString('en-IN', { hour12: false })}]</span>
                  <span className="w-2 h-3.5 bg-indigo-400 animate-pulse inline-block" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <CommandPalette />
    </div>
  );
}
