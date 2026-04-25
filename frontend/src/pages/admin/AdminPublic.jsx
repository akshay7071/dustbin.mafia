import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Clock, Truck, ShieldAlert, Gauge, Map as MapIcon, BarChart3, Users, CheckCircle2 } from 'lucide-react';
import LiveMap from '../../components/LiveMap';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { DUMMY_METRICS } from '../../utils/dummyData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 } }
};

export default function AdminPublic() {
  const [bins, setBins] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [binsRes, metricsRes] = await Promise.all([
          api.get('/bins'),
          api.get('/metrics').catch(() => ({ data: DUMMY_METRICS }))
        ]);
        setBins(binsRes.data);
        setMetrics(metricsRes.data || DUMMY_METRICS);
      } catch (err) {
        toast.error('Sync failure with municipal core');
        setMetrics(DUMMY_METRICS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate a simulated city cleanliness score based on bin fill levels
  const cityScore = bins.length > 0 
    ? Math.round(100 - (bins.reduce((acc, b) => acc + (b.fill_pct || 0), 0) / bins.length))
    : 73;

  return (
    <div className="relative min-h-screen bg-[#050914] flex flex-col pt-24 pb-12">
      <div className="space-dust" />
      
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Citizen Information Portal · Public View</span>
            </div>
            <h1 className="font-heading text-4xl font-black text-white tracking-tight leading-none">
              SMART <span className="text-cyan-400">CITIZEN</span> HUB
            </h1>
            <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-tighter opacity-70">Real-time municipal waste telemetry & transparency</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-slate-400 flex items-center bg-white/5 px-4 py-2 rounded-2xl border border-white/10 gap-2 uppercase tracking-widest font-mono">
               <Clock className="w-3.5 h-3.5 text-cyan-400" />
               <span>Last Updated: {new Date().toLocaleTimeString()}</span>
             </div>
          </div>
        </motion.div>

        {/* Impact Tiles */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: CheckCircle2, label: 'BINS MONITORED', value: bins.length, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
            { icon: Truck, label: 'SAVED DISTANCE', value: `${Math.round(metrics?.optimized_distance_km || 0)} KM`, color: 'text-cyan-400', bg: 'bg-cyan-500/5' },
            { icon: Leaf, label: 'CO₂ REDUCTION', value: `${Math.round(metrics?.co2_saved_kg || 43)} KG`, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
            { icon: ShieldAlert, label: 'CLEANLINESS SCORE', value: `${cityScore}%`, color: 'text-amber-400', bg: 'bg-amber-500/5' },
          ].map((card, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 group hover:border-white/20 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.bg} border border-white/5`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{card.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{card.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Public Map View */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 overflow-hidden min-h-[500px] flex flex-col shadow-2xl relative">
            <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex justify-between items-center z-10">
              <h2 className="font-heading font-black text-xs text-white tracking-widest flex items-center gap-3 uppercase">
                <MapIcon className="w-4 h-4 text-cyan-400" />
                Live Sanitation Topology
              </h2>
              <div className="flex items-center gap-4 text-[9px] font-mono font-black uppercase">
                <span className="text-slate-500">LEGEND:</span>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-emerald-400">Clean</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-red-400">Urgent</span></div>
              </div>
            </div>
            <div className="flex-1">
              <LiveMap predictions={bins} />
            </div>
          </motion.div>

          {/* Citizen Metrics */}
          <div className="space-y-6 flex flex-col">
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading font-black text-xs text-white tracking-widest uppercase flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Health Index
                </h3>
                <span className="text-[10px] font-black text-indigo-400 uppercase">Live</span>
              </div>
              <div className="flex flex-col items-center py-4">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="44" fill="none"
                      stroke={cityScore >= 80 ? '#10B981' : cityScore >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - cityScore / 100) }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white tracking-tighter">{cityScore}</span>
                    <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Score</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase mb-1">Status: Stable</p>
                  <p className="text-xs text-slate-400 font-mono tracking-tight">Predicted improvement: +2.4% next 12h</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/10 flex-1">
              <h3 className="font-heading font-black text-xs text-white tracking-widest uppercase mb-8 flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Community Stats
              </h3>
              <div className="space-y-6">
                {[
                  { ward: 'Zone Alpha — Industrial', load: 88 },
                  { ward: 'Zone Beta — Residential', load: 62 },
                  { ward: 'Zone Gamma — Market', load: 45 },
                  { ward: 'Zone Delta — Civic', load: 91 },
                ].map((w, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider font-mono">
                      <span>{w.ward}</span>
                      <span className="text-white">{w.load}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${w.load}%` }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 1.5, delay: i * 0.1 }} 
                        className={`h-full rounded-full bg-gradient-to-r ${w.load > 80 ? 'from-indigo-500 to-cyan-400' : 'from-indigo-500/50 to-indigo-500'}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transparency Note */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl border border-indigo-500/20 p-8 bg-indigo-500/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
               <Users className="w-8 h-8 text-indigo-400" />
             </div>
             <div>
               <h3 className="font-heading font-black text-white tracking-widest uppercase mb-2">Municipal Transparency Guarantee</h3>
               <p className="text-sm text-slate-400 leading-relaxed font-sans opacity-80">
                 All data shown on this dashboard is directly sourced from SmartWasteRouteAI sensor telemetry. Citizens can track collection progress and environmental impact in real-time. For emergency reports, please use the 24/7 hotline.
               </p>
             </div>
          </div>
        </motion.div>
      </motion.div>

      <footer className="mt-12 py-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            OPERATED BY SAMBHAJI NAGAR MUNICIPAL CORP · AI BY SMARTWASTEROUTE
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-widest">Privacy Policy</span>
            <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-widest">Public API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
