import { Card, SectionTitle, Button, MotionCard } from '@/src/components/ui';
import { Camera, MapPin, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CATEGORIES } from '@/src/constants';

export default function StepForm({ selectedCategory, setSelectedCategory, handleNext, isSubmitting }) {
  return (
    <MotionCard>
      <Card className="p-8 md:p-10 space-y-10 border-black/5 dark:border-white/5">
        <SectionTitle subtitle="Provide details for rapid resolution.">
          Observation Data
        </SectionTitle>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300",
                    selectedCategory === cat.id
                      ? "border-vision-accent bg-vision-accent/10 shadow-lg shadow-blue-500/10 scale-[1.05]"
                      : "glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:border-black/10 dark:hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    selectedCategory === cat.id ? "bg-vision-accent text-white shadow-lg" : "bg-black/5 dark:bg-white/5"
                  )}>
                    <Plus size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Observation Log</label>
            <textarea
              rows={4}
              placeholder="Insert detailed description here..."
              className="w-full px-5 py-4 glass border-none rounded-2xl focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all resize-none text-sm placeholder:text-vision-slate-400 font-medium"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] ml-1">Visual Evidence</label>
            <div className="flex gap-4">
              <button className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:border-vision-accent/50 hover:text-vision-accent transition-all duration-300 group">
                <Camera size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] mt-2 font-bold uppercase tracking-widest">Add Media</span>
              </button>
            </div>
          </div>

          <div className="p-5 glass border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-vision-accent/10 text-vision-accent rounded-xl border border-vision-accent/10">
                <MapPin size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest">Context Location</h5>
                <p className="text-[9px] font-bold text-vision-slate-400 uppercase tracking-widest mt-1">Sector 4 Area Detected</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-vision-accent font-bold text-[10px] uppercase tracking-widest">Verify</Button>
          </div>
        </div>

        <Button 
          onClick={handleNext} 
          isLoading={isSubmitting}
          size="lg"
          className="w-full"
        >
          Submit Observation
        </Button>
      </Card>
    </MotionCard>
  );
}
