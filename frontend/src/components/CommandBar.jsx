import React from 'react';
import { motion } from 'framer-motion';
import { Route, Navigation2, AlertTriangle, Layers, Download, BarChart2 } from 'lucide-react';

export default function CommandBar() {
  const actions = [
    { icon: <BarChart2 size={16} />, label: 'Predict Fill Levels', color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    { icon: <Route size={16} />, label: 'Generate Route', color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    { icon: <AlertTriangle size={16} />, label: 'Emergency Mode', color: 'text-red-400', glow: 'shadow-red-500/20', isAlert: true },
    { icon: <Layers size={16} />, label: 'Show Heatmap', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    { icon: <Download size={16} />, label: 'Weekly Report', color: 'text-slate-300', glow: 'shadow-white/10' }
  ];

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
      className="absolute top-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-panel px-3 py-2 rounded-2xl flex items-center space-x-2">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors
              ${action.isAlert ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20' : 'bg-white/5 hover:bg-white/10 border border-white/5'}
            `}
          >
            <span className={action.color}>{action.icon}</span>
            <span className="text-sm font-medium tracking-wide">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
