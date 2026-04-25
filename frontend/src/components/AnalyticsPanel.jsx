import React from 'react';
import { motion } from 'framer-motion';
import { Route, Zap, Leaf, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
import FleetPanel from './FleetPanel';

export default function AnalyticsPanel() {
  const stats = [
    { label: 'Distance Saved', value: '124', unit: 'km', icon: <Route size={18} />, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Fuel Saved', value: '45.2', unit: 'L', icon: <Zap size={18} />, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'CO₂ Reduced', value: '112', unit: 'kg', icon: <Leaf size={18} />, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Time Saved', value: '85', unit: 'min', icon: <Clock size={18} />, color: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Critical Bins', value: '12', unit: '', icon: <AlertCircle size={18} />, color: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' },
    { label: 'Missed Pickups', value: '0', unit: '', icon: <AlertTriangle size={18} />, color: 'text-slate-400', border: 'border-slate-500/30' },
  ];

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.1 }}
      className="absolute top-24 right-6 bottom-24 w-72 z-40 pointer-events-none flex flex-col"
    >
      <div className="glass-panel p-5 rounded-2xl border border-white/10 pointer-events-auto h-full flex flex-col">
        <h2 className="font-heading text-lg font-semibold text-white mb-6 flex items-center tracking-wide">
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          SYSTEM METRICS
        </h2>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar pr-2 flex-grow pb-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: -4, scale: 1.02 }}
              className={`p-4 rounded-xl bg-black/40 border ${stat.border} ${stat.glow || ''} transition-all relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-2 relative z-10">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div className="flex items-baseline space-x-1 relative z-10">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm font-medium text-slate-500">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <FleetPanel />
      </div>
    </motion.div>
  );
}
