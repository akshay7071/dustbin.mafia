import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter } from 'lucide-react';

export default function Sidebar() {
  const [activeBin, setActiveBin] = useState('B12');
  
  const bins = [
    { id: 'B12', name: 'Downtown Plaza', fill: 92, status: 'critical' },
    { id: 'B08', name: 'Central Station', fill: 85, status: 'high' },
    { id: 'B45', name: 'Tech Park North', fill: 45, status: 'medium' },
    { id: 'B22', name: 'Riverside Walk', fill: 12, status: 'low' },
    { id: 'B19', name: 'Market Square', fill: 78, status: 'high' },
    { id: 'B33', name: 'University Campus', fill: 25, status: 'low' },
    { id: 'B04', name: 'City Hall', fill: 95, status: 'critical' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
      case 'high': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
      className="absolute top-24 left-6 bottom-24 w-80 z-40 pointer-events-none flex flex-col"
    >
      <div className="glass-panel p-5 rounded-2xl border border-white/10 pointer-events-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-semibold text-white flex items-center tracking-wide">
            <Database className="w-5 h-5 mr-2 text-cyan-400" />
            BIN EXPLORER
          </h2>
          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
            <Filter size={16} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search sector or bin ID..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
          />
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2 pb-4">
          {bins.map((bin) => {
            const isActive = activeBin === bin.id;
            return (
              <motion.div
                key={bin.id}
                onClick={() => setActiveBin(bin.id)}
                whileHover={{ x: 4 }}
                className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between group
                  ${isActive 
                    ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                    : 'bg-black/20 border-transparent hover:bg-black/40 hover:border-white/5'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(bin.status)}`} />
                  <div>
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {bin.name}
                    </div>
                    <div className="text-xs font-mono text-slate-500">{bin.id}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold ${bin.status === 'critical' ? 'text-red-400' : bin.status === 'high' ? 'text-amber-400' : 'text-slate-400'}`}>
                    {bin.fill}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
