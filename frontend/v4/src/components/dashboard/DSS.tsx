import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Target, 
  Clock, 
  DollarSign, 
  Users, 
  Lightbulb,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { MOCK_ACTION_PLANS } from '../../constants';

const DSS: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          Policy Simulation Center
        </h2>
        <p className="text-sm text-slate-400">AI-powered predictive modeling for resource and policy impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {MOCK_ACTION_PLANS.map((plan) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500 rounded-2xl p-3 shadow-lg shadow-indigo-500/20">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">{plan.id}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.title}</h3>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300 transition-colors">
                  SIMULATION DATA <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                    AI Strategic Roadmap
                  </h4>
                  <div className="space-y-4">
                    {plan.steps.map((step, i) => (
                      <div key={i} className="flex gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-colors">
                        <span className="font-mono text-indigo-500 font-bold text-xl opacity-30 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                        <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-100 transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-5 bg-white/5 rounded-[24px] border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> Est. Cost
                    </p>
                    <p className="text-xl font-bold text-white leading-none">{plan.estimatedCost}</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-[24px] border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> Timeline
                    </p>
                    <p className="text-xl font-bold text-white leading-none">{plan.estimatedTime}</p>
                  </div>
                  <div className="col-span-2 p-5 bg-white/5 rounded-[24px] border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-3 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" /> Key Stakeholders
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.resources.map(res => (
                        <span key={res} className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded-lg font-bold text-slate-300 uppercase tracking-widest transition-colors hover:bg-white/10">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-indigo-600 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                    Recommended for Monsoon Stability
                 </div>
                 <button className="px-10 py-3 bg-white text-indigo-900 rounded-2xl text-xs font-black shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                    Deploy Resources
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-indigo rounded-[32px] p-8 text-white border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-2">
               <Zap className="w-4 h-4" />
               Real-time Balancing
            </h3>
            <div className="space-y-6">
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-white/10 transition-all">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Zone Optimization</p>
                 <p className="text-sm text-slate-200 leading-snug tracking-tight">Shifting 5 inspectors from Zone D to <span className="text-indigo-400 font-bold">Zone A</span> for storm mitigation.</p>
                 <div className="mt-6 flex justify-between items-center">
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">+12% Gain</span>
                    <button className="text-white bg-indigo-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20">Approve</button>
                 </div>
              </div>
              
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-white/10 transition-all">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Procurement Draft</p>
                 <p className="text-sm text-slate-200 leading-snug tracking-tight">RFQ for 20 high-capacity pumps based on <span className="text-indigo-400 font-bold">hydrological history</span>.</p>
                 <div className="mt-6 flex justify-between items-center">
                    <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Drafting</span>
                    <button className="text-slate-400 hover:text-white uppercase font-bold tracking-widest text-[10px] transition-colors underline underline-offset-4">Review</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSS;
