import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Map as MapIcon, 
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Droplet,
  MoreHorizontal,
  Flame,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { mockComplaint, mockExpertise } from '@/mockData';
import { cn } from '@/lib/utils';

// Helper for Stat Card
const StatCard = ({ label, value, subtext, color, icon: Icon, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="flex-1"
  >
    <Card className="border-border bg-card stat-card h-full">
      <CardContent className="p-4 flex flex-col gap-1">
        <div className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5", 
           color === 'red' ? 'text-civic-red' : 
           color === 'orange' ? 'text-civic-orange' : 
           color === 'green' ? 'text-civic-green' : 'text-civic-cyan'
        )}>
          {color === 'red' ? '🔴' : color === 'orange' ? '🟡' : color === 'green' ? '🟢' : '⏱️'} {label}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs text-text-muted font-normal">{subtext}</span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Top Stats Row */}
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        <StatCard label="3 URGENT" value="+2" subtext="Today" color="red" icon={Flame} i={0} />
        <StatCard label="5 ASSIGNED" value="82%" subtext="Active" color="orange" icon={Users} i={1} />
        <StatCard label="12 RESOLVED" value="92" subtext="Success" color="green" icon={CheckCircle2} i={2} />
        <StatCard label="4.2h AVG TIME" value="-18%" subtext="Target" color="cyan" icon={Clock} i={3} />
      </div>

      {/* Hero: Priority Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-t-4 border-t-civic-red priority-card-gradient overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-civic-red/10 text-civic-red border-civic-red/20 font-bold text-[10px]">CRITICAL</Badge>
                  <span className="font-mono text-[10px] text-text-muted">{mockComplaint.id}</span>
                  <div className="flex items-center gap-1 text-[10px] text-civic-purple font-medium">
                    <span>⛓️</span> Verified
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Water Supply: Main pipe burst, Sector 4
                </CardTitle>
                <CardDescription className="text-text-secondary mt-1 max-w-2xl">
                  Resident report: "No water for 3 days, structural leakage suspected in ward cluster."
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-text-muted font-bold tracking-wider uppercase">DSS ESCALATION RISK</div>
                <div className="text-4xl font-bold text-civic-red">87%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-secondary/40 p-3 rounded-xl flex items-center gap-2 text-sm border border-border/10">
                <span>⏱️</span> <span className="text-text-muted">ETA:</span> <span className="font-semibold">6 hours</span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl flex items-center gap-2 text-sm border border-border/10">
                <span>💰</span> <span className="text-text-muted">Budget:</span> <span className="font-semibold">₹3,500</span>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl flex items-center gap-2 text-sm border border-border/10">
                <span>👤</span> <span className="text-text-muted">Vendor:</span> <span className="font-semibold">R.K. Plumbing</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate(`/plans/${mockComplaint.id}`)}
                className="bg-primary text-primary-foreground font-bold px-6 h-11 hover:brightness-110 rounded-full"
              >
                🚀 START RESOLUTION
              </Button>
              <Button variant="outline" className="border-border bg-transparent text-foreground font-bold px-6 h-11 hover:bg-secondary/50 rounded-full">
                📋 VIEW PLAYBOOK
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/40 py-3 px-6 text-xs text-muted-foreground italic flex gap-2 items-center">
            <BrainCircuit className="w-3 h-3 text-civic-cyan" />
            AI TIP: "60% of Sector 4 leaks are main valve issues. Check valve first."
          </CardFooter>
        </Card>
      </motion.div>

      {/* Bottom Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap Placeholder */}
        <Card className="overflow-hidden h-[450px] flex flex-col">
          <CardHeader className="bg-card/50 border-b">
            <div className="flex justify-between items-center text-xs">
               <div className="flex items-center gap-2">
                 <CardTitle className="text-base">Department Heatmap</CardTitle>
                 <Badge variant="outline" className="text-civic-red border-civic-red/30">3 RED ZONES</Badge>
               </div>
               <Button variant="ghost" size="sm" onClick={() => navigate('/map')} className="h-7 text-[10px] gap-1">
                 OPEN FULL MAP <ArrowUpRight className="w-3 h-3" />
               </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-0 relative bg-secondary/20 flex items-center justify-center">
            {/* Real Map will be integrated in MapView, this is dashboard preview */}
            <div className="absolute inset-0 grayscale opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-73.9,40.7,12/800x600?access_token=pk.placeholder')] bg-cover" />
            <div className="z-10 text-center space-y-4">
               <div className="flex flex-wrap justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-civic-red/30 animate-pulse flex items-center justify-center border border-civic-red">
                    <span className="text-xs font-bold text-civic-red">S4</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-civic-red/30 animate-pulse flex items-center justify-center border border-civic-red">
                    <span className="text-xs font-bold text-civic-red">S7</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-civic-orange/30 flex items-center justify-center border border-civic-orange">
                    <span className="text-xs font-bold text-civic-orange">S5</span>
                  </div>
               </div>
               <p className="text-xs text-muted-foreground font-medium">Sector 4, 7 cluster under heavy escalation risk</p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="h-[450px] flex flex-col">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="text-base">Officer Performance Matrix</CardTitle>
            <CardDescription>AI-benchmarked against departmental KPIs</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow p-0 flex items-center justify-center">
             <div className="w-full h-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                  { subject: 'Velocity', A: 95, full: 100 },
                  { subject: 'Resolution', A: 92, full: 100 },
                  { subject: 'Integrity', A: 100, full: 100 },
                  { subject: 'Vendor Mgmt', A: 78, full: 100 },
                  { subject: 'Accuracy', A: 85, full: 100 },
                  { subject: 'Escalation', A: 90, full: 100 },
                ]}>
                  <PolarGrid stroke="var(--border)" opacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
             </div>
          </CardContent>
          <CardFooter className="bg-secondary/40 p-4 border-t gap-12 text-center justify-center">
             <div>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">Velocity</p>
               <p className="text-lg font-bold font-mono text-civic-cyan">4.2h</p>
             </div>
             <div>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">Success Rate</p>
               <p className="text-lg font-bold font-mono text-civic-green">92%</p>
             </div>
             <div>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">Streak</p>
               <p className="text-lg font-bold font-mono text-civic-orange">8 Resolved</p>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
