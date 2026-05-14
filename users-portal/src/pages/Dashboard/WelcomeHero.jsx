import { Card, MotionCard, Button } from '@/src/components/ui';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeHero() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <MotionCard className="lg:col-span-12">
        <Card className="p-0 border-none relative min-h-[300px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/vision/1200/400?blur=1" 
              alt="Community" 
              className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/80 to-transparent"></div>
          </div>
          <div className="relative z-10 p-8 md:p-12 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-vision-slate-400 mb-2">Welcome back,</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-4">Arjun Singh</h2>
            <p className="text-base text-slate-500 dark:text-vision-slate-400 leading-relaxed mb-8 max-w-md">
              Glad to see you again! Your area reporting activity is up by 15% this month. Keep up the great work helping our community.
            </p>
            <Button onClick={() => navigate('/register')} size="lg" className="shadow-vision-accent/20">
              Register Observation
              <ArrowRight size={18} />
            </Button>
          </div>
          <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 opacity-20">
            <div className="w-full h-full rounded-full bg-vision-accent blur-[100px] animate-pulse"></div>
          </div>
        </Card>
      </MotionCard>
    </div>
  );
}
