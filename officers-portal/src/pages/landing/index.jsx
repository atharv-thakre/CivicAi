import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Zap, Database, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import CardNav from '@/components/CardNav';

const LandingPage = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Portal",
      bgColor: "#007aff",
      textColor: "#fff",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Complaints", href: "/complaints" },
        { label: "Audit Ledger", href: "/audit" }
      ]
    },
    {
      label: "Intelligence", 
      bgColor: "#5856d6",
      textColor: "#fff",
      links: [
        { label: "DSS Engine", href: "/dss" },
        { label: "MapView", href: "/map" },
        { label: "System Health", href: "/dashboard" }
      ]
    },
    {
      label: "About",
      bgColor: "#1B1722", 
      textColor: "#fff",
      links: [
        { label: "Company", href: "/login" },
        { label: "Protocol", href: "/login" },
        { label: "Security", href: "/login" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-500">
      <CardNav 
        items={navItems}
        logoAlt="CIVIC-AI"
        baseColor="var(--background)"
        menuColor="var(--foreground)"
        buttonBgColor="var(--primary)"
        buttonTextColor="white"
        theme="light"
      />
      
      {/* Dynamic Background */}
      <main className="relative z-10 pt-40 pb-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5" /> Next-Gen Governance
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
              FIXING CITIES <br/>
              <span className="text-primary italic">AT SCALE.</span>
            </h1>
            <p className="text-xl text-text-secondary font-medium leading-relaxed max-w-lg">
              The world's first AI-driven production portal for municipal officers. Real-time predictions, blockchain-verified audit trails, and automated resolution playbooks.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                onClick={() => navigate('/login')}
                className="h-16 px-10 bg-primary text-white text-lg font-bold rounded-[22px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex gap-3"
              >
                Launch Portal <ArrowRight className="w-6 h-6" />
              </Button>
              <Button 
                variant="outline"
                className="h-16 px-10 border-border text-lg font-bold rounded-[22px] ios-glass hover:bg-secondary/50 transition-all"
              >
                Watch Protocol
              </Button>
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 ios-glass p-1 rounded-[40px] shadow-2xl border border-white/20 overflow-hidden transform rotate-2">
               <img 
                 src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200" 
                 alt="City Dashboard" 
                 className="rounded-[38px] opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
               <div className="absolute bottom-10 left-10 right-10 space-y-4">
                  <div className="h-2 w-32 bg-primary rounded-full" />
                  <div className="h-2 w-48 bg-white/40 rounded-full" />
               </div>
            </div>
            
            {/* Animated badges */}
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-10 -right-10 ios-glass p-6 rounded-3xl shadow-xl border border-border/50 z-20"
            >
               <BarChart3 className="w-10 h-10 text-primary mb-2" />
               <div className="text-2xl font-black">+42%</div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency</div>
            </motion.div>

            <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -left-10 ios-glass p-6 rounded-3xl shadow-xl border border-border/50 z-20"
            >
               <Database className="w-10 h-10 text-civic-green mb-2" />
               <div className="text-2xl font-black italic">Verified</div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Web3 Chain</div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Content */}
      <section id="features" className="py-32 px-6 lg:px-20 bg-secondary/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black tracking-tight uppercase">System Capabilities</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Lidar Mapping", desc: "Real-time infrastructure scanning via edge networks.", color: "primary", bg: "bg-primary/10", text: "text-primary" },
              { icon: Zap, title: "DSS Engine", desc: "AI-driven decision support for critical municipal events.", color: "civic-green", bg: "bg-civic-green/10", text: "text-civic-green" },
              { icon: BarChart3, title: "KPI Tracker", desc: "Deep analytics for officer performance and caseloads.", color: "civic-purple", bg: "bg-civic-purple/10", text: "text-civic-purple" }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="ios-glass p-10 rounded-[40px] border border-border/50 space-y-6 group cursor-pointer"
              >
                <div className={cn(f.bg, f.text, "w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform")}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-extrabold tracking-tight">CIVIC-AI</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">© 2026 Civic-Core Protocol. All rights reserved.</p>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-sm font-bold text-muted-foreground hover:text-foreground">Policy</a>
            <a href="#" className="text-sm font-bold text-muted-foreground hover:text-foreground">Support</a>
            <a href="#" className="text-sm font-bold text-muted-foreground hover:text-foreground">Global Registry</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
