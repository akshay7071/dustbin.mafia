import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Truck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const handleLogin = async (e, role) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setActiveRole(role);
    try {
      await login(email, password);
      toast.success(`${role} logged in successfully`);
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/collector/dashboard');
      }
    } catch (error) {
      toast.error('Invalid credentials');
      setActiveRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#050914] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="space-dust"></div>
      
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
        <h1 className="font-heading font-extrabold text-4xl tracking-wider text-white">
          SMART<span className="text-cyan-400">WASTE</span><span className="text-indigo-400">ROUTE</span>AI
        </h1>
        <p className="font-mono text-slate-400 text-sm mt-2 tracking-widest uppercase">System Authentication</p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-5xl z-10 mt-16">
        
        {/* Admin Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
          className="flex-1 glass-panel p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="font-mono text-xs text-slate-400 mb-8 h-8">Full access to city-wide analytics, fleet management, and settings.</p>
            
            <form onSubmit={(e) => handleLogin(e, 'Admin')} className="space-y-4">
              <div>
                <input 
                  name="email"
                  type="email" 
                  placeholder="admin@smartwaste.local"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                />
              </div>
              <div>
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 mt-4"
              >
                {isLoading && activeRole === 'Admin' ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Authenticate</span>}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Collector Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
          className="flex-1 glass-panel p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
              <Truck className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Collector Portal</h2>
            <p className="font-mono text-xs text-slate-400 mb-8 h-8">Restricted access to route generation and bin status only.</p>
            
            <form onSubmit={(e) => handleLogin(e, 'Collector')} className="space-y-4">
              <div>
                <input 
                  name="email"
                  type="email" 
                  placeholder="driver@smartwaste.local"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                />
              </div>
              <div>
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 mt-4"
              >
                {isLoading && activeRole === 'Collector' ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Start Shift</span>}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
