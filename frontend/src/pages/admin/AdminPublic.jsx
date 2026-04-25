import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Leaf, Clock, Truck, ShieldAlert, Gauge, Map, BarChart3, Users, CheckCircle2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 } }
};

const ZONE_DATA = [
  { lat: 19.876, lng: 75.342, score: 95, name: 'City Hall' },
  { lat: 19.8756, lng: 75.347, score: 82, name: 'Station Road' },
  { lat: 19.879, lng: 75.351, score: 60, name: 'Nirala Bazaar' },
  { lat: 19.872, lng: 75.338, score: 45, name: 'Mondha Market' },
  { lat: 19.868, lng: 75.345, score: 88, name: 'Cidco N-1' },
];

export default function AdminPublic() {
  const [cleanlinessScore] = useState(73);

  return (
    <div className="relative min-h-screen bg-[#050914] flex flex-col pt-20 pb-12">
      <div className="space-dust" />
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-mono text-indigo-300 uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" /><span>Admin Preview — Public View</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-white tracking-wide">SAMBHAJI NAGAR <span className="text-cyan-400">INTELLIGENCE</span></h1>
            <p className="text-slate-400 mt-1 font-mono text-sm">Citizen-facing transparency dashboard</p>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10 space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" /><span>Live Feed</span>
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle2, label: 'BINS COLLECTED TODAY', value: '187', color: 'text-emerald-400', border: 'border-emerald-500/30' },
            { icon: Truck, label: 'ROUTES COMPLETED', value: '3', color: 'text-cyan-400', border: 'border-cyan-500/30' },
            { icon: Leaf, label: 'CO₂ AVOIDED THIS WEEK', value: '43 kg', color: 'text-indigo-400', border: 'border-indigo-500/30' },
            { icon: ShieldAlert, label: 'OVERFLOW INCIDENTS', value: '2', color: 'text-red-400', border: 'border-red-500/30' },
          ].map((card, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className={`glass-panel p-5 rounded-2xl border ${card.border} relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${card.border} bg-white/5`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col" style={{ minHeight: '440px' }}>
            <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
              <h2 className="font-heading font-bold text-white tracking-wide flex items-center space-x-2"><Map className="w-5 h-5 text-cyan-400" /><span>LIVE CLEANLINESS MAP</span></h2>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-400">Clean</span>
                <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full" />
                <span className="text-slate-400">Dirty</span>
              </div>
            </div>
            <div className="flex-1" style={{ minHeight: '360px' }}>
              <MapContainer center={[19.8744, 75.3445]} zoom={13} style={{ height: '100%', width: '100%', minHeight: '360px', backgroundColor: '#050914' }} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
                {ZONE_DATA.map((zone, i) => {
                  const color = zone.score >= 80 ? '#10B981' : zone.score >= 60 ? '#F59E0B' : '#EF4444';
                  return (
                    <CircleMarker key={i} center={[zone.lat, zone.lng]} radius={14} pathOptions={{ color, fillColor: color, fillOpacity: 0.5, weight: 1 }}>
                      <Popup><div className="text-sm font-semibold">{zone.name}</div><div className="text-xs text-gray-500">Score: {zone.score}/100</div></Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-4 flex flex-col">
            {/* Gauge */}
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl border border-white/10">
              <h3 className="font-heading font-bold text-white tracking-wide mb-4 flex items-center space-x-2"><Gauge className="w-5 h-5 text-cyan-400" /><span>CITY SCORE</span></h3>
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="38" fill="none"
                      stroke={cleanlinessScore >= 80 ? '#10B981' : cleanlinessScore >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 38}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - cleanlinessScore / 100) }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{cleanlinessScore}</span>
                    <span className="text-[10px] font-mono text-slate-400">/100</span>
                  </div>
                </div>
                <p className="text-sm font-mono text-amber-400 font-bold mt-2 tracking-wide">FAIR CONDITIONS</p>
              </div>
            </motion.div>

            {/* Collection Progress */}
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl border border-white/10 flex-1">
              <h3 className="font-heading font-bold text-white tracking-wide mb-4 flex items-center space-x-2"><BarChart3 className="w-4 h-4 text-indigo-400" /><span>WARD PROGRESS</span></h3>
              <div className="space-y-3">
                {[
                  { ward: 'Ward A — Station Rd', done: 12, total: 14 },
                  { ward: 'Ward B — Nirala Bazar', done: 8, total: 18 },
                  { ward: 'Ward C — Mondha', done: 4, total: 16 },
                  { ward: 'Ward D — Cidco N-1', done: 11, total: 12 },
                  { ward: 'Ward E — Waluj', done: 9, total: 10 },
                ].map((w, i) => {
                  const pct = Math.round((w.done / w.total) * 100);
                  const color = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-300">{w.ward}</span>
                        <span className="text-slate-400">{pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }} className={`h-full rounded-full ${color}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Complaint Heatmap */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-white tracking-wide flex items-center space-x-2"><Users className="w-5 h-5 text-amber-400" /><span>CITIZEN COMPLAINT ZONES</span></h3>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Last 30 days</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Nirala Bazaar', complaints: 34, heat: 95 },
              { name: 'Mondha Market', complaints: 28, heat: 78 },
              { name: 'Kranti Chowk', complaints: 19, heat: 52 },
              { name: 'Cidco N-1', complaints: 12, heat: 33 },
              { name: 'Station Road', complaints: 8, heat: 22 },
            ].map((zone, i) => {
              const heatColor = zone.heat > 70 ? '#EF4444' : zone.heat > 40 ? '#F59E0B' : '#6366F1';
              const textColor = zone.heat > 70 ? 'text-red-400' : zone.heat > 40 ? 'text-amber-400' : 'text-indigo-400';
              const barColor = zone.heat > 70 ? 'bg-red-500' : zone.heat > 40 ? 'bg-amber-500' : 'bg-indigo-500';
              return (
                <motion.div key={i} whileHover={{ y: -4 }} className="relative overflow-hidden rounded-xl p-4 border border-white/10 bg-black/40 group">
                  <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${heatColor} 0%, transparent 70%)` }} />
                  <div className="relative z-10">
                    <p className="text-xs font-semibold text-white mb-2">{zone.name}</p>
                    <p className={`text-2xl font-bold ${textColor}`}>{zone.complaints}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">complaints</p>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${zone.heat}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }} className={`h-full rounded-full ${barColor}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <footer className="py-4 text-center text-slate-600 text-[10px] font-mono border-t border-white/5 bg-black/40 relative z-10 tracking-widest uppercase">
        DATA PROVIDED BY SMARTWASTEROUTEAI · UPDATES EVERY 60 SECONDS
      </footer>
    </div>
  );
}
