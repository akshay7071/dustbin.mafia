import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, BarChart2, Activity, ShieldAlert, FileText, RefreshCcw, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { icon: <RefreshCcw className="w-4 h-4 text-indigo-400" />, label: 'Switch Portal (Admin/Collector)', type: 'System', action: () => {
        const isAdmin = window.location.pathname.startsWith('/admin');
        const newPrefix = isAdmin ? '/collector' : '/admin';
        window.location.href = `${newPrefix}/dashboard`;
    }},
    { icon: <Map className="w-4 h-4" />, label: 'Generate Route', type: 'Action' },
    { icon: <BarChart2 className="w-4 h-4" />, label: 'Predict Fill Levels', type: 'AI' },
    { icon: <Activity className="w-4 h-4" />, label: 'Switch to Heatmap Mode', type: 'View' },
    { icon: <FileText className="w-4 h-4" />, label: 'View Weekly Report', type: 'Document' },
    { icon: <ShieldAlert className="w-4 h-4 text-red-400" />, label: 'Enable Emergency Mode', type: 'System' },
    { icon: <ArrowLeft className="w-4 h-4" />, label: 'Go Back', type: 'Navigation', action: () => window.history.back() },
    { icon: <ArrowRight className="w-4 h-4" />, label: 'Go Forward', type: 'Navigation', action: () => window.history.forward() },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-black/40">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg font-sans"
              />
              <div className="text-xs font-mono text-slate-500 px-2 py-1 bg-white/5 rounded border border-white/10">ESC</div>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-slate-500 font-mono text-sm">No commands found.</div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (cmd.action) cmd.action();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center space-x-3 text-slate-300 group-hover:text-white transition-colors">
                      {cmd.icon}
                      <span className="font-medium text-sm">{cmd.label}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {cmd.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
