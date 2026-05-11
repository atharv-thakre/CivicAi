import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Eye, UserPlus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* iOS Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-civic-purple/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary rounded-[22px] shadow-2xl flex items-center justify-center text-white transform rotate-[5deg] hover:rotate-0 transition-transform duration-300">
            <UserPlus className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Access Portal</h1>
            <p className="text-muted-foreground font-medium">Register Official Officer Credentials</p>
          </div>
        </div>

        <div className="ios-glass p-8 rounded-[32px] border border-border/50 shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                <Input 
                   placeholder="Vijay" 
                   className="h-12 rounded-2xl bg-secondary/30 border-none px-5 text-sm focus-visible:ring-primary/30 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                <Input 
                   placeholder="Sharma" 
                   className="h-12 rounded-2xl bg-secondary/30 border-none px-5 text-sm focus-visible:ring-primary/30 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Gov Official ID</label>
              <Input 
                placeholder="GOV-XXXX-XXXX" 
                className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-primary/30 transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Department Email</label>
              <Input 
                type="email"
                placeholder="officer@civic-gov.in" 
                className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-primary/30 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Portal Access Key</label>
              <div className="relative">
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-primary/30 transition-all font-mono"
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-2 rounded-xl text-muted-foreground">
                  <Eye className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
             <Info className="w-5 h-5 text-primary shrink-0" />
             <p className="text-[10px] text-muted-foreground leading-tight font-medium">
               Official registration requires physical multi-sig verification from your sector supervisor after portal activation.
             </p>
          </div>

          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Credentials
          </Button>

          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Already verified? <Button variant="link" className="p-0 h-auto font-bold text-primary" onClick={() => navigate('/login')}>Login</Button>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
           <Shield className="w-8 h-8 text-muted-foreground" />
           <div className="w-[1px] h-6 bg-border" />
           <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold text-left leading-tight">
             MILITARY GRADE <br/> ENCRYPTION ACTIVATED
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
