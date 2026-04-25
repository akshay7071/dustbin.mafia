import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, LogOut, LayoutDashboard, BarChart3, Globe, User, Zap, History } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide navbar on driver route
  if (location.pathname === '/driver') return null;

  return (
    <nav className="h-14 bg-primary text-white flex items-center justify-between px-6 shadow-md z-50 relative">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2 font-bold text-lg tracking-tight">
          <Trash2 className="w-5 h-5 text-accent" />
          <span>SmartWaste</span>
        </Link>
        
        {user && (
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" current={location.pathname} />
            <NavLink to="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" current={location.pathname} />
            <NavLink to="/admin/retrain" icon={<Zap className="w-4 h-4" />} label="Evolution" current={location.pathname} />
            <NavLink to="/admin/logs" icon={<History className="w-4 h-4" />} label="Logs" current={location.pathname} />
            <NavLink to="/collector" icon={<User className="w-4 h-4" />} label="Collector" current={location.pathname} />
            <NavLink to="/public" icon={<Globe className="w-4 h-4" />} label="Public View" current={location.pathname} />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm">
        {user ? (
          <>
            <span className="hidden sm:inline-block opacity-80">{user.email}</span>
            <button 
              onClick={logout}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-accent hover:bg-accent-hover transition-colors px-4 py-1.5 rounded-md font-medium">
            Operator Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, current }) {
  const isActive = current === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors ${
        isActive ? 'bg-white/20 font-medium' : 'hover:bg-white/10 text-white/80 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
