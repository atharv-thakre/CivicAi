import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, MapPin, AlertCircle } from 'lucide-react';
import { Complaint } from '../../types';

interface ContextBannerProps {
  activeComplaint: Complaint | null;
  onClear: () => void;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({ activeComplaint, onClear }) => {
  return (
    <AnimatePresence>
      {activeComplaint && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/5 border-b border-glass-border text-slate-100 px-5 py-2.5 flex items-center justify-between backdrop-blur-md"
        >
          <div className="flex items-center space-x-3 text-sm">
            <span className="opacity-50">📍 Reference:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-medium border border-glass-border">
              {activeComplaint.title}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-[10px] opacity-40 font-bold tracking-widest uppercase">
              REF #{activeComplaint.id.toString().padStart(3, '0')}
            </span>
            <button 
              onClick={onClear}
              className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-50 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
