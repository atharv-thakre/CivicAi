import { Card, SectionTitle, MotionCard, Button, Badge } from '@/src/components/ui';
import { Droplets, Zap, Shield, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, formatDate, cn } from '@/src/lib/utils';

const RECENT_ACTIVITIES = [
  {
    id: 'CIV-8842',
    title: 'Water Main Burst - Oak St',
    category: 'Water Supply',
    status: 'In Progress',
    date: '2024-03-20T10:00:00Z',
    location: 'Sector 4',
  },
  {
    id: 'CIV-8839',
    title: 'Street Lighting Outage',
    category: 'Electricity',
    status: 'Resolved',
    date: '2024-03-16T11:00:00Z',
    location: 'Riverside Dr',
  },
  {
    id: 'CIV-8831',
    title: 'Garbage Collection Delay',
    category: 'Sanitation',
    status: 'Filed',
    date: '2024-03-10T08:00:00Z',
    location: 'Park View Circle',
  },
];

export default function RecentActivities() {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-3 space-y-6">
      <SectionTitle subtitle="Track progress on your and nearby reports">Recent Insights</SectionTitle>
      <div className="space-y-4">
        {RECENT_ACTIVITIES.map((activity, i) => (
          <MotionCard key={activity.id} transition={{ delay: 0.3 + i * 0.1 }}>
            <Card className="p-0 border-black/5 dark:border-white/5 group hover:border-black/10 dark:hover:border-white/20 transition-all">
              <div className="p-5 flex gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  "bg-black/5 dark:bg-white/10 dark:text-white text-slate-800 border border-black/5 dark:border-white/10"
                )}>
                  {activity.category === 'Electricity' ? <Zap size={20} /> : 
                   activity.category === 'Water Supply' ? <Droplets size={20} /> : 
                   <Shield size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold truncate group-hover:text-vision-accent transition-colors uppercase tracking-wide">
                        {activity.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest">ID {activity.id}</span>
                        <span className="w-1 h-1 rounded-full bg-black/5 dark:bg-white/10"></span>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-vision-slate-600">{formatDate(activity.date)}</span>
                      </div>
                    </div>
                    <Badge className={cn(
                      getStatusColor(activity.status), 
                      "shrink-0 border-none bg-opacity-20",
                      activity.status === 'Resolved' ? 'bg-green-500 text-green-600 dark:text-green-400' :
                      activity.status === 'In Progress' ? 'bg-amber-500 text-amber-600 dark:text-amber-400' :
                      'bg-blue-500 text-blue-600 dark:text-blue-400'
                    )}>
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-vision-slate-400 flex items-center gap-1">
                       <MapPin size={10} /> {activity.location}
                     </span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-vision-accent px-2 py-0.5 rounded-lg bg-vision-accent/10">
                       {activity.category}
                     </span>
                  </div>
                </div>
              </div>
            </Card>
          </MotionCard>
        ))}
      </div>
      <Button variant="outline" className="w-full text-vision-slate-400" onClick={() => navigate('/complaints')}>
        View History Feed
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}
