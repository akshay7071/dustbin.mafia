import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Radio, Server } from 'lucide-react';

export default function SystemHealthWidget() {
  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.2 }}
      className="absolute bottom-6 left-6 z-40 glass-panel rounded-2xl border border-white/10 p-4 w-64"
    >
      <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="font-heading text-sm font-bold text-white tracking-wide">SYSTEM HEALTH</h3>
      </div>
      
      <div className="space-y-3">
        <HealthRow icon={<Server className="w-3.5 h-3.5" />} label="API Status" status="Operational" color="text-emerald-400" bg="bg-emerald-400" />
        <HealthRow icon={<Database className="w-3.5 h-3.5" />} label="Database" status="98ms ping" color="text-emerald-400" bg="bg-emerald-400" />
        <HealthRow icon={<Radio className="w-3.5 h-3.5" />} label="IoT Sensors" status="2 Offline" color="text-amber-400" bg="bg-amber-400" />
      </div>
    </motion.div>
  );
}

function HealthRow({ icon, label, status, color, bg }) {
  return (
    <div className="flex items-center justify-between text-xs font-mono">
      <div className="flex items-center space-x-2 text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`flex items-center space-x-1.5 ${color}`}>
        <span>{status}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${bg} animate-pulse`}></div>
      </div>
    </div>
  );
}
