import React from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { mockPredictions, mockExpertise, mockPeers } from '@/mockData';
import { cn } from '@/lib/utils';

const DSSPage = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BrainCircuit className="text-civic-cyan w-8 h-8" />
            DSS Engine
          </h1>
          <p className="text-muted-foreground mt-1">Decision Support System: Prediction, Optimization & Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2 hidden sm:block">
            <p className="text-xs text-muted-foreground">Engine Status</p>
            <p className="text-sm font-medium text-civic-green">OPERATIONAL</p>
          </div>
          <Badge className="bg-civic-cyan/10 text-civic-cyan border-civic-cyan/20 px-3 py-1">
            <Zap className="w-3 h-3 mr-1" /> AI LIVE
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="bg-secondary/30 border border-border p-1 rounded-xl">
          <TabsTrigger value="predictions" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <AlertCircle className="w-4 h-4" /> Crisis Predictions
          </TabsTrigger>
          <TabsTrigger value="workload" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <TrendingUp className="w-4 h-4" /> Workload Optimizer
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">
            <Users className="w-4 h-4" /> Skill Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="border-destructive/20 bg-destructive/5 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Active Risk Monitoring (Next 24 Hours)
              </CardTitle>
              <CardDescription>AI-identified critical patterns based on current grievance flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPredictions.map((pred, i) => (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-background/80",
                    pred.probability === 'HIGH' 
                      ? "border-civic-red bg-background/60 shadow-[0_0_15px_rgba(255,71,87,0.1)]" 
                      : "border-border bg-background/40 hover:border-civic-orange/50"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        pred.probability === 'HIGH' ? "bg-civic-red" : "bg-civic-orange",
                        "text-white px-2 py-0"
                      )}>
                        {pred.probability} PROBABILITY
                      </Badge>
                      <span className="text-sm font-semibold">{pred.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3" /> Confidence: {pred.confidence}%</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Affected: ~{pred.affected} citizens</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground">"Trigger: {pred.trigger}"</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="rounded-full">VIEW DETAILS</Button>
                    <Button size="sm" className={pred.probability === 'HIGH' ? "bg-destructive text-white hover:bg-destructive/90 rounded-full" : "bg-primary text-white rounded-full"}>
                      {pred.probability === 'HIGH' ? 'ALERT SUPERVISOR' : 'PREPARE CONTINGENCY'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Workload Optimization Flow</CardTitle>
                <CardDescription>Real-time caseload balancing across officers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">YOUR CURRENT LOAD</p>
                      <p className="text-2xl font-bold">80% <span className="text-sm font-normal text-muted-foreground">(6/8 active cases)</span></p>
                    </div>
                    <Badge variant="outline" className="text-civic-red border-civic-red/30">CRITICAL LIMIT</Badge>
                  </div>
                  <Progress value={80} className="h-3 bg-secondary" indicatorColor="bg-civic-orange" />
                  
                  <div className="flex items-center gap-8 py-4 border-y border-border/50">
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-muted-foreground">DEPARTMENT AVERAGE</p>
                      <div className="flex items-center gap-3">
                        <Progress value={60} className="h-2 bg-secondary" />
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-muted-foreground">TEAM VELOCITY</p>
                      <p className="text-lg font-bold">4.2 cases/day</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <BrainCircuit className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">AI RECOMMENDATION:</h4>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        "You are 40% over usual water case load. AI recommends auto-reassigning 2 non-critical cases to 
                        <span className="font-bold px-1">Officer Gupta</span> who has capacity + 3 similar past resolutions 
                        in Sector 4."
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground rounded-full">OVERRIDE</Button>
                    <Button size="sm" className="bg-primary text-primary-foreground font-bold tracking-tight rounded-full px-4">ACCEPT REASSIGNMENT</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
                <CardDescription>Sector distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { sector: 'Sector 4', load: 65, color: 'bg-civic-red' },
                  { sector: 'Sector 5', load: 30, color: 'bg-civic-green' },
                  { sector: 'Sector 7', load: 85, color: 'bg-civic-orange' },
                ].map((s) => (
                  <div key={s.sector} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>{s.sector}</span>
                      <span className="font-mono">{s.load}%</span>
                    </div>
                    <Progress value={s.load} className="h-1.5" indicatorColor={s.color} />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full text-xs h-8">GENERATE LOAD REPORT</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-card/30">
                <CardTitle>Expertise Vector</CardTitle>
                <CardDescription>Officer competence mapping across domains</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center">
                <div className="w-full h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockExpertise}>
                      <PolarGrid stroke="var(--border)" opacity={0.3} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                      <Radar
                        name="Competence"
                        dataKey="score"
                        stroke="var(--primary)"
                        fill="var(--primary)"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/30 p-4 border-t">
                 <div className="flex items-center gap-3 w-full">
                    <div className="bg-civic-cyan/10 p-2 rounded flex-shrink-0">
                      <Zap className="w-4 h-4 text-civic-cyan" />
                    </div>
                    <p className="text-xs italic text-muted-foreground italic">
                      "Your road case velocity is 40% slower. Consider shadowing Officer Rao for infrastructure assessment."
                    </p>
                 </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peer-Led Benchmarking</CardTitle>
                <CardDescription>Department ranking based on AI resolution index</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockPeers.map((peer, i) => (
                    <div key={peer.name} className="p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                          i === 0 ? "bg-civic-cyan/20 text-civic-cyan" : "bg-secondary text-muted-foreground"
                        )}>
                          #{peer.rank}
                        </div>
                        <div>
                          <p className="font-semibold">{peer.name}</p>
                          <p className="text-xs text-muted-foreground">{peer.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-right">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">AVG TIME</p>
                          <p className="text-sm font-mono text-civic-cyan">{peer.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">SUCCESS</p>
                          <p className="text-sm font-mono text-civic-green">{peer.success}</p>
                        </div>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t py-6">
                <Button variant="link" className="text-civic-cyan gap-2">
                  VIEW FULL DEPARTMENT ANALYTICS <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DSSPage;
