import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, Clock, Leaf, Route, CheckCircle } from 'lucide-react';
import SavingsChart from '../../components/SavingsChart';

export default function CollectorAnalytics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.8 } }
  };

  return (
    <div className="relative min-h-screen bg-[#050914] pt-24 pb-12 px-6">
      <div className="space-dust"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="font-heading font-extrabold text-3xl text-white tracking-wider flex items-center">
            <span className="w-3 h-3 rounded-full bg-cyan-400 mr-3 animate-pulse"></span>
            DRIVER PERFORMANCE METRICS
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-2">TRUCK-MH20-55 • WEEK OF APR 18-24</p>
        </motion.div>

        {/* Top KPI Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <KPICard title="DISTANCE" value="124 km" icon={<Route />} color="text-indigo-400" />
          <KPICard title="FUEL USED" value="45 L" icon={<Fuel />} color="text-slate-300" />
          <KPICard title="FUEL SAVED" value="12 L" icon={<Fuel />} color="text-emerald-400" />
          <KPICard title="TIME SAVED" value="2.5h" icon={<Clock />} color="text-cyan-400" />
          <KPICard title="CO₂ REDUCED" value="32 kg" icon={<Leaf />} color="text-emerald-500" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide flex items-center">
              WEEKLY EFFICIENCY
            </h3>
            <div className="h-80">
              <SavingsChart />
            </div>
          </motion.div>

          {/* Progress & Route History */}
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide">TODAY'S PROGRESS</h3>
            
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-white/10" strokeWidth="12" fill="none" />
                  <motion.circle 
                    cx="80" cy="80" r="70" 
                    className="stroke-cyan-400" 
                    strokeWidth="12" fill="none" 
                    strokeDasharray="440" 
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * 0.75) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-white">75%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed</span>
                </div>
              </div>
            </div>

            <div className="flex-1 mt-4">
              <h4 className="font-heading text-sm text-slate-300 mb-4 border-b border-white/10 pb-2">ROUTE HISTORY</h4>
              <div className="space-y-4">
                <HistoryRow time="10:30 AM" text="Finished Sector A Collection" status="done" />
                <HistoryRow time="11:45 AM" text="Finished Sector B Collection" status="done" />
                <HistoryRow time="13:10 PM" text="Emergency Pick: Station Rd" status="done" />
                <HistoryRow time="14:00 PM" text="Started Sector C Collection" status="active" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color }) {
  return (
    <motion.div 
      className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>{React.cloneElement(icon, { size: 18 })}</div>
      </div>
      <h3 className="text-3xl font-mono font-bold text-white mb-1">{value}</h3>
      <p className="text-[10px] font-heading tracking-wider text-slate-400 uppercase">{title}</p>
    </motion.div>
  );
}

function HistoryRow({ time, text, status }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-0.5">
        {status === 'done' 
          ? <CheckCircle className="w-4 h-4 text-emerald-400" />
          : <div className="w-4 h-4 rounded-full border-2 border-cyan-400 animate-pulse"></div>
        }
      </div>
      <div>
        <p className={`text-sm ${status === 'done' ? 'text-slate-300' : 'text-cyan-400 font-bold'}`}>{text}</p>
        <p className="text-xs font-mono text-slate-500">{time}</p>
      </div>
    </div>
  );
}
