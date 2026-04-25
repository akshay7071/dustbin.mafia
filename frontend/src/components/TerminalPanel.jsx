import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronUp, ChevronDown, Activity } from 'lucide-react';

export default function TerminalPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState([
    { id: 1, time: '14:23:01', msg: 'System initialized. Connecting to fleet...', type: 'info' },
    { id: 2, time: '14:23:05', msg: 'Bin B12 predicted overflow in 1.2 hours', type: 'warning' },
    { id: 3, time: '14:25:12', msg: 'Route recalculated due to emergency bin', type: 'alert' },
    { id: 4, time: '14:25:14', msg: 'SMS alert sent to Driver A', type: 'success' },
  ]);

  return (
    <div className="absolute bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.2 }}
        className="pointer-events-auto w-full max-w-4xl"
      >
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/5 cursor-pointer hover:bg-black/80 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center space-x-3">
              <Terminal className="text-cyan-400 w-4 h-4" />
              <span className="font-mono text-xs text-slate-300 tracking-wider">SYSTEM.TERMINAL_LOGS</span>
              <Activity className="text-emerald-400 w-3 h-3 animate-pulse ml-2" />
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
          </div>

          {/* Logs Body */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 180 }}
                exit={{ height: 0 }}
                className="overflow-y-auto custom-scrollbar bg-[#02040A]/80 p-4 font-mono text-xs"
              >
                {logs.map(log => (
                  <div key={log.id} className="mb-2 flex space-x-3 items-start hover:bg-white/5 p-1 rounded transition-colors">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'alert' ? 'text-red-400' : ''}
                      ${log.type === 'warning' ? 'text-amber-400' : ''}
                      ${log.type === 'success' ? 'text-emerald-400' : ''}
                      ${log.type === 'info' ? 'text-cyan-400' : ''}
                    `}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                {/* Blinking cursor */}
                <div className="flex space-x-3 items-center opacity-70 mt-2 p-1">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString('en-US', {hour12: false})}]</span>
                  <span className="w-2 h-3 bg-indigo-400 animate-pulse"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
