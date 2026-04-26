import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Map as MapIcon, 
  TrendingUp, 
  AlertTriangle,
  History,
  ArrowRight
} from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Ledger</h2>
          <p className="text-sm text-slate-400">Deep-layer spatial analytics and long-term trend forecasting.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
           <button className="px-5 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-slate-400 transition-colors tracking-widest uppercase">Daily</button>
           <button className="px-5 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 tracking-widest uppercase">Monthly</button>
           <button className="px-5 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-slate-400 transition-colors tracking-widest uppercase">Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[32px] p-8 shadow-2xl">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Citizen Response Latency
              </h3>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <div className="flex items-center gap-2 space-x-1"><span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span> <span>2026 Model</span></div>
                 <div className="flex items-center gap-2 space-x-1"><span className="w-2 h-2 rounded-full bg-white/10"></span> <span>Historical</span></div>
              </div>
           </div>
           
           <div className="h-64 flex items-end gap-3 group">
              {[45, 60, 55, 70, 85, 40, 90, 65, 50, 75, 80, 55].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-3 h-full group/col">
                   <div className="flex gap-1 h-full items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: i * 0.03, type: 'spring', stiffness: 100 }}
                      className="w-full bg-indigo-500 rounded-lg group-hover/col:scale-y-110 group-hover:opacity-40 hover:!opacity-100 transition-all relative group/bar shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none shadow-xl scale-90 group-hover/bar:scale-100">
                         {val}m
                       </div>
                    </motion.div>
                   </div>
                   <span className="text-[9px] text-slate-500 font-bold font-mono text-center opacity-40 group-hover/col:opacity-100 transition-opacity">JAN {[i+1].toString().padStart(2, '0')}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-indigo rounded-[32px] p-8 text-white overflow-hidden relative shadow-2xl flex flex-col group">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <MapIcon className="w-48 h-48 text-indigo-400" />
           </div>
           <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-8">Spatial Heatmap Summary</h3>
           <div className="space-y-8 flex-1">
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Sector 4 (Water Line)</span>
                    <span className="text-orange-400">Critical Heat</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full p-0.5 border border-white/5">
                    <div className="h-full bg-orange-400 rounded-full w-[85%] shadow-[0_0_12px_rgba(251,146,60,0.5)]"></div>
                 </div>
              </div>
               <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Main Street Hub</span>
                    <span className="text-indigo-400">Steady</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full p-0.5 border border-white/5">
                    <div className="h-full bg-indigo-500 rounded-full w-[45%] shadow-[0_0_12px_rgba(99,102,241,0.3)]"></div>
                  </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Industrial Zone C</span>
                    <span className="text-emerald-400">Optimized</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full p-0.5 border border-white/5">
                    <div className="h-full bg-emerald-500 rounded-full w-[12%] shadow-[0_0_12px_rgba(16,185,129,0.3)]"></div>
                 </div>
              </div>
           </div>
           <button className="w-full mt-12 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-[20px] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Dynamic Geo-Analysis <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass rounded-[32px] p-8 border border-orange-500/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Neglect Intelligence
            </h3>
            <div className="space-y-4">
               {[
                 { id: 'CMP-882', area: 'Old Town', days: 14, type: 'Structural Maintenance' },
                 { id: 'CMP-721', area: 'West End', days: 12, type: 'Drainage Flow' },
               ].map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl hover:bg-orange-500/10 transition-colors group">
                    <div className="flex items-center gap-5">
                       <span className="text-[10px] font-mono text-orange-400 font-bold tracking-widest">{item.id}</span>
                       <div>
                          <p className="text-sm font-bold text-slate-100 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{item.type}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium group-hover:text-slate-300 transition-colors">{item.area} • Escalation Level 3</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95">Expedite</button>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass rounded-[32px] p-8 border border-indigo-500/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <History className="w-5 h-5 text-indigo-400" />
              Post-Policy Impact Reports
            </h3>
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center space-y-6">
               <div className="flex gap-4 justify-center items-center">
                  <div className="w-24 h-24 glass rounded-2xl flex flex-col items-center justify-center overflow-hidden group/img relative">
                     <div className="absolute inset-0 bg-indigo-500/10 group-hover/img:opacity-0 transition-opacity"></div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 relative z-10">T-90d</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                  <div className="w-24 h-24 glass rounded-2xl flex flex-col items-center justify-center overflow-hidden border-indigo-500/40 shadow-lg shadow-indigo-500/10 relative">
                     <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 relative z-10">Live</span>
                  </div>
               </div>
               <div>
                 <p className="text-sm font-black text-white italic tracking-tight mb-1">"Zone C Connectivity Drive"</p>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Public satisfaction elevated by <span className="text-emerald-400">42%</span></p>
               </div>
               <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest underline underline-offset-8 decoration-indigo-500/30 transition-colors">
                 Download Impact PDF
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
