import { Card, SectionTitle, MotionCard, Button, Badge } from '@/src/components/ui';
import { Droplets, Zap, Shield, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, formatDate, cn } from '@/src/lib/utils';

const MOCK_SUMMARY = [
  { label: 'Active Tickets', value: '14', color: 'text-white', trend: '3 new today', trendColor: 'text-orange-400' },
  { label: 'In Progress', value: '08', color: 'text-white', trend: 'Avg. 4.2 days', trendColor: 'text-vision-accent' },
  { label: 'Resolved', value: '142', color: 'text-white', trend: '94% success rate', trendColor: 'text-green-400' },
];

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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase invisible lg:visible h-0 lg:h-auto">Dashboard</h1>
          <div className="mb-2 lg:hidden">
             <h1 className="text-2xl font-bold uppercase">Dashboard</h1>
             <p className="text-[10px] uppercase font-bold text-vision-slate-400 tracking-widest mt-1">District 7 Overview</p>
          </div>
        </div>
      </div>

      {/* Hero Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Section */}
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-4">Marcus Holloway</h2>
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

      {/* Summary Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Activity Feed */}
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

        {/* Data/Trends Sidebar View */}
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
      </div>
    </div>
  );
}
