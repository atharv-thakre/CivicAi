import { Card, Button, MotionCard } from '@/src/components/ui';
import { CheckCircle } from 'lucide-react';

export default function StepConfirmation({ setStep }) {
  return (
    <MotionCard>
      <Card className="p-10 text-center space-y-8 border-black/5 dark:border-white/5 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vision-accent to-transparent"></div>
        <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20 border border-green-500/20">
          <CheckCircle size={48} className="animate-in zoom-in duration-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Report Received</h2>
          <p className="text-vision-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-loose">
            Data initialized successfully. Your report is now active in the system.
          </p>
        </div>
        
        <div className="py-6 px-10 glass rounded-3xl inline-block">
          <p className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-[0.3em] mb-1">Ticket Reference</p>
          <p className="text-2xl font-bold text-vision-accent tracking-tighter uppercase">#VX-829472</p>
        </div>

        <div className="pt-6 flex flex-col gap-4">
          <Button onClick={() => window.location.href = '/complaints'} size="lg">
            View Status
          </Button>
          <Button variant="outline" onClick={() => setStep('DETERMINATION')} className="w-full text-vision-slate-400 text-xs font-bold uppercase tracking-widest">
            New Report
          </Button>
        </div>
      </Card>
    </MotionCard>
  );
}
