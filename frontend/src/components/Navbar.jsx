import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Trash2, LogOut, LayoutDashboard, BarChart3, Globe,
  Shield, Truck, ArrowLeftRight, Command
} from 'lucide-react';
import { motion } from 'framer-motion';
import BackForwardControls from './BackForwardControls';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById('root');
    if (!el) return;
    const handleScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isAdmin = location.pathname.startsWith('/admin');
  const portalPrefix = isAdmin ? '/admin' : '/collector';

  const switchPortal = () => {
    const newPrefix = isAdmin ? '/collector' : '/admin';
    navigate(`${newPrefix}/dashboard`);
  };

  return (
    <nav className={`sticky top-0 w-full z-50 shrink-0 transition-all duration-300 border-b ${
      scrolled
        ? 'bg-[#050914]/95 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
        : 'bg-[#050914]/85 backdrop-blur-md border-white/5'
    }`}>
      <div className="px-5 h-12 flex items-center justify-between">
        {/* ── Left: Logo + Nav Controls + Page Links ── */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2.5 group relative">
            <div className="relative p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-all">
              <Trash2 className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-wider text-white hidden sm:block">
              SMART<span className="text-cyan-400">WASTE</span><span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <BackForwardControls />

          {user && (
            <>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <div className="hidden md:flex items-center space-x-1 rounded-full px-1.5 py-1 bg-black/40 border border-white/5">
                <NavLink to={`${portalPrefix}/dashboard`} icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Dashboard" current={location.pathname} />
                {isAdmin && (
                  <>
                    <NavLink to={`${portalPrefix}/analytics`} icon={<BarChart3 className="w-3.5 h-3.5" />} label="Analytics" current={location.pathname} />
                    <NavLink to={`${portalPrefix}/public`} icon={<Globe className="w-3.5 h-3.5" />} label="Public" current={location.pathname} />
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Right: Portal badge + Ctrl+K + User + Logout ── */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              {/* Portal Indicator + Switch */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={switchPortal}
                className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider border transition-all ${
                  isAdmin
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                }`}
                title="Switch Portal"
              >
                {isAdmin ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <Truck className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden lg:inline">{isAdmin ? 'Admin' : 'Collector'}</span>
                <ArrowLeftRight className="w-3 h-3 opacity-50" />
              </motion.button>

              {/* ⌘K Hint */}
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k', bubbles: true }))}
                className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Open Command Palette"
              >
                <Command className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] tracking-wider">K</span>
              </button>

              {/* User Avatar */}
              <div className="hidden lg:flex items-center space-x-2 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/10">
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 font-mono text-[10px]">{user.email.split('@')[0]}</span>
              </div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                title="Logout"
                className="flex items-center p-2 rounded-xl transition-all bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <Link
              to="/login"
              className="relative group overflow-hidden px-4 py-1.5 rounded-xl border border-cyan-500/40 bg-black/40 text-cyan-400 hover:text-white transition-all text-xs font-mono uppercase tracking-wider font-bold"
            >
              <div className="absolute inset-0 bg-cyan-500/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, current }) {
  const isActive = current === to || current.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium uppercase tracking-wider overflow-hidden group ${
        isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/40 rounded-full"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      <span className={`relative z-10 ${isActive ? 'text-indigo-400' : 'group-hover:text-cyan-400 transition-colors'}`}>{icon}</span>
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
