import { Card, Badge, Button } from '@/src/components/ui';
import { MapPin, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function MapSidebar({ selectedMarker, setSelectedMarker }) {
  return (
    <div className="w-full lg:w-80 space-y-6">
      {selectedMarker ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          key={selectedMarker.id}
        >
          <Card className="p-6 border-black/5 dark:border-white/5 border-l-4 border-l-vision-accent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-1">
               <button onClick={() => setSelectedMarker(null)} className="text-vision-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
                 <span className="text-[10px] uppercase font-bold tracking-widest p-2">Close</span>
               </button>
            </div>
            <div className="space-y-4">
              <Badge className="bg-vision-accent/10 text-vision-accent border-none font-bold uppercase tracking-widest text-[9px]">
                {selectedMarker.category} Segment
              </Badge>
              <div>
                <h4 className="font-bold uppercase tracking-tight text-base leading-tight group-hover:text-vision-accent transition-colors">Frequent voltage surge issues detected</h4>
                <p className="text-[10px] text-vision-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                  <MapPin size={12} className="text-vision-accent" /> Hill View Area, Block C
                </p>
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold text-vision-slate-400 tracking-widest">Status</span>
                  <Badge className={cn(
                    "text-[9px] font-bold uppercase px-3 border-none",
                    selectedMarker.status === 'Resolved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    selectedMarker.status === 'Under Review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  )}>
                    {selectedMarker.status}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full text-xs">View History</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card className="p-10 text-center glass border-dashed border-black/10 dark:border-white/10 rounded-3xl">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 text-vision-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-black/5 dark:border-white/5 shadow-lg shadow-blue-500/5">
             <Info size={32} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest">Select Point</p>
          <p className="text-[9px] text-vision-slate-400 font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">Select a marker on the map to view detailed analytics.</p>
        </Card>
      )}

      <Card className="p-6 border-black/5 dark:border-white/5">
        <h5 className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest mb-6">Nearby Feed</h5>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-vision-accent shrink-0 border-black/5 dark:border-white/5 group-hover:bg-vision-accent/10 transition-colors shadow-lg shadow-blue-500/5">
                <MapPin size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[11px] uppercase tracking-tight truncate">Grid Alert: Fluid Leak</p>
                <p className="text-[9px] font-bold text-vision-slate-400 uppercase tracking-widest mt-1">1{i}0m Awareness • Active</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
