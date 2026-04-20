import React from 'react';
import { motion } from 'motion/react';
import { MessageData } from '../types';
import { getInitials, getUserColor } from '../constants';

interface MessageProps {
  data: MessageData;
}

export const Message: React.FC<MessageProps> = ({ data }) => {
  if (data.sender === 'system') {
    return (
      <div className="self-center text-[11px] text-[var(--muted)] glass-panel rounded-[20px] p-[4px_14px]">
        {data.message}
      </div>
    );
  }

  const isMine = data.is_mine;
  const color = getUserColor(data.sender || 'Unknown');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-2.5 max-w-[70%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}
    >
      <div 
        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-auto"
        style={{ background: color.bg, color: color.text }}
      >
        {getInitials(data.sender || '?')}
      </div>
      <div className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && (
          <div className="text-[11px] font-semibold px-1 mb-0.25" style={{ color: color.hex }}>
            {data.sender}
          </div>
        )}
        <div 
          className={`px-4 py-2.5 text-[14.5px] leading-relaxed break-words shadow-[var(--shadow-msg)] rounded-[var(--radius-pill)] border ${
            isMine 
              ? 'bg-[#2563eb] text-white border-[#2563eb] rounded-br-md font-medium' 
              : 'rounded-bl-md font-medium'
          }`}
          style={!isMine ? { backgroundColor: color.bg, color: color.text, borderColor: color.light } : {}}
        >
          {data.message}
        </div>
        {data.time && <div className="text-[10px] text-[var(--muted)] px-1">{data.time}</div>}
      </div>
    </motion.div>
  );
};
