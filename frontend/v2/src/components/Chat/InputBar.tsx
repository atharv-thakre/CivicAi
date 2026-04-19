import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
       <div id="typing-indicator" className="h-6 flex items-center px-4 gap-2">
         {disabled && (
           <div className="flex items-center gap-2 animate-pulse">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-100/50 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-100/50 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-slate-100/50 rounded-full animate-bounce delay-200"></span>
            </div>
            <span className="text-xs text-slate-100/50 italic">AI is processing...</span>
           </div>
         )}
      </div>

      <div className="flex items-center gap-2.5">
        <div id="msg-input-wrap" className="flex-1 flex items-center bg-white/7 border border-glass-border rounded-[22px] px-3.5 py-0 focus-within:border-accent-indigo/50 focus-within:bg-white/10 transition-all duration-200">
          <button type="button" className="text-lg opacity-60 hover:opacity-100 transition-opacity p-1">😊</button>
          <input
            id="msg"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={disabled}
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 py-3 text-sm outline-none"
          />
        </div>
        
        <button
          id="send-btn"
          type="submit"
          disabled={!input.trim() || disabled}
          className="w-[42px] h-[42px] rounded-full accent-gradient text-white flex items-center justify-center shadow-[0_4px_14px_rgba(129,140,248,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <Send size={18} fill="currentColor" />
        </button>
      </div>
    </form>
  );
}
