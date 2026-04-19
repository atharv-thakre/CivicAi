import React from 'react';
import { motion } from 'motion/react';
import { Message } from '../../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'assistant';

  // Remove the hidden context string if it exists for UI display
  const displayContent = message.content.replace(/\?complaint=\d+/, '').trim();

  const initials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full gap-2.5 max-w-[75%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
    >
      <div className={`msg-avatar w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-auto ${
        isAI ? 'accent-gradient' : 'sky-gradient'
      }`}>
        {isAI ? 'AI' : 'JD'}
      </div>
      
      <div className={`flex flex-col gap-1 ${isAI ? 'items-start' : 'items-end'}`}>
        {!isAI && <span className="text-[11px] font-semibold px-1 text-accent-indigo">John Doe</span>}
        {isAI && <span className="text-[11px] font-semibold px-1 text-accent-sky">Moderator</span>}
        
        <div className={`bubble px-4 py-2.5 rounded-[22px] text-sm shadow-msg leading-relaxed ${
          isAI 
            ? 'glass-panel text-slate-100 rounded-bl-[6px]' 
            : 'accent-gradient text-white rounded-br-[6px]'
        }`}>
          {message.content.includes('@ai') && !isAI && (
            <span className="inline-block bg-white/30 px-1.5 py-0.5 rounded text-[10px] font-bold mr-2 uppercase">
              @ai
            </span>
          )}
          <p className="whitespace-pre-wrap inline">{displayContent}</p>
        </div>
        
        <span className="msg-meta text-[10px] text-slate-100/50 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
