import React from 'react';
import { X } from 'lucide-react';
import { getInitials, getUserColor } from '../constants';

interface SidebarProps {
  users: string[];
  count: number;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ users, count, onClose }) => {
  return (
    <div className="w-[260px] md:w-[220px] bg-white rounded-[var(--radius-lg)] flex flex-col overflow-hidden shrink-0 h-full border border-slate-200 shadow-sm transition-all">
      <div className="p-[20px_16px_14px] border-b border-slate-100 relative bg-slate-50/50">
        <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2 font-sans">
          In Consultation
        </h3>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] rounded-[20px] p-[4px_12px_4px_8px]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse-custom" />
          {count} Connected
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-[var(--muted)] hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-[12px_10px] flex flex-col gap-1 bg-white">
        {users.map((user, i) => {
          const color = getUserColor(user);
          return (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg transition-colors hover:bg-slate-50 cursor-default group">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm relative group-hover:scale-105 transition-transform"
                style={{ backgroundColor: color.bg, color: color.text, border: `1.5px solid ${color.light}` }}
              >
                {getInitials(user)}
                <span className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full bg-[#10B981] border-2 border-white" />
              </div>
              <span className="text-[13px] font-semibold text-slate-700 truncate">{user}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
