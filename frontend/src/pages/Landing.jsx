import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Route, Send, Leaf, ArrowRight, Trash2, Shield, Truck, Globe, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.7 } }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050914] text-white overflow-y-auto relative">
      <div className="space-dust" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050914]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <Trash2 className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-wider">
              SMART<span className="text-cyan-400">WASTE</span><span className="text-indigo-400">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
            <Link to="/login" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Get Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 text-center"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-mono text-indigo-300 uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span>Hackathon Ready · Hack-The-Gap 2.0</span>
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Zero Overflow.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
            AI-Driven Routes.
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-slate-400 text-lg md:text-xl mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          SmartWasteRouteAI predicts bin fill levels with ML and generates optimal collection routes
          for Chhatrapati Sambhajinagar's 278 bins across 34 zones — saving fuel, CO₂, and money.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/admin/dashboard"
            className="group flex items-center space-x-2 px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"
          >
            <Shield className="w-5 h-5" />
            <span>Admin Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/collector/dashboard"
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-bold transition-all"
          >
            <Truck className="w-5 h-5" />
            <span>Collector View</span>
          </Link>
          <Link
            to="/admin/public"
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
          >
            <Globe className="w-5 h-5" />
            <span>Public Stats</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto px-6 mb-20"
      >
        <div className="glass-panel rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {[
            { value: '56%', label: 'Fewer km driven', color: 'text-indigo-400' },
            { value: '₹258', label: 'Saved per collection run', color: 'text-cyan-400' },
            { value: '6.3 kg', label: 'CO₂ avoided per run', color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="p-8 text-center">
              <div className={`text-4xl font-extrabold font-heading ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">How It <span className="text-cyan-400">Works</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Three intelligent layers replace fixed schedules with real-time demand-driven operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BrainCircuit, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/5',
              title: 'AI Fill Prediction',
              desc: 'Random Forest ML model analyzes zone type, historical patterns, and temporal data to predict overflow 2 hours in advance.'
            },
            {
              icon: Route, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5',
              title: 'Route Optimizer',
              desc: 'Nearest Neighbor + 2-opt algorithms generate the shortest path visiting only critical & high-fill bins — 56% distance reduction.'
            },
            {
              icon: Send, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5',
              title: 'Live Dispatch',
              desc: 'Drivers receive SMS links to the collector app. Admins watch bins transition green in real-time via Socket.io live updates.'
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`glass-panel p-8 rounded-2xl border ${f.border} ${f.bg} relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${f.border} ${f.bg}`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="glass-panel rounded-3xl border border-indigo-500/30 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to optimize your city?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Login as admin to dispatch routes, or as a collector to start your shift.</p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              <span>Login Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"><Trash2 className="w-4 h-4 text-cyan-400" /></div>
          <span className="font-heading font-bold text-lg text-white">SmartWasteRouteAI</span>
        </div>
        <p className="text-slate-500 font-mono text-xs tracking-wider">HACK-THE-GAP 2.0 · MGM UNIVERSITY IEEE × CSN MUNICIPAL CORPORATION</p>
      </footer>
    </div>
  );
}
