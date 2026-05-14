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
  BrainCircuit,
  Loader2,
  Zap,
  ClipboardList
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
import { useApp } from '@/context/AppContext';

const StatCard = ({ label, value, subtext, color, icon: Icon, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="flex-1"
  >
    <Card className="border-border bg-card stat-card h-full group hover:shadow-md transition-all duration-300">
      <CardContent className="p-4 flex flex-col gap-1">
        <div className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5", 
           color === 'red' ? 'text-civic-red' : 
           color === 'orange' ? 'text-civic-orange' : 
           color === 'green' ? 'text-civic-green' : 'text-civic-cyan'
        )}>
          <Icon className="w-4 h-4" /> {label}
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
  const { state, dispatch } = useApp();
  const [complaints, setComplaints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://app.totalchaos.online/complaint/all');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setComplaints(data);
        dispatch({ type: 'SET_COMPLAINTS', payload: data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-bold tracking-tight text-foreground uppercase animate-pulse">
          Synchronizing Civic Dashboard...
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Accessing Blockchain Ledger v4.2</p>
      </div>
    );
  }

  const urgentCount = complaints.filter(c => c.is_urgent).length;
  const assignedCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  
  // Use the latest urgent complaint for the hero card
  const latestUrgent = complaints.filter(c => c.is_urgent).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || complaints[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Top Stats Row */}
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        <StatCard label={`${urgentCount} URGENT`} value={urgentCount > 0 ? `+${urgentCount}` : '0'} subtext="High Priority" color="red" icon={Flame} i={0} />
        <StatCard label={`${assignedCount} ACTIVE`} value={assignedCount} subtext="Assigned" color="orange" icon={Users} i={1} />
        <StatCard label={`${resolvedCount} RESOLVED`} value={resolvedCount} subtext="Total" color="green" icon={CheckCircle2} i={2} />
        <StatCard label="94% SUCCESS" value="-2.1h" subtext="Efficiency" color="cyan" icon={Clock} i={3} />
      </div>

      {/* Hero: Priority Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {latestUrgent ? (
          <Card className={cn(
            "border-t-4 priority-card-gradient overflow-hidden",
            latestUrgent.is_urgent ? "border-t-civic-red" : "border-t-primary"
          )}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={cn(
                      "font-bold text-[10px]",
                      latestUrgent.is_urgent ? "bg-civic-red/10 text-civic-red border-civic-red/20" : "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {latestUrgent.is_urgent ? 'CRITICAL' : latestUrgent.status.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-[10px] text-text-muted">GR-{new Date(latestUrgent.created_at).getFullYear()}-{String(latestUrgent.ref).padStart(4, '0')}</span>
                    <div className="flex items-center gap-1 text-[10px] text-civic-purple font-medium">
                      <span>⛓️</span> Verified
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {latestUrgent.title}
                  </CardTitle>
                  <CardDescription className="text-text-secondary mt-1 max-w-2xl line-clamp-2">
                    {latestUrgent.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-text-muted font-bold tracking-wider uppercase">AI PRIORITY SCORE</div>
                  <div className={cn(
                    "text-4xl font-bold",
                    latestUrgent.internal_priority >= 7 ? "text-civic-red" : "text-civic-orange"
                  )}>
                    {latestUrgent.internal_priority ? (latestUrgent.internal_priority * 10).toFixed(0) : '75'}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary/40 p-3 rounded-xl flex items-center gap-2 text-sm border border-border/10">
                  <Clock className="w-4 h-4 text-primary" /> <span className="text-text-muted">ETA:</span> <span className="font-semibold">{latestUrgent.action_plan?.eta || '2 hours'}</span>
                </div>
                <div className="bg-secondary/40 p-3 rounded-xl flex items-center gap-2 text-sm border border-border/10">
                  <AlertCircle className="w-4 h-4 text-civic-orange" /> <span className="text-text-muted">Sector:</span> <span className="font-semibold">{latestUrgent.address?.split(',').pop()?.trim() || latestUrgent.pincode}</span>
                </div>
                <div className="bg-secondary/40 p-3 rounded-xl flex items-center gap-2 text-sm border border-border/10">
                  <Droplet className="w-4 h-4 text-civic-cyan" /> <span className="text-text-muted">Category:</span> <span className="font-semibold uppercase text-[10px]">{latestUrgent.category}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate(`/plans/${latestUrgent.ref}`)}
                  className="bg-primary text-primary-foreground font-bold px-6 h-11 hover:brightness-110 rounded-full gap-2"
                >
                  <Zap className="w-4 h-4" /> START RESOLUTION
                </Button>
                <Button variant="outline" className="border-border bg-transparent text-foreground font-bold px-6 h-11 hover:bg-secondary/50 rounded-full gap-2">
                  <ClipboardList className="w-4 h-4" /> VIEW PLAYBOOK
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/40 py-3 px-6 text-xs text-muted-foreground italic flex gap-2 items-center">
              <BrainCircuit className="w-3 h-3 text-civic-cyan" />
              AI TIP: "{latestUrgent.action_plan?.root_cause || 'Analyze root cause before dispatch.'}"
            </CardFooter>
          </Card>
        ) : (
          <div className="text-center py-10 bg-secondary/20 rounded-3xl border border-dashed border-border/50">
            <p className="text-muted-foreground">No pending grievances detected in system.</p>
          </div>
        )}
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
