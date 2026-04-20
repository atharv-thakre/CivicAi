import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Clock, Users, Landmark } from 'lucide-react';
import { MessageData } from '../types';
import { Message } from './Message';

interface ChatPanelProps {
  messages: MessageData[];
  typingUser: string | null;
  sendMessage: (text: string) => void;
  sendTyping: () => void;
  onToggleSidebar?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  typingUser, 
  sendMessage, 
  sendTyping,
  onToggleSidebar
}) => {
  const [inputText, setInputText] = useState('');
  const [currentTime, setCurrentTime] = useState('--:--');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUser]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      sendTyping();
    }
  };

  return (
    <div className="flex-1 glass-panel rounded-[var(--radius-lg)] flex flex-col overflow-hidden border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2563EB] shadow-sm">
            <Landmark size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase leading-none mb-1">
              Community Deliberation
            </div>
            <h2 className="text-[17px] font-serif font-bold text-slate-900 leading-tight">
              Public Forum
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-[#2563EB] font-bold">Resolution #8821</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[11px] text-slate-400 font-medium">Status: Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 uppercase tracking-wide">
            <Clock size={12} className="opacity-60" />
            <span>{currentTime}</span>
          </div>
          
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 text-slate-500 hover:text-slate-900 md:hidden bg-slate-50 border border-slate-200 rounded-full"
            >
              <Users size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-[20px_20px_8px] flex flex-col gap-3.5 scroll-smooth bg-white"
      >
        <div className="flex items-center gap-2.5 text-[11px] text-[var(--muted)] opacity-50 my-2">
          <div className="flex-1 h-px bg-[var(--glass-border)]" />
          Today
          <div className="flex-1 h-px bg-[var(--glass-border)]" />
        </div>
        {messages.map((msg, i) => (
          <Message key={i} data={msg} />
        ))}
      </div>

      {/* Typing Indicator */}
      <div className="h-7 px-5 flex items-center">
        {typingUser && (
          <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] animate-in fade-in duration-300">
            <div className="flex gap-0.75">
              <span className="w-1.25 h-1.25 rounded-full bg-[var(--muted)] animate-dot" />
              <span className="w-1.25 h-1.25 rounded-full bg-[var(--muted)] animate-dot [animation-delay:0.2s]" />
              <span className="w-1.25 h-1.25 rounded-full bg-[var(--muted)] animate-dot [animation-delay:0.4s]" />
            </div>
            <span>{typingUser} is typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 px-4 border-t border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-[var(--radius-pill)] px-3.5 focus-within:border-[#2563EB]/50 focus-within:ring-2 focus-within:ring-[#2563EB]/5 transition-all">
          <button className="px-1 text-lg opacity-40 hover:opacity-100 transition-opacity">
            <Smile size={18} className="text-slate-600" />
          </button>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-900 text-[14px] py-2.5 ml-2 placeholder:text-slate-400 font-medium"
            placeholder="Type your argument..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button 
          onClick={handleSend}
          className="w-[42px] h-[42px] rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md hover:bg-[#1d4ed8] hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
