import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Minus, BarChart3, Zap } from 'lucide-react';
import { MOCK_METRICS } from '../../constants';

const Overview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* AI Briefing - Glass Styled from Theme */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-indigo p-6 rounded-3xl relative overflow-hidden group shadow-2xl shadow-indigo-500/5"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-24 h-24 text-indigo-400" />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Morning Intelligence Briefing</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <p className="text-slate-100 text-lg font-medium leading-tight">
              <span className="text-indigo-400">Critical Alert:</span> A sudden spike in water-related complaints suggests a potential main line burst in <span className="underline decoration-indigo-500/50 underline-offset-4 pointer-events-auto cursor-help">Sector 4</span>.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Resolution time for sanitation issues improved by <span className="text-emerald-400 font-bold">15%</span> this week after the AI-optimized re-routing.
            </p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Priority Actions</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"> Dispatch inspection team to Sector 4</li>
                <li className="flex items-center gap-2"> Highlight 3 neglected waste complaints</li>
              </ul>
            </div>
            <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all">
              Execute All Recommendations
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards - Glass Styled */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_METRICS.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass p-5 rounded-3xl"
          >
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{metric.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-bold tracking-tight text-white">{metric.value}</h3>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                metric.trend === 'up' ? 'text-indigo-400' : 
                metric.trend === 'down' ? 'text-orange-400' : 
                'text-slate-400'
              }`}>
                {metric.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {metric.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                className={`h-full rounded-full transition-all duration-1000 ${metric.trend === 'up' ? 'bg-indigo-500' : 'bg-slate-700'}`} 
                style={{ width: index === 2 ? '72%' : '45%' }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Community Pulse by Zone</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="w-2 h-2 rounded-full bg-white/10"></span>
            </div>
          </div>
          <div className="space-y-6">
            {['Zone A - North', 'Zone B - Downtown', 'Zone C - Residential', 'Zone D - Industrial'].map((zone, i) => (
              <div key={zone} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">{zone}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold tracking-tighter italic opacity-0 group-hover:opacity-100 transition-opacity">LVL.{[85, 92, 78, 64][i]}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1 flex gap-0.5">
                   {Array.from({ length: 10 }).map((_, segment) => (
                      <div 
                        key={segment}
                        className={`h-full flex-1 rounded-sm transition-all duration-700 delay-[${segment * 50}ms] ${
                          (segment + 1) * 10 <= [85, 92, 78, 64][i] 
                            ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]' 
                            : 'bg-white/5'
                        }`}
                      ></div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-indigo rounded-3xl p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
            <BarChart3 className="w-32 h-32 text-indigo-400" />
          </div>
          <h3 className="font-bold text-indigo-400 mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Policy Pulse
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="border-l-2 border-indigo-500/30 pl-4 py-1 hover:border-indigo-400 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Waste Predicted Spike</p>
              <p className="text-sm text-slate-300 leading-snug">Holiday weekend ahead. Predicted <span className="text-indigo-300 font-bold">24% increase</span> in residential waste weight.</p>
            </div>
             <div className="border-l-2 border-orange-500/30 pl-4 py-1 hover:border-orange-400 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Infrastructure Risk</p>
              <p className="text-sm text-slate-300 leading-snug">Storm drainage pattern suggests <span className="text-orange-300 font-bold">blockage risk</span> in Sector 2.</p>
            </div>
          </div>
          <button className="w-full mt-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xl shadow-indigo-600/20">
             Initiate Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
