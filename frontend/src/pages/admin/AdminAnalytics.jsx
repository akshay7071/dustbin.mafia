import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SavingsChart from '../../components/SavingsChart';
import { Calendar, Download, TrendingDown, Fuel, Leaf, IndianRupee } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 } }
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 7 Days');

  return (
    <div className="relative flex-1 w-full bg-[#050914] pt-20">
      {/* Background Space Dust */}
      <div className="space-dust"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white tracking-wide">SAVINGS <span className="text-cyan-400">ANALYTICS</span></h1>
            <p className="text-slate-400 text-sm mt-1 font-mono">Track environmental and financial impact metrics.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-slate-300 py-2 pl-10 pr-8 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-sm font-medium font-mono"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
              </select>
              <Calendar className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 p-2 rounded-xl transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            icon={<TrendingDown className="w-5 h-5 text-indigo-400" />}
            title="Total km Saved"
            value="387"
            unit="km"
            subtext="vs Fixed Route"
            trend="+12%"
            color="border-indigo-500/30"
          />
          <MetricCard 
            icon={<Fuel className="w-5 h-5 text-cyan-400" />}
            title="Fuel Saved"
            value="46.4"
            unit="L"
            subtext="Diesel avoided"
            trend="+8%"
            color="border-cyan-500/30"
          />
          <MetricCard 
            icon={<Leaf className="w-5 h-5 text-emerald-400" />}
            title="CO₂ Avoided"
            value="104.9"
            unit="kg"
            subtext="Emissions cut"
            trend="+15%"
            color="border-emerald-500/30"
          />
          <MetricCard 
            icon={<IndianRupee className="w-5 h-5 text-amber-400" />}
            title="Cost Saved"
            value="4,269"
            unit="₹"
            subtext="Estimated INR"
            trend="+12%"
            color="border-amber-500/30"
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              DAILY DISTANCE: OPTIMIZED VS BASELINE
            </h3>
            <div className="h-80">
              <SavingsChart />
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide">TOP 5 OVERFLOW WARDS</h3>
            <div className="space-y-4">
              <BarChartRow label="Ward C - Nirala Bazaar" percentage={85} color="bg-red-500" />
              <BarChartRow label="Ward E - Connaught" percentage={72} color="bg-amber-500" />
              <BarChartRow label="Ward A - Station Road" percentage={64} color="bg-amber-400" />
              <BarChartRow label="Ward B - Kranti Chowk" percentage={55} color="bg-indigo-400" />
              <BarChartRow label="Ward G - MIDC" percentage={40} color="bg-emerald-500" />
            </div>
            <div className="mt-8 text-sm text-slate-400 border-t border-white/10 pt-4 font-mono">
              <span className="text-cyan-400">AI INSIGHT:</span> Ward C has seen a 14% increase in overflow incidents compared to last week.
            </div>
          </div>
        </motion.div>

        {/* Route History Table */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
            <h3 className="font-heading font-bold text-white tracking-wide">RECENT ROUTE HISTORY</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10 font-mono tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Route ID</th>
                  <th className="px-6 py-4 text-center">Stops</th>
                  <th className="px-6 py-4 text-right">Distance (km)</th>
                  <th className="px-6 py-4 text-right">Fuel Saved (L)</th>
                  <th className="px-6 py-4 text-right">CO₂ (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <TableRow date="Today, 08:30 AM" id="rt_8f7a9" stops={23} km={18.4} fuel={2.8} co2={6.3} />
                <TableRow date="Yesterday, 02:15 PM" id="rt_2c4b1" stops={18} km={15.2} fuel={3.2} co2={7.2} />
                <TableRow date="Oct 12, 09:00 AM" id="rt_9m3x5" stops={28} km={22.1} fuel={2.4} co2={5.4} />
                <TableRow date="Oct 11, 01:45 PM" id="rt_5k2l8" stops={21} km={17.8} fuel={2.9} co2={6.5} />
                <TableRow date="Oct 10, 08:15 AM" id="rt_1p7q4" stops={25} km={19.5} fuel={2.7} co2={6.1} />
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MetricCard({ icon, title, value, unit, subtext, trend, color }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`glass-panel p-6 rounded-2xl border ${color} relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <div className="flex items-baseline space-x-1 mb-1">
          {unit === '₹' && <span className="text-lg text-slate-500">{unit}</span>}
          <h4 className="text-3xl font-bold text-white">{value}</h4>
          {unit !== '₹' && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
        <p className="text-xs text-slate-500">{subtext}</p>
      </div>
    </motion.div>
  );
}

function BarChartRow({ label, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono uppercase tracking-wider mb-1.5">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="text-cyan-400 font-bold">{percentage}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`} 
        />
      </div>
    </div>
  );
}

function TableRow({ date, id, stops, km, fuel, co2 }) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 font-medium text-slate-300 group-hover:text-white transition-colors">{date}</td>
      <td className="px-6 py-4 text-cyan-500/70 font-mono text-xs">{id}</td>
      <td className="px-6 py-4 text-center">
        <span className="bg-white/10 border border-white/10 text-white text-xs font-mono px-2.5 py-1 rounded-full">{stops}</span>
      </td>
      <td className="px-6 py-4 text-right font-medium text-slate-300">{km}</td>
      <td className="px-6 py-4 text-right text-emerald-400 font-mono">{fuel}</td>
      <td className="px-6 py-4 text-right text-slate-400 font-mono">{co2}</td>
    </tr>
  );
}
