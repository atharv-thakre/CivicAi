import React from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';

interface ComplaintSearchProps {
  onSearch: (query: string) => void;
}

export const ComplaintSearch: React.FC<ComplaintSearchProps> = ({ onSearch }) => {
  return (
    <div className="mb-2">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search context..."
        className="block w-full px-4 py-2 border border-glass-border rounded-lg bg-white/5 text-slate-100 text-sm focus:ring-1 focus:ring-accent-indigo focus:border-accent-indigo transition-all outline-none font-sans placeholder:text-slate-100/30"
      />
    </div>
  );
}
