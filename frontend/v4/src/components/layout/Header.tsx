import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between mb-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-tight">Governance Overview</h1>
        <p className="text-slate-400 text-xs">City of San Francisco • Central District</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 mr-4">
          <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI Engine Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full relative text-slate-400 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 ml-2 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-400">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
