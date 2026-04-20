import React, { useState } from 'react';
import { Card, SectionTitle, Button, MotionCard, Badge } from '@/src/components/ui';
import { Search, MapPin, Camera, CheckCircle, AlertCircle, ChevronRight, FileText, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CATEGORIES } from '@/src/constants';

export default function FileComplaint() {
  const [step, setStep] = useState('DETERMINATION');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock duplicate data
  const duplicates = [
    { id: '342', title: 'Streetlight out', location: '12th Cross, Sector 4', status: 'Under Review' },
    { id: '112', title: 'Low voltage issues', location: 'Sector 4', status: 'Resolved' },
  ];

  const handleNext = () => {
    if (step === 'DETERMINATION') setStep('FORM');
    else if (step === 'FORM') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('CONFIRMATION');
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 lg:py-12 pb-24">
      {/* Step Progress */}
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

      {step === 'DETERMINATION' && (
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
      )}

      {step === 'FORM' && (
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
      )}

      {step === 'CONFIRMATION' && (
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
      )}
    </div>
  );
}
