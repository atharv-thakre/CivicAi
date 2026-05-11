import { Card, Badge, MotionCard } from '@/src/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function VolumeChart({ data }) {
  return (
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
            <BarChart data={data}>
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
  );
}
