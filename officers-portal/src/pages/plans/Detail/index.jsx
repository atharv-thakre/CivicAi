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
  Clock,
  Loader2,
  Zap,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const ActionPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = React.useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("complaint_id", String(complaint.ref));
    formData.append("label", "after");
    formData.append("image", file);

    try {
      const response = await fetch('https://app.totalchaos.online/complaint/image', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ledger Rejected Evidence');
      }

      alert('Evidence successfully committed to the Civic Ledger.');
    } catch (err) {
      alert(`Protocol Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    const fetchComplaintDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://app.totalchaos.online/complaint?complaint_id=${id}`);
        if (!response.ok) {
          throw new Error('Complaint Protocol: ID not found in Civic Ledger');
        }
        const data = await response.json();
        setComplaint(data);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-bold tracking-tight animate-pulse uppercase">Accessing Secure Protocol {id}...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Unauthorized Access or Null Record</h2>
          <p className="text-muted-foreground mt-2">{error || "The requested grievance record is unavailable."}</p>
        </div>
        <Button onClick={() => navigate('/dashboard')} className="rounded-full px-8">Return to Dashboard</Button>
      </div>
    );
  }

  const steps = complaint.action_plan?.action_plan?.map((step, index) => ({
    id: index + 1,
    title: step,
    status: index === 0 ? 'IN_PROGRESS' : 'LOCKED'
  })) || [
    { id: 1, title: 'Standard Response Protocol', status: 'IN_PROGRESS' }
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
            <h1 className="text-3xl font-bold">Complaint #{complaint.ref}</h1>
            <Badge className={cn(
              "uppercase tracking-wider text-[10px] rounded-full px-3",
              complaint.is_urgent ? "bg-destructive text-white" : "bg-primary text-white"
            )}>
              {complaint.is_urgent ? 'CRITICAL' : complaint.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-primary/20 text-primary hover:bg-primary/10 gap-2 rounded-full px-5"
            onClick={() => navigate(`/audit/${complaint.ref}`)}
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
              style={{ width: `${(currentStep / steps.length) * 100}%` }} 
            />
            
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center gap-3 flex-1 group cursor-pointer"
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all border-2",
                    step.id < currentStep ? "bg-civic-green border-civic-green text-white" :
                    step.id === currentStep ? "bg-primary border-primary text-white" :
                    "bg-background border-border text-muted-foreground group-hover:border-primary/50"
                  )}>
                    {step.id < currentStep ? <CheckCircle2 className="w-6 h-6" /> : 
                     step.id === currentStep ? <span className="font-bold text-sm">{step.id}</span> :
                     <Lock className="w-4 h-4" />}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      step.id < currentStep ? "text-civic-green" : 
                      step.id === currentStep ? "text-primary" : "text-muted-foreground"
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
          {/* Active Step Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-secondary/30 border-b border-border">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold uppercase">
                    STEP {currentStep}: {steps[currentStep - 1]?.title}
                  </CardTitle>
                  <Badge className="bg-civic-green/10 text-civic-green border-civic-green/20 rounded-full">ACTIVE</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Step description */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{currentStep}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mt-1">
                    {steps[currentStep - 1]?.title}
                  </p>
                </div>

                {/* Site Report — always visible */}
                <div className={cn(
                  "grid gap-4",
                  currentStep === steps.length ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                )}>
                  <div 
                    onClick={() => window.open(`https://app.totalchaos.online/report/${complaint.ref}`, '_blank')}
                    className="p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Site_Report_GR{String(complaint.ref).padStart(4, '0')}.pdf</span>
                        <span className="text-[10px] text-muted-foreground">AUTO-GENERATED BY AI</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Upload Evidence — only on the last step */}
                  {currentStep === steps.length && (
                    <div 
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      className={cn(
                        "p-4 rounded-2xl bg-secondary/30 border border-dashed border-border flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden",
                        uploading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg"
                        onChange={handleUpload}
                      />
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground uppercase tracking-wider">
                        {uploading ? 'COMMITTING...' : 'Upload Evidence'}
                      </span>
                      <span className="text-[10px] text-civic-orange">(REQUIRED: GEO-TAGGED)</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit uppercase">
                  <Clock className="w-3.5 h-3.5" /> ETA: {complaint.action_plan?.eta || 'Pending Analysis'}
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 border-t p-6">
                <div className="flex flex-wrap gap-3 w-full items-center">
                  {/* Prev button */}
                  <Button
                    variant="outline"
                    className="h-12 border-border rounded-full px-6 gap-2"
                    onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4" /> PREV
                  </Button>

                  {/* Next OR Mark Complete */}
                  {currentStep < steps.length ? (
                    <Button
                      className="bg-primary text-white font-bold px-10 h-12 flex-grow sm:flex-grow-0 rounded-full shadow-lg shadow-primary/20 gap-2"
                      onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
                    >
                      NEXT STEP <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button className="bg-civic-green text-white font-bold tracking-tight px-10 h-12 flex-grow sm:flex-grow-0 rounded-full shadow-lg shadow-civic-green/20">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> MARK COMPLETE
                    </Button>
                  )}

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
                       <h4 className="font-bold text-primary text-xs tracking-wider uppercase flex items-center gap-2">
                         <BrainCircuit className="w-4 h-4" /> AI Root Cause Analysis:
                       </h4>
                       <p className="text-sm italic text-foreground/80 leading-relaxed">
                         "{complaint.action_plan?.root_cause || 'Analyzing patterns...'}"
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
                          Civic-AI has verified similar patterns in this sector.
                        </p>
                     </div>
                   </div>
                 </div>
              </div>
            </Card>
          </motion.div>

          {/* Resources Card */}
           <Card className="border-border bg-secondary/5 overflow-hidden">
             <CardHeader className="bg-secondary/10 border-b">
               <div className="flex items-center gap-2 text-primary">
                 <Package className="w-4 h-4" />
                 <CardTitle className="text-lg font-bold">RESOURCES & EQUIPMENT</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                   {complaint.action_plan?.resources?.map((res, i) => (
                     <div key={i} className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-xl text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {res}
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Sidebar Risk Flags */}
        <div className="space-y-6">
          <Card className="border-civic-orange/20 shadow-lg">
            <CardHeader className="bg-civic-orange/10 border-b border-civic-orange/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-civic-orange uppercase tracking-wider">
                <Zap className="w-4 h-4" /> Impact Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="p-5 space-y-4">
                 <p className="text-sm text-foreground/90 leading-relaxed italic">
                   "{complaint.action_plan?.impact || 'No immediate risks detected.'}"
                 </p>
                 <div className="flex flex-wrap gap-2 pt-2">
                    {complaint.ai_tags?.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-secondary/50 text-[10px] uppercase font-bold">{tag}</Badge>
                    ))}
                 </div>
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
