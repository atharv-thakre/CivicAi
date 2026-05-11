import { Card, MotionCard } from '@/src/components/ui';
import { TrendingUp, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const METRICS = [
  { label: 'Avg Resolution', value: '4.2 Days', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Active Users', value: '+1,280', icon: TrendingUp, color: 'text-vision-accent', bg: 'bg-vision-accent/10' },
  { label: 'Success Rate', value: '92%', icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Recurrent', value: 'Energy', icon: Trash2, color: 'text-red-500', bg: 'bg-red-500/10' },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((item, i) => (
        <MotionCard key={item.label} transition={{ delay: 0.3 + i * 0.1 }}>
          <Card className="p-5 flex items-center gap-4 border-black/5 dark:border-white/5 active:scale-[0.98] transition-transform">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-black/5 dark:border-white/5", item.bg, item.color)}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-vision-slate-400 tracking-[0.2em] leading-none">{item.label}</p>
              <p className="text-xl font-bold mt-2">{item.value}</p>
            </div>
          </Card>
        </MotionCard>
      ))}
    </div>
  );
}
