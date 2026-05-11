import React from 'react';
import { Search, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function StepProgress({ step }) {
  return (
    <div className="flex items-center justify-between mb-12 px-6">
      {[
        { icon: Search, label: 'Search' },
        { icon: FileText, label: 'Details' },
        { icon: CheckCircle, label: 'Done' }
      ].map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg",
              (i === 0 && step === 'DETERMINATION') || (i === 1 && step === 'FORM') || (i === 2 && step === 'CONFIRMATION')
                ? "bg-vision-accent border-vision-accent text-white shadow-blue-500/20"
                : i < (step === 'DETERMINATION' ? 0 : step === 'FORM' ? 1 : 2)
                  ? "bg-green-500 border-green-500 text-white"
                  : "glass border-black/5 dark:border-white/5 text-vision-slate-400"
            )}>
              <s.icon size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">{s.label}</span>
          </div>
          {i < 2 && <div className="flex-1 h-px bg-black/5 dark:bg-white/5 mx-6 -mt-8" />}
        </React.Fragment>
      ))}
    </div>
  );
}
