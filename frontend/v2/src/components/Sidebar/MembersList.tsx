import React from 'react';
import { Member } from '../../types';

interface MembersListProps {
  members: Member[];
}

export const MembersList: React.FC<MembersListProps> = ({ members }) => {
  const onlineCount = members.filter(m => m.status === 'online').length;

  const initials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div id="sidebar" className="w-[220px] flex-shrink-0 glass-panel rounded-[18px] flex flex-col overflow-hidden h-full">
      <div id="sidebar-header" className="p-[18px] pb-3 border-b border-glass-border">
        <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-100/50 mb-1.5">
          Members
        </h3>
        <div id="online-badge" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#4ade80] bg-[#4ade80]/12 border border-[#4ade80]/25 rounded-[20px] px-2.5 py-0.5">
          <div className="w-[7px] h-[7px] rounded-full bg-[#4ade80] shadow-[0_0_0_2px_rgba(74,222,128,0.3)] animate-pulse" />
          {onlineCount} online
        </div>
      </div>
      
      <div id="users-list" className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar">
        {members.map(member => (
          <div key={member.id} className="user-item flex items-center gap-2.5 p-2 rounded-[10px] transition-colors hover:bg-glass-hover cursor-default">
            <div className={`user-avatar w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 border-2 border-white/15 relative ${
               member.status === 'online' ? 'accent-gradient' : 'bg-slate-600'
            }`}>
              {initials(member.name)}
              {member.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full bg-[#4ade80] border-2 border-[#0f0c29]/80" />
               )}
            </div>
            <span className="user-name text-[13px] font-medium truncate text-slate-100">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
