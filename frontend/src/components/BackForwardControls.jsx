import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BackForwardControls() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-1 bg-black/40 border border-white/10 rounded-full p-1 backdrop-blur-md">
      <ControlButton icon={<ChevronLeft className="w-4 h-4" />} onClick={() => navigate(-1)} tooltip="Go Back" />
      <ControlButton icon={<ChevronRight className="w-4 h-4" />} onClick={() => navigate(1)} tooltip="Go Forward" />
      <div className="w-px h-4 bg-white/10 mx-1"></div>
      <ControlButton icon={<RotateCw className="w-3.5 h-3.5" />} onClick={() => window.location.reload()} tooltip="Reload" />
    </div>
  );
}

function ControlButton({ icon, onClick, tooltip }) {
  return (
    <motion.button 
      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={tooltip}
      className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
    >
      {icon}
    </motion.button>
  );
}
