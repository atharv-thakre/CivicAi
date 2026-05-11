import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Share2, 
  Lock, 
  CheckCircle2, 
  Camera, 
  FileText, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  BrainCircuit,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockComplaint } from '@/mockData';
import { cn } from '@/lib/utils';

const ActionPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Initial Site Assessment', status: 'COMPLETED' },
    { id: 2, title: 'Vendor Dispatch', status: 'IN_PROGRESS' },
    { id: 3, title: 'Implementation', status: 'LOCKED' },
    { id: 4, title: 'Verification & Closure', status: 'LOCKED' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Complaint #{id || 'GR-2026-0042'}</h1>
            <Badge className="bg-destructive text-white uppercase tracking-wider text-[10px] rounded-full px-3">CRITICAL</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-primary/20 text-primary hover:bg-primary/10 gap-2 rounded-full px-5"
            onClick={() => navigate(`/audit/${id || 'GR-2026-0042'}`)}
          >
            <ShieldCheck className="w-4 h-4" /> Verify Blockchain
          </Button>
          <Button variant="outline" size="icon" className="rounded-full"><Share2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Progress Tracker */}
      <Card className="bg-secondary/30 border-border/50 rounded-3xl overflow-hidden shadow-sm">
        <CardContent className="p-8">
          <div className="relative">
            <div className="absolute top-[20px] left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-[20px] left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500" 
              style={{ width: '25%' }} 
            />
            
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all border-2",
                    step.id === 1 ? "bg-civic-green border-civic-green text-white" :
                    step.id === 2 ? "bg-background border-primary text-primary" :
                    "bg-background border-border text-muted-foreground"
                  )}>
                    {step.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> : 
                     step.status === 'LOCKED' ? <Lock className="w-4 h-4" /> : 
                     <span className="font-bold text-sm">{step.id}</span>}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      step.status === 'COMPLETED' ? "text-civic-green" : 
                      step.status === 'IN_PROGRESS' ? "text-primary" : "text-muted-foreground"
                    )}>
                      Step {step.id}
                    </p>
                    <p className="text-sm font-medium mt-0.5 truncate hidden md:block max-w-[150px]">{step.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Step */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-border shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-secondary/30 border-b border-border">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">STEP 1: INITIAL SITE ASSESSMENT</CardTitle>
                  <Badge className="bg-civic-green/10 text-civic-green border-civic-green/20 rounded-full">ACTIVE</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                   {[
                     { text: 'Visit location & photograph leak', done: true },
                     { text: 'Identify source (main valve / household)', done: false },
                     { text: 'Fill Site Inspection Report', done: false },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                          item.done ? "bg-civic-green border-civic-green text-white" : "border-border group-hover:border-primary"
                        )}>
                          {item.done && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                          "text-base group-hover:text-foreground transition-colors",
                          item.done ? "text-muted-foreground line-through" : "text-foreground font-medium"
                        )}>{item.text}</span>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Site_Report_GR0042.pdf</span>
                        <span className="text-[10px] text-muted-foreground">AUTO-GENERATED BY AI</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full"><ExternalLink className="w-4 h-4" /></Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-dashed border-border flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary/50 transition-all">
                    <Camera className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground uppercase tracking-wider">Upload Evidence</span>
                    <span className="text-[10px] text-civic-orange">(REQUIRED: GEO-TAGGED)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-destructive/80 bg-destructive/10 px-3 py-1 rounded-full w-fit">
                  <Clock className="w-3.5 h-3.5" /> DEADLINE: 2 HOURS (AUTO-SET BY AI)
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 border-t p-6">
                <div className="flex flex-wrap gap-3 w-full">
                  <Button className="bg-primary text-white font-bold tracking-tight px-10 h-12 flex-grow sm:flex-grow-0 rounded-full shadow-lg shadow-primary/20">
                    MARK COMPLETE
                  </Button>
                  <Button variant="outline" className="flex-grow sm:flex-grow-0 h-12 border-border rounded-full px-8">REQUEST HELP</Button>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 text-xs font-bold uppercase ml-auto rounded-full">ESCALATE</Button>
                </div>
              </CardFooter>
              {/* AI Insight Overlay */}
              <div className="p-6 bg-primary/5 border-t border-primary/10">
                 <div className="flex items-start gap-4">
                   <div className="bg-primary/20 p-2 rounded-xl">
                     <BrainCircuit className="w-5 h-5 text-primary" />
                   </div>
                   <div className="space-y-4 w-full">
                     <div className="space-y-1">
                       <h4 className="font-bold text-primary text-xs tracking-wider uppercase">AI ENGINE TIP:</h4>
                       <p className="text-sm italic text-foreground/80 leading-relaxed">
                         "60% of Sector 4 leaks are main valve issues. Check valve first before inspecting individual lines."
                       </p>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-secondary text-[8px] flex items-center justify-center font-bold">
                                OFF
                             </div>
                           ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          3 similar cases recently resolved by you (Avg: 4.2 hrs)
                        </p>
                     </div>
                   </div>
                 </div>
              </div>
            </Card>
          </motion.div>

          {/* Locked Step Preview */}
          <Card className="opacity-60 border-border bg-secondary/10">
            <CardHeader className="bg-secondary/20 border-b">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-lg text-muted-foreground">STEP 2: VENDOR DISPATCH (Locked until Step 1 complete)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SUGGESTED VENDOR</p>
                    <p className="text-lg font-bold">R.K. Plumbing <span className="text-xs font-normal text-civic-green">(Response: 2hrs)</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AUTO-APPROVED BUDGET</p>
                    <p className="text-lg font-bold font-mono text-civic-cyan">₹3,500</p>
                  </div>
               </div>
               <div className="space-y-4">
                 <div className="bg-background/40 p-4 rounded-lg flex items-center gap-3 border border-border/50">
                   <FileText className="w-5 h-5 text-muted-foreground" />
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-muted-foreground">Work_Order_GR0042.pdf</span>
                     <span className="text-[8px] text-muted-foreground/60 uppercase">Draft Generated</span>
                   </div>
                   <Button variant="ghost" size="sm" className="ml-auto text-[10px] h-7">PREVIEW</Button>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Risk Flags */}
        <div className="space-y-6">
          <Card className="border-civic-orange/20 shadow-lg">
            <CardHeader className="bg-civic-orange/10 border-b border-civic-orange/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-civic-orange uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Critical Risk Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border">
                 {mockComplaint.riskFlags.map((flag, i) => (
                   <div key={i} className="p-5 flex items-start gap-3 bg-card/40 hover:bg-card transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full bg-civic-orange mt-1.5 shrink-0" />
                      <p className="text-sm text-foreground/90 leading-snug group-hover:text-foreground">
                        {flag}
                      </p>
                   </div>
                 ))}
               </div>
            </CardContent>
            <CardFooter className="bg-civic-orange/5 p-4 border-t border-civic-orange/20">
                 <Button variant="link" className="text-civic-orange p-0 h-auto text-xs font-bold uppercase tracking-tight">
                   View Mitigation Plans
                 </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Related Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-4">
                 {[
                   { user: 'Officer Gupta', action: 'Requested resource in S4', time: '12m ago' },
                   { user: 'Supervisor', action: 'Approved budget extension', time: '45m ago' },
                   { user: 'Citizen', action: 'Sent 2nd followup via IVR', time: '1h ago' },
                 ].map((act, i) => (
                   <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                        {act.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-semibold">{act.action}</p>
                        <span className="text-[10px] text-muted-foreground">{act.time}</span>
                      </div>
                   </div>
                 ))}
               </div>
               <Separator />
               <Button variant="outline" className="w-full text-xs gap-2">
                 <MessageSquare className="w-3 h-3" /> CHANNELS / DISCUSS
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActionPlanDetailPage;
