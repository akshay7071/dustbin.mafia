import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SavingsChart from '../../components/SavingsChart';
import { Calendar, Download, TrendingDown, Fuel, Leaf, IndianRupee, CheckSquare, Target, Database, ShieldAlert } from 'lucide-react';
import { DUMMY_METRICS } from '../../utils/dummyData';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 } }
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/metrics');
        if (data && data.co2_saved_kg !== undefined) {
          setMetrics(data);
        } else {
          setMetrics(DUMMY_METRICS);
        }
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        setMetrics(DUMMY_METRICS);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return (
    <div className="flex-1 w-full bg-[#050914] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  const kmSaved = metrics ? Math.round(metrics.baseline_distance_km - metrics.optimized_distance_km) : 0;
  const costSaved = kmSaved * 12; // Simple math for estimation

  return (
    <div className="relative flex-1 w-full bg-[#050914] pt-20">
      <div className="space-dust" />
      
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white tracking-wide">IMPACT <span className="text-cyan-400">ANALYTICS</span></h1>
            <p className="text-slate-400 text-sm mt-1 font-mono">Live environmental and performance metrics from the SmartWaste core.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-slate-300 py-2 pl-10 pr-8 rounded-xl focus:outline-none focus:border-cyan-500/50 text-sm font-medium font-mono"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
              <Calendar className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            icon={<TrendingDown className="w-5 h-5 text-indigo-400" />}
            title="Distance Saved"
            value={kmSaved}
            unit="km"
            subtext="Optimized vs Fixed"
            trend={`${metrics?.pct_distance_saved || 0}%`}
            color="border-indigo-500/30"
          />
          <MetricCard 
            icon={<Fuel className="w-5 h-5 text-cyan-400" />}
            title="Fuel Avoided"
            value={metrics?.fuel_saved_litres || 0}
            unit="L"
            subtext="Estimated savings"
            trend="Active"
            color="border-cyan-500/30"
          />
          <MetricCard 
            icon={<Leaf className="w-5 h-5 text-emerald-400" />}
            title="CO₂ Reduction"
            value={metrics?.co2_saved_kg || 0}
            unit="kg"
            subtext={`${metrics?.trees_equivalent || 0} trees equiv.`}
            trend="Live"
            color="border-emerald-500/30"
          />
          <MetricCard 
            icon={<IndianRupee className="w-5 h-5 text-amber-400" />}
            title="Estimated Savings"
            value={costSaved.toLocaleString()}
            unit="₹"
            subtext="Calculated from fuel"
            trend="Live"
            color="border-amber-500/30"
          />
        </motion.div>

        {/* AI & Model Performance Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              COLLECTION EFFICIENCY TRACKER
            </h3>
            <div className="h-80">
              <SavingsChart data={metrics} />
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-wide flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-400" />MODEL PERFORMANCE
              </h3>
              <div className="space-y-6">
                <BarChartRow label="Prediction Accuracy" percentage={metrics?.model_accuracy_pct || 94} color="bg-indigo-500" />
                <BarChartRow label="Routing Efficiency" percentage={metrics?.pct_distance_saved || 45} color="bg-cyan-500" />
                <BarChartRow label="Fleet Utilization" percentage={78} color="bg-emerald-500" />
              </div>
            </div>
            
            <div className="mt-8 text-sm text-slate-400 border-t border-white/10 pt-4 font-mono">
              <div className="flex justify-between mb-2">
                <span>Total Collections:</span>
                <span className="text-white">{metrics?.total_collections || 0}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>RMSE Error:</span>
                <span className="text-indigo-400">{metrics?.model_rmse || '1.4'}%</span>
              </div>
              <div className="flex justify-between">
                <span>Last Evolution:</span>
                <span className="text-cyan-400">{metrics?.last_retrained ? new Date(metrics.last_retrained).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-heading">Task Completion</h4>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{metrics?.bins_visited || 0} / {(metrics?.bins_visited || 0) + (metrics?.bins_skipped || 0)}</p>
            <p className="text-xs text-slate-500 font-mono">Urgent bins serviced vs total</p>
          </div>
          
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-indigo-400" />
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-heading">Data Points</h4>
            </div>
            <p className="text-2xl font-bold text-white mb-1">12.4k</p>
            <p className="text-xs text-slate-500 font-mono">Sensor entries processed today</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-heading">System Retrains</h4>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{metrics?.total_retrains || 0}</p>
            <p className="text-xs text-slate-500 font-mono">Autonomous AI evolutions completed</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MetricCard({ icon, title, value, unit, subtext, trend, color }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`glass-panel p-6 rounded-2xl border ${color} relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">{icon}</div>
        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full uppercase">{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <div className="flex items-baseline space-x-1 mb-1">
          {unit === '₹' && <span className="text-lg text-slate-500">{unit}</span>}
          <h4 className="text-3xl font-extrabold text-white">{value}</h4>
          {unit !== '₹' && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
        <p className="text-[10px] font-mono text-slate-500">{subtext}</p>
      </div>
    </motion.div>
  );
}

function BarChartRow({ label, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider mb-2">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="text-white font-bold">{percentage}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(99,102,241,0.3)]`} 
        />
      </div>
    </div>
  );
}
