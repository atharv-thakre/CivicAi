import { Card, MotionCard } from '@/src/components/ui';
import { cn } from '@/src/lib/utils';

const MOCK_SUMMARY = [
  { label: 'Active Tickets', value: '14', color: 'text-white', trend: '3 new today', trendColor: 'text-orange-400' },
  { label: 'In Progress', value: '08', color: 'text-white', trend: 'Avg. 4.2 days', trendColor: 'text-vision-accent' },
  { label: 'Resolved', value: '142', color: 'text-white', trend: '94% success rate', trendColor: 'text-green-400' },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_SUMMARY.map((stat, i) => (
        <MotionCard key={stat.label} transition={{ delay: i * 0.1 }}>
          <Card className="p-5 border-black/5 dark:border-white/5 active:scale-[0.98] transition-transform">
            <p className="text-vision-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <div className={cn("mt-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1", stat.trendColor)}>
              {stat.trend}
            </div>
          </Card>
        </MotionCard>
      ))}
      <MotionCard transition={{ delay: 0.3 }}>
        <Card className="p-5 border-black/5 dark:border-white/5 bg-vision-accent/5 dark:bg-vision-accent/10 border-vision-accent/20">
          <p className="text-vision-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Community Score</p>
          <h3 className="text-2xl font-bold text-vision-accent">842</h3>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">
            Top 5% contributors
          </div>
        </Card>
      </MotionCard>
    </div>
  );
}
