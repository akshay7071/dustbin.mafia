import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock, MapPin } from 'lucide-react';

export default function CollectorPublic() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.8 } }
  };

  return (
    <div className="relative min-h-screen bg-[#050914] pt-24 pb-12 px-6">
      <div className="space-dust"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="text-center mb-12">
          <h1 className="font-heading font-extrabold text-3xl text-white tracking-wider">
            CITIZEN PUBLIC VIEW
          </h1>
          <p className="text-cyan-400 font-mono text-sm mt-2 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
            LIVE CITY CLEANLINESS STATUS
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Cleanliness Gauge */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" className="glass-panel p-8 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-2xl"></div>
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide relative z-10">CITY CLEANLINESS SCORE</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-180">
                <circle cx="96" cy="96" r="80" className="stroke-white/10" strokeWidth="16" fill="none" strokeDasharray="502" strokeDashoffset="251" />
                <motion.circle 
                  cx="96" cy="96" r="80" 
                  className="stroke-emerald-400" 
                  strokeWidth="16" fill="none" 
                  strokeDasharray="502" 
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 502 - (251 * 0.85) }} // 85%
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <span className="text-5xl font-bold font-mono text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">85</span>
                <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider mt-1">Excellent</span>
              </div>
            </div>
          </motion.div>

          {/* Collection Status */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide border-b border-white/10 pb-4">TODAY'S COLLECTION</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span className="text-emerald-400 flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Bins Cleaned</span>
                  <span className="text-white font-bold">1,240</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1 }} className="h-full bg-emerald-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span className="text-amber-400 flex items-center"><Clock className="w-4 h-4 mr-2" /> Pending Bins</span>
                  <span className="text-white font-bold">260</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} transition={{ duration: 1 }} className="h-full bg-amber-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Complaints Section */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide flex items-center border-b border-white/10 pb-4">
            <AlertTriangle className="w-5 h-5 text-indigo-400 mr-2" />
            PUBLIC COMPLAINTS TRACKER
          </h3>
          
          <div className="space-y-4">
            <ComplaintRow id="#CMP-8991" location="Station Road, near ATM" time="2h ago" status="Resolved" />
            <ComplaintRow id="#CMP-8992" location="Kranti Chowk main circle" time="1h ago" status="In Progress" />
            <ComplaintRow id="#CMP-8993" location="Nirala Bazaar lane 2" time="15m ago" status="Pending" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ComplaintRow({ id, location, time, status }) {
  const getStatusColor = () => {
    if (status === 'Resolved') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (status === 'In Progress') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-white font-bold font-mono text-sm">{id}</p>
          <p className="text-slate-400 text-sm mt-0.5">{location}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider font-mono border ${getStatusColor()}`}>
          {status}
        </span>
        <span className="text-xs text-slate-500 font-mono mt-2">{time}</span>
      </div>
    </div>
  );
}
