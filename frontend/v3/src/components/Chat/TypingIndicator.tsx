import React from 'react';
import { motion } from 'motion/react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 w-fit">
      <span className="text-xs text-brand-muted font-medium italic">
        AI is processing context...
      </span>
    </div>
  );
}
