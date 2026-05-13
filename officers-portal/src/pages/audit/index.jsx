import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Search,
  Download,
  Terminal,
  Database,
  Cpu,
  Lock,
  ArrowRight,
  Fingerprint,
  Loader2,
  AlertCircle,
  MapPin,
  Clock,
  Tag,
  Link2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const HASH_SHORT = (h) => h ? `${h.slice(0, 6)}…${h.slice(-6)}` : 'N/A';

const AuditTrailPage = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch the overall chain integrity status
      const verifyRes = await fetch('https://app.totalchaos.online/chain/verify');
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        setChainValid(verifyData.status);
      }

      // 2. Fetch the actual blockchain audit records
      const response = await fetch('https://app.totalchaos.online/chain/audits');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      
      // Ensure data is sorted by ref
      const sortedData = [...data].sort((a, b) => (a.ref || 0) - (b.ref || 0));
      setAudits(sortedData);
      
      if (sortedData.length > 0) setSelectedBlock(sortedData[0].ref);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAudits = audits.filter(a =>
    String(a.ref).includes(searchQuery) ||
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(a.user_id).includes(searchQuery)
  );

  const selected = audits.find(a => a.ref === selectedBlock);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in-progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const [chainValid, setChainValid] = useState(true);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Fingerprint className="text-civic-purple w-8 h-8" />
            Blockchain Verification
          </h1>
          <p className="text-muted-foreground mt-1">Immutable Decentralised Audit Chain for Grievance Life-Cycle</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 ios-glass p-1 rounded-2xl border border-border">
            <Search className="w-4 h-4 text-muted-foreground ml-2" />
            <Input
              placeholder="Search block / complaint…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-52 h-9 border-none bg-transparent focus-visible:ring-0 text-sm"
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={fetchAudits}
            className="h-11 w-11 rounded-xl"
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-civic-purple" />
          <p className="text-muted-foreground animate-pulse font-medium">Syncing chain from Civic-Core…</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold">Failed to Load Audit Chain</h2>
          <p className="text-muted-foreground max-w-xs">{error}</p>
          <Button onClick={fetchAudits} variant="outline">Retry</Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Block chain visualisation */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Node Chain ({filteredAudits.length} record{filteredAudits.length !== 1 ? 's' : ''}):
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 text-civic-green">
                    <div className="w-2 h-2 rounded-full bg-current" /> Verified
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500">
                    <div className="w-2 h-2 rounded-full bg-current" /> Tampered
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-y-8 gap-x-0">
                {filteredAudits.map((audit, i) => {
                  // Check if this block is valid relative to the previous one in the FULL audits array
                  // We need to find the actual index in the original audits array to check integrity
                  const originalIndex = audits.findIndex(a => a.ref === audit.ref);
                  const isBlockValid = originalIndex === 0 || 
                    audits[originalIndex].previous_hash === audits[originalIndex - 1].current_hash;

                  return (
                    <React.Fragment key={audit.ref}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBlock(audit.ref)}
                        className={cn(
                          'w-40 h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden',
                          selectedBlock === audit.ref
                            ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
                            : 'bg-card border-border/50 hover:border-border hover:bg-secondary/20',
                          !isBlockValid && 'border-red-500/50 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        )}
                      >
                        <div className="absolute top-0 right-0 p-2">
                          {isBlockValid ? (
                            <CheckCircle2 className="w-4 h-4 text-civic-green" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                          )}
                        </div>
                        
                        {!isBlockValid && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30" />
                        )}

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Block {audit.ref}</span>
                          <Badge variant="outline" className={cn(
                            'text-[9px] py-0 px-2 rounded-full font-bold',
                            selectedBlock === audit.ref ? 'bg-primary text-primary-foreground border-transparent' : 'border-border'
                          )}>
                            {audit.category || 'EVENT'}
                          </Badge>
                        </div>
                        
                        <div className="mt-1 flex flex-col items-center">
                          <span className="text-[10px] font-mono font-medium text-foreground/60">{HASH_SHORT(audit.current_hash)}</span>
                          <div className="flex items-center gap-1 mt-1">
                             <div className={cn("w-1.5 h-1.5 rounded-full", isBlockValid ? "bg-civic-green" : "bg-red-500")} />
                             <span className={cn("text-[8px] font-bold uppercase", isBlockValid ? "text-civic-green" : "text-red-500")}>
                               {isBlockValid ? "Signed" : "Corrupted"}
                             </span>
                          </div>
                        </div>
                      </motion.div>
                      
                      {i < filteredAudits.length - 1 && (
                        <div className="flex flex-col items-center px-1">
                          <div className={cn(
                            "w-8 h-[2px]",
                            // The next block's validity depends on the link between this one and the next
                            (audits[audits.findIndex(a => a.ref === filteredAudits[i+1].ref)].previous_hash === audit.current_hash)
                              ? "bg-civic-green/30" 
                              : "bg-red-500/50 animate-pulse h-[3px]"
                          )} />
                          {!(audits[audits.findIndex(a => a.ref === filteredAudits[i+1].ref)].previous_hash === audit.current_hash) && (
                             <Lock className="w-3 h-3 text-red-500 mt-1" />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                {filteredAudits.length === 0 && (
                  <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[40px] bg-secondary/10">
                    <Database className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm font-medium">No blocks match your current filter.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded block detail */}
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.ref}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border-civic-purple/40 bg-card/60 backdrop-blur-xl rounded-3xl">
                    <CardHeader className="border-b bg-civic-purple/5 rounded-t-3xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Terminal className="w-5 h-5 text-civic-purple" />
                          <CardTitle className="text-xl">
                            BLOCK #{selected.ref}: {selected.title}
                          </CardTitle>
                        </div>
                        <Badge className="bg-civic-green/20 text-civic-green border-civic-green/30">HASH MATCH</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      {/* Detailed Complaint Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Primary Details</p>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold">User ID: {selected.user_id}</p>
                                  <p className="text-[10px] text-muted-foreground">Assigned to: {selected.assigned_to}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold">{selected.category}</p>
                                  <p className="text-[10px] text-muted-foreground">{selected.ai_department}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold leading-tight">{selected.address}</p>
                                  <p className="text-[10px] text-muted-foreground">Pincode: {selected.pincode}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Verification</p>
                            <div className="bg-secondary/20 p-3 rounded-2xl border border-border/50 space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Confidence</span>
                                <span className="font-mono font-bold text-civic-green">{(selected.ai_confidence * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Severity</span>
                                <Badge variant="outline" className={cn(
                                  "text-[9px] font-bold py-0 h-4",
                                  selected.ai_severity === 'High' ? "border-red-500 text-red-500" : "border-amber-500 text-amber-500"
                                )}>
                                  {selected.ai_severity}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selected.ai_tags?.map(tag => (
                                  <Badge key={tag} className="text-[8px] bg-civic-purple/10 text-civic-purple border-civic-purple/20 py-0 h-4">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">System Metrics</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-background/40 p-3 rounded-2xl border border-border/50 text-center">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Priority</p>
                                <p className="text-xl font-black text-civic-cyan">{selected.internal_priority}</p>
                              </div>
                              <div className="bg-background/40 p-3 rounded-2xl border border-border/50 text-center">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Upvotes</p>
                                <p className="text-xl font-black text-civic-purple">{selected.upvotes}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Block Meta</p>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Status</span>
                                <Badge className={cn("font-bold capitalize", getStatusColor(selected.status))}>
                                  {selected.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Urgency</span>
                                <span className={cn("font-bold", selected.is_urgent ? "text-red-500" : "text-muted-foreground")}>
                                  {selected.is_urgent ? "CRITICAL" : "NORMAL"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Logged At</span>
                                <span className="font-mono text-foreground/70 text-[10px]">{selected.created_at}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Hash chain */}
                      <div className="space-y-4 font-mono text-xs">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Hash Verification
                        </h4>
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-background/60 border border-border/50 space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                              <Link2 className="w-3 h-3" /> Previous Hash
                            </p>
                            <p className="text-foreground/60 break-all">{selected.previous_hash}</p>
                          </div>
                          <div className="flex justify-center">
                            <ChevronDown className="w-4 h-4 text-civic-purple" />
                          </div>
                          <div className="p-4 rounded-xl bg-civic-purple/5 border border-civic-purple/30 space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                              <Link2 className="w-3 h-3 text-civic-purple" /> Current Hash
                            </p>
                            <p className="text-civic-purple break-all">{selected.current_hash}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-civic-green text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" /> POINTER VALIDATED — CHAIN INTACT
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/20 p-4 justify-end border-t rounded-b-3xl">
                      <Button variant="outline" size="sm" className="text-xs h-8 border-border">
                        REPORT DISCREPANCY
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className={cn(
              'overflow-hidden rounded-3xl shadow-sm relative border-2',
              chainValid ? 'border-civic-green/20 bg-civic-green/5' : 'border-red-500/20 bg-red-500/5'
            )}>
              <div className={cn(
                'absolute top-0 left-0 w-full h-[2px] opacity-30 animate-[scan_3s_linear_infinite]',
                chainValid ? 'bg-civic-green' : 'bg-red-400'
              )} />
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">
                  Chain Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center gap-4 py-2">
                  <div className={cn(
                    'w-24 h-24 rounded-full border-4 flex items-center justify-center relative bg-background/50 backdrop-blur-sm',
                    chainValid ? 'border-civic-green/20' : 'border-red-400/20'
                  )}>
                    <ShieldCheck className={cn('w-12 h-12', chainValid ? 'text-civic-green' : 'text-red-400')} />
                    <div className={cn(
                      'absolute inset-[-4px] rounded-full border-4 border-t-transparent animate-spin',
                      chainValid ? 'border-civic-green' : 'border-red-400'
                    )} style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter">
                      {chainValid ? 'SECURED' : 'COMPROMISED'}
                    </h2>
                    <Badge className={cn(
                      "font-bold uppercase tracking-widest text-[9px]",
                      chainValid ? "bg-civic-green/10 text-civic-green border-civic-green/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {chainValid ? 'Integrity Verified' : 'Hash Mismatch'}
                    </Badge>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Nodes</p>
                    <p className="text-xl font-black font-mono">{audits.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Network</p>
                    <p className="text-xs font-bold text-civic-purple">CIVIC-3</p>
                  </div>
                </div>

                {audits.length > 0 && (
                  <div className="p-4 rounded-2xl bg-background/40 border border-border/50 font-mono text-[10px] space-y-3">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block uppercase font-bold text-[8px]">Latest Head Hash:</span>
                      <span className="text-primary break-all leading-tight block">
                        {audits[audits.length - 1].current_hash}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-background/40 border-t p-4">
                <Button className="w-full bg-secondary border-border hover:bg-civic-purple hover:text-white text-[10px] font-bold gap-2 transition-all h-10 rounded-xl">
                  <Download className="w-3.5 h-3.5" /> AUDIT REPORT (.PDF)
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-civic-green/20 rounded-3xl">
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
      )}
    </div>
  );
};

export default AuditTrailPage;
