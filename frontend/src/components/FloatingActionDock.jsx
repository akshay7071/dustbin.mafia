import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingActionDock() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-2"
    >
      <DockButton icon={<ArrowUp className="w-4 h-4" />} onClick={scrollToTop} tooltip="Scroll to Top" />
      <DockButton icon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate(1)} tooltip="Forward" />
      <DockButton icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)} tooltip="Back" />
    </motion.div>
  );
}

function DockButton({ icon, onClick, tooltip }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, x: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={tooltip}
      className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:bg-indigo-500/20 hover:text-white transition-colors"
    >
      {icon}
    </motion.button>
  );
}
