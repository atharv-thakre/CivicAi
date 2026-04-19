import React from 'react';
import { Complaint } from '../../types';
import { AlertCircle, Clock, MapPin } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  isActive: boolean;
  onSelect: (complaint: Complaint) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, isActive, onSelect }) => {
  const severityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-[#fef3c7] text-[#92400e]',
    high: 'bg-[#fee2e2] text-[#991b1b]',
  };

  return (
    <button
      onClick={() => onSelect(complaint)}
      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 mb-3 ${
        isActive 
          ? 'bg-white/10 border-accent-indigo shadow-msg' 
          : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-glass-border'
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-semibold text-slate-100 text-sm truncate">{complaint.title}</h4>
      </div>
      
      <div className="flex items-center space-x-2 text-[11px]">
        <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
          complaint.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {complaint.severity}
        </span>
        <span className="text-slate-100/50">#{complaint.id.toString().padStart(3, '0')}</span>
      </div>
    </button>
  );
}
