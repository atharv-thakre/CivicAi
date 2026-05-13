import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  History,
  CheckCircle2,
  Search,
  Download,
  ChevronRight,
  Terminal,
  Database,
  Cpu,
  Lock,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { mockComplaint } from '@/mockData';
import { cn } from '@/lib/utils';

const AuditTrailPage = () => {
  const [selectedBlock, setSelectedBlock] = useState(2);
  const chainSize = mockComplaint.auditChain.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Fingerprint className="text-civic-purple w-8 h-8" />
            Blockchain Verification
          </h1>
          <p className="text-muted-foreground mt-1">Immutable Decentralized Audit Chain for Grievance Life-Cycle</p>
        </div>
        <div className="flex items-center gap-2 ios-glass p-1 rounded-2xl border border-border">
          <Input
            placeholder="Complaint ID..."
            className="w-48 h-9 border-none bg-transparent focus-visible:ring-0 text-sm"
            defaultValue={mockComplaint.id}
          />
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-xl px-4 font-bold">
            VERIFY
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Status Header */}
          <Card className="border-primary/20 bg-primary/5 overflow-hidden rounded-3xl shadow-sm relative">
            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_var(--primary)] opacity-50 animate-[scan_3s_linear_infinite]" />
            <style>{`
              @keyframes scan {
                0% { transform: translateY(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(180px); opacity: 0; }
              }
            `}</style>

            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-civic-green/20 flex items-center justify-center relative">
                  <ShieldCheck className="w-10 h-10 text-civic-green" />
                  <div className="absolute inset-0 rounded-full border-4 border-civic-green border-t-transparent animate-spin duration-1000" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    INTEGRITY STATUS: <span className="text-civic-green">VALID</span>
                  </h2>
                  <div className="flex gap-4 text-xs font-mono text-muted-foreground uppercase tracking-tight">
                    <span>LENGTH: {chainSize} BLOCKS</span>
                    <span className="text-border">|</span>
                    <span>VERIFIED: JUST NOW</span>
                  </div>
                </div>
              </div>
              <div className="ios-glass p-4 rounded-2xl border border-border/50 font-mono text-xs space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">HASH:</span>
                  <span className="text-primary truncate max-w-[150px]">{mockComplaint.masterBlock.hash}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">STATUS:</span>
                  <span className="text-foreground">SECURE (#{mockComplaint.masterBlock.position})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chain Visualization */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Internal Node Chain:</h3>
            <div className="flex flex-wrap items-center gap-0">
              {mockComplaint.auditChain.map((item, i) => (
                <React.Fragment key={item.block}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedBlock(item.block)}
                    className={cn(
                      "w-36 h-28 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden",
                      selectedBlock === item.block
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="absolute top-0 right-0 p-2">
                      <CheckCircle2 className="w-4 h-4 text-civic-green" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Block {item.block}</span>
                    <Badge variant="outline" className={cn(
                      "text-[10px] py-0 px-2 rounded-full",
                      selectedBlock === item.block ? "border-primary text-primary" : "border-border text-muted-foreground"
                    )}>
                      {item.action}
                    </Badge>
                    <span className="text-[10px] font-mono text-foreground/50">{item.hash}</span>
                  </motion.div>
                  {i < chainSize - 1 && (
                    <div className="flex-grow min-w-[20px] h-[1px] bg-border mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Expanded Block Detail */}
          <AnimatePresence mode="wait">
            {selectedBlock !== null && (
              <motion.div
                key={selectedBlock}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-civic-purple/40 bg-card/60 backdrop-blur-xl">
                  <CardHeader className="border-b bg-civic-purple/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-civic-purple" />
                        <CardTitle className="text-xl">
                          BLOCK {selectedBlock}: {mockComplaint.auditChain[selectedBlock].action} (Expanded)
                        </CardTitle>
                      </div>
                      <Badge className="bg-civic-green/20 text-civic-green border-civic-green/30">MATCH DETECTED</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">CURRENT HASH</p>
                          <p className="text-civic-purple break-all">{mockComplaint.auditChain[selectedBlock].hash}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">PREVIOUS HASH</p>
                          <p className="text-foreground/70 break-all">{mockComplaint.auditChain[selectedBlock].prev}</p>
                        </div>
                        <div className="flex items-center gap-2 text-civic-green text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" /> PREVIOUS POINTER MATCHED
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">ACTOR IDENTITY</p>
                          <p className="text-foreground">{mockComplaint.auditChain[selectedBlock].actor}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">TIMESTAMP</p>
                          <p className="text-foreground font-mono">{mockComplaint.auditChain[selectedBlock].timestamp || '2026-04-26T10:40:00Z'}</p>
                        </div>
                        <div className="p-4 rounded bg-background/60 border border-border/50 space-y-2">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">BLOCK DATA (JSON)</p>
                          <pre className="text-[10px] text-civic-cyan">
                            {JSON.stringify(mockComplaint.auditChain[selectedBlock].data || { status: 'OK', verified: true }, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-secondary/20 p-4 justify-end border-t">
                    <Button variant="outline" size="sm" className="text-xs h-8 border-border">REPORT DISCREPANCY</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-civic-purple/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-civic-purple font-bold">Blockchain Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <Badge variant="secondary">CIVIC-CORE-3</Badge>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Consensus</span>
                </div>
                <span className="text-xs font-mono">PoA (Authority)</span>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Encryption</span>
                </div>
                <span className="text-xs font-mono text-civic-cyan">AES-256-GCM</span>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase">MASTER CHAIN POSITION:</h4>
                <div className="flex items-center gap-1 overflow-hidden">
                  <div className="text-[10px] font-mono text-muted-foreground/50 italic shrink-0">... --&gt;</div>
                  <div className="flex gap-1 items-center">
                    <div className="w-12 h-6 rounded bg-secondary shrink-0 border border-border" />
                    <div className="w-12 h-6 rounded bg-civic-purple/20 shrink-0 border border-civic-purple flex items-center justify-center font-bold text-[8px] text-civic-purple">GR-042</div>
                    <div className="w-12 h-6 rounded bg-secondary shrink-0 border border-border" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-secondary border-border hover:bg-civic-purple hover:text-white text-xs gap-2 transition-all">
                <Download className="w-3 h-3" /> DOWNLOAD FULL AUDIT REPORT
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-civic-green/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-civic-green/10 p-2 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-civic-green" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Security Policy 4.2</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This document and its audit chain are cryptographically signed. Any modification attempt to the database will invalidate the master block pointer instantly.
                  </p>
                  <Button variant="link" className="text-civic-green p-0 h-auto text-xs font-bold gap-1 mt-2">
                    VERIFY MASTER CHAIN <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPage;
