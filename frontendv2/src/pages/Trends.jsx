import { Card, SectionTitle, Badge, MotionCard } from '@/src/components/ui';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const TREND_DATA = [
  { month: 'Jan', Water: 40, Electricity: 24, Sanitation: 20 },
  { month: 'Feb', Water: 30, Electricity: 13, Sanitation: 22 },
  { month: 'Mar', Water: 20, Electricity: 98, Sanitation: 22 },
  { month: 'Apr', Water: 27, Electricity: 39, Sanitation: 20 },
  { month: 'May', Water: 18, Electricity: 48, Sanitation: 21 },
  { month: 'Jun', Water: 23, Electricity: 38, Sanitation: 25 },
];

const CATEGORY_DATA = [
  { name: 'Water', value: 400, color: '#2563EB' },
  { name: 'Electricity', value: 300, color: '#EAB308' },
  { name: 'Sanitation', value: 300, color: '#22C55E' },
  { name: 'Roads', value: 200, color: '#F97316' },
  { name: 'Safety', value: 100, color: '#EF4444' },
];

export default function Trends() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionTitle subtitle="Analyze civic issues and distribution trends.">
          Civic Trends
        </SectionTitle>
        <div className="flex glass p-1 rounded-2xl border-black/5 dark:border-white/5">
          <button className="px-5 py-2 text-[10px] font-bold bg-vision-accent text-white rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/20">Weekly</button>
          <button className="px-5 py-2 text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest hover:text-slate-700 dark:hover:text-white transition-colors">Monthly</button>
          <button className="px-5 py-2 text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest hover:text-slate-700 dark:hover:text-white transition-colors">Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Bar Chart */}
        <MotionCard transition={{ delay: 0.1 }}>
          <Card className="p-6 border-black/5 dark:border-white/5 shadow-none">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <TrendingUp size={18} className="text-vision-accent" />
                Monthly Volume
              </h4>
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-none font-bold">↑ 12.4%</Badge>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#a0aec0', fontSize: 10, fontWeight: 700 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#a0aec0', fontSize: 10, fontWeight: 700 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,117,255,0.02)' }}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderRadius: '16px', 
                      border: '1px solid var(--border)', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      color: 'var(--text)'
                    }}
                    itemStyle={{ color: 'var(--text)', fontSize: '12px' }}
                  />
                  <Bar dataKey="Water" fill="#0075ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Electricity" fill="#31cdec" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </MotionCard>

        {/* Category Distribution Area Chart / Pie */}
        <MotionCard transition={{ delay: 0.2 }}>
          <Card className="p-6 border-black/5 dark:border-white/5 shadow-none">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-8">Resolution Rate</h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorResolution" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0075ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0075ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--text)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Sanitation" 
                    stroke="#0075ff" 
                    fillOpacity={1} 
                    fill="url(#colorResolution)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </MotionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Resolution', value: '4.2 Days', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Active Users', value: '+1,280', icon: TrendingUp, color: 'text-vision-accent', bg: 'bg-vision-accent/10' },
          { label: 'Success Rate', value: '92%', icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Recurrent', value: 'Energy', icon: Trash2, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((item, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 p-6 border-black/5 dark:border-white/5">
          <h4 className="font-bold mb-8 text-xs uppercase tracking-widest">Categories</h4>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {CATEGORY_DATA.map((entry) => (
              <div key={entry.name} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-vision-slate-400">{entry.name}</span>
                </div>
                <span>{entry.value} pts</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 border-black/5 dark:border-white/5 flex flex-col">
          <div className="relative z-10 flex-1">
            <h4 className="font-bold mb-2 text-xs uppercase tracking-widest">District Metrics</h4>
            <p className="text-[10px] text-vision-slate-400 font-bold uppercase tracking-widest mb-10">Sector-wide performance</p>
            
            <div className="space-y-8">
              {[
                { name: 'District 4', status: 'Optimal', val: 95 },
                { name: 'Downtown', status: 'Warning', val: 42 },
                { name: 'Green Woods', status: 'Optimal', val: 88 },
                { name: 'Riverside B', status: 'Critical', val: 25 },
              ].map((area) => (
                <div key={area.name}>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h6 className="text-[11px] font-bold leading-none uppercase tracking-widest">{area.name}</h6>
                      <p className={cn(
                        "text-[9px] font-bold uppercase mt-1.5 tracking-[0.2em]",
                        area.val > 80 ? 'text-green-500' : area.val > 40 ? 'text-amber-500' : 'text-red-500'
                      )}>{area.status}</p>
                    </div>
                    <span className="text-xs font-bold">{area.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${area.val}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full shadow-lg",
                        area.val > 80 ? 'bg-green-500 shadow-green-500/20' : area.val > 40 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-red-500 shadow-red-500/20'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
