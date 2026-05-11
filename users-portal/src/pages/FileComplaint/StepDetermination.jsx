import { Card, SectionTitle, Button, MotionCard, Badge } from '@/src/components/ui';
import { Search, AlertCircle, ChevronRight } from 'lucide-react';

export default function StepDetermination({ searchQuery, setSearchQuery, handleNext, duplicates }) {
  return (
    <MotionCard>
      <Card className="p-8 md:p-10 border-black/5 dark:border-white/5">
        <SectionTitle subtitle="Check if this issue has already been reported in your area.">
          Conflict Detection
        </SectionTitle>
        
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-slate-400" />
          <input
            type="text"
            placeholder="Analyze issue... (e.g. Broken pipe)"
            className="w-full pl-12 pr-4 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all text-sm placeholder:text-vision-slate-400 uppercase tracking-tight font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery.length > 2 && (
          <div className="mt-10 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <p className="text-[10px] font-bold text-amber-500 flex items-center gap-2 uppercase tracking-[0.2em]">
              <AlertCircle size={14} className="text-amber-500" />
              Potential Overlap Detected
            </p>
            {duplicates.map((dup) => (
              <div key={dup.id} className="p-5 rounded-2xl glass border-amber-500/20 bg-amber-500/5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-tight truncate">{dup.title}</p>
                  <p className="text-[10px] text-vision-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{dup.location}</p>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold shrink-0">
                  {dup.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4">
          <Button onClick={handleNext} size="lg">
            Continue Setup
            <ChevronRight size={18} />
          </Button>
          <Button variant="outline" className="w-full text-vision-slate-400">
            Follow Existing Entry
          </Button>
        </div>
      </Card>
    </MotionCard>
  );
}
