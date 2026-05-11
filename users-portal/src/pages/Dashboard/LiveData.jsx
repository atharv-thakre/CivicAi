import { Card, SectionTitle, Badge } from '@/src/components/ui';

export default function LiveData() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <SectionTitle>Area Live Data</SectionTitle>
      <Card className="p-6 flex flex-col min-h-[260px] border-black/5 dark:border-white/5">
         <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xs uppercase tracking-widest">Sector Load</h2>
          <Badge className="bg-vision-accent/20 text-vision-accent border-transparent font-bold">Active</Badge>
        </div>
        <div className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center text-slate-400">
           <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-black dark:border-white" />
                ))}
              </div>
           </div>
           <div className="relative z-10 text-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-16 h-16 bg-red-400 rounded-full animate-ping opacity-10"></div>
                <div className="w-4 h-4 bg-red-600 rounded-full shadow-lg shadow-red-500/40"></div>
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em]">Alert: Critical Zone</p>
              <p className="text-[9px] font-bold text-vision-slate-400 uppercase tracking-widest mt-1">Riverside District B</p>
           </div>
           <div className="absolute bottom-4 right-4 glass p-3 border-black/5 dark:border-white/10 rounded-xl shadow-xl">
            <p className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-tighter">Growth</p>
            <p className="text-[14px] font-bold text-red-500">+12.4%</p>
          </div>
        </div>
      </Card>

      <Card className="bg-transparent p-6 border-black/5 dark:border-white/5 overflow-hidden group">
        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Weekly Flux</h4>
        <div className="flex items-end gap-3 h-24">
          <div className="flex-1 bg-black/5 dark:bg-white/10 rounded-xl h-[40%] transition-all group-hover:bg-vision-accent/20"></div>
          <div className="flex-1 bg-black/5 dark:bg-white/10 rounded-xl h-[60%] transition-all group-hover:bg-vision-accent/20"></div>
          <div className="flex-1 bg-black/5 dark:bg-white/10 rounded-xl h-[30%] transition-all group-hover:bg-vision-accent/20"></div>
          <div className="flex-1 bg-vision-accent rounded-xl h-[85%] relative shadow-lg shadow-blue-500/40">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">24</div>
          </div>
          <div className="flex-1 bg-black/5 dark:bg-white/10 rounded-xl h-[50%] transition-all group-hover:bg-vision-accent/20"></div>
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">
          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
        </div>
      </Card>
    </div>
  );
}
