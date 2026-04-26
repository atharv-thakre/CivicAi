import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  Download, 
  ExternalLink, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  BrainCircuit,
  ChevronRight
} from 'lucide-react';
import { MOCK_COMPLAINTS } from '../../constants';
import { Complaint } from '../../types';

const ComplaintList: React.FC = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'URGENT': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'IN_PROGRESS': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/5 text-slate-400 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Public Issues</h2>
          <p className="text-sm text-slate-400">Live community feedback & AI triage system.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/5 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 bg-white/5 border-b border-white/10 p-4">
          <div className="col-span-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</div>
          <div className="col-span-11 grid grid-cols-11 items-center">
             <div className="col-span-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</div>
             <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</div>
             <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</div>
             <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend</div>
             <div className="col-span-1"></div>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {MOCK_COMPLAINTS.map((complaint) => (
            <motion.div 
              key={complaint.id} 
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              onClick={() => setSelectedComplaint(complaint)}
              className="grid grid-cols-12 p-4 cursor-pointer transition-colors group items-center"
            >
              <div className="col-span-1 text-[10px] font-mono text-slate-500 font-bold">{complaint.id}</div>
              <div className="col-span-11 grid grid-cols-11 items-center">
                <div className="col-span-4">
                  <p className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors tracking-tight">{complaint.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 italic">"{complaint.description}"</p>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-bold tracking-tight">{complaint.location}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(complaint.status)} uppercase tracking-tighter`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                   <div className="flex gap-0.5 items-center">
                      {[1,2,3].map(lvl => (
                        <div key={lvl} className={`w-1.5 h-1.5 rounded-full ${lvl <= (complaint.priority === 'CRITICAL' ? 3 : complaint.priority === 'HIGH' ? 2 : 1) ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                      ))}
                   </div>
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{complaint.priority}</span>
                </div>
                <div className="col-span-1 flex justify-end">
                   <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass rounded-[40px] w-full max-w-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-start bg-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-slate-500 font-bold tracking-widest">{selectedComplaint.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(selectedComplaint.status)} uppercase tracking-widest`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedComplaint.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full text-slate-400 transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 block">Contextual Summary</label>
                    <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-white/10 pl-4">"{selectedComplaint.description}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1 block">Sector</label>
                      <p className="text-slate-100 font-bold text-sm tracking-tight">{selectedComplaint.category}</p>
                    </div>
                     <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1 block">Timeline</label>
                      <p className="text-slate-100 font-bold text-sm tracking-tight">{selectedComplaint.timestamp}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                     <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-slate-500" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-white">Media Evidence (1)</p>
                        <button className="text-[10px] text-indigo-400 font-bold hover:underline">Launch Image Analysis</button>
                     </div>
                  </div>
                </div>

                <div className="glass-indigo p-6 rounded-3xl relative overflow-hidden group">
                   <div className="flex items-center gap-2 mb-5 text-indigo-400 font-bold text-xs uppercase tracking-widest font-sans">
                      <BrainCircuit className="w-4 h-4" />
                      AI Intelligence Layer
                   </div>
                   {selectedComplaint.aiAnalysis && (
                     <div className="space-y-6">
                       <div>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Sentiment Gradient</p>
                         <p className="text-slate-100 font-bold text-sm">{selectedComplaint.aiAnalysis.sentiment}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Recommended Response</p>
                         <p className="text-slate-300 text-xs leading-relaxed italic">"{selectedComplaint.aiAnalysis.suggestedAction}"</p>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t border-indigo-500/20">
                          <span className="text-[10px] font-bold text-indigo-400/60 uppercase">Confidence: {selectedComplaint.aiAnalysis.confidence * 100}%</span>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">Approve AI Action</button>
                       </div>
                     </div>
                   )}
                </div>
              </div>

              <div className="p-8 bg-white/5 flex justify-end gap-4">
                 <button className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">Route to Department</button>
                 <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-xs font-bold shadow-xl hover:scale-105 transition-all">Update Investigation Status</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintList;
