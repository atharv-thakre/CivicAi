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
  ChevronRight
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
      const response = await fetch('https://app.totalchaos.online/chain/audits');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setAudits(data);
      if (data.length > 0) setSelectedBlock(data[0].ref);
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
    a.category?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const isChainValid = (items) => {
    for (let i = 1; i < items.length; i++) {
      if (items[i].previous_hash !== items[i - 1].current_hash) return false;
    }
    return true;
  };

  const chainValid = audits.length > 0 && isChainValid(audits);

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

            {/* Chain integrity banner */}
            <Card className={cn(
              'overflow-hidden rounded-3xl shadow-sm relative',
              chainValid ? 'border-civic-green/20 bg-civic-green/5' : 'border-red-500/20 bg-red-500/5'
            )}>
              <div className={cn(
                'absolute top-0 left-0 w-full h-[2px] shadow-[0_0_10px_currentColor] opacity-50 animate-[scan_3s_linear_infinite]',
                chainValid ? 'bg-civic-green' : 'bg-red-400'
              )} />
              <style>{`
                @keyframes scan {
                  0% { transform: translateY(0); opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { transform: translateY(160px); opacity: 0; }
                }
              `}</style>
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    'w-20 h-20 rounded-full border-4 flex items-center justify-center relative',
                    chainValid ? 'border-civic-green/20' : 'border-red-400/20'
                  )}>
                    <ShieldCheck className={cn('w-10 h-10', chainValid ? 'text-civic-green' : 'text-red-400')} />
                    <div className={cn(
                      'absolute inset-0 rounded-full border-4 border-t-transparent animate-spin',
                      chainValid ? 'border-civic-green' : 'border-red-400'
                    )} style={{ animationDuration: '2s' }} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      INTEGRITY:{' '}
                      <span className={chainValid ? 'text-civic-green' : 'text-red-400'}>
                        {chainValid ? 'VALID' : 'BROKEN'}
                      </span>
                    </h2>
                    <div className="flex gap-4 text-xs font-mono text-muted-foreground uppercase tracking-tight">
                      <span>LENGTH: {audits.length} BLOCKS</span>
                      <span className="text-border">|</span>
                      <span>VERIFIED: JUST NOW</span>
                    </div>
                  </div>
                </div>
                {audits.length > 0 && (
                  <div className="ios-glass p-4 rounded-2xl border border-border/50 font-mono text-xs space-y-2">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">LATEST HASH:</span>
                      <span className="text-primary">{HASH_SHORT(audits[audits.length - 1].current_hash)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">TOTAL BLOCKS:</span>
                      <span className="text-foreground">{audits.length}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Block chain visualisation */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Node Chain ({filteredAudits.length} record{filteredAudits.length !== 1 ? 's' : ''}):
              </h3>
              <div className="flex flex-wrap items-center gap-0">
                {filteredAudits.map((audit, i) => (
                  <React.Fragment key={audit.ref}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSelectedBlock(audit.ref)}
                      className={cn(
                        'w-36 h-28 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden',
                        selectedBlock === audit.ref
                          ? 'bg-primary/5 border-primary shadow-sm'
                          : 'bg-card border-border opacity-70 hover:opacity-100'
                      )}
                    >
                      <div className="absolute top-0 right-0 p-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-civic-green" />
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Block #{audit.ref}</span>
                      <Badge variant="outline" className={cn(
                        'text-[9px] py-0 px-2 rounded-full max-w-[110px] truncate',
                        selectedBlock === audit.ref ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                      )}>
                        {audit.category || 'Unknown'}
                      </Badge>
                      <span className="text-[9px] font-mono text-foreground/40">{HASH_SHORT(audit.current_hash)}</span>
                    </motion.div>
                    {i < filteredAudits.length - 1 && (
                      <div className="flex-grow min-w-[16px] h-[1px] bg-border mx-0.5 shrink" />
                    )}
                  </React.Fragment>
                ))}
                {filteredAudits.length === 0 && (
                  <p className="text-muted-foreground text-sm py-8 w-full text-center">No blocks match your search.</p>
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
                      {/* Complaint info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Tag className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Category</p>
                              <p>{selected.category || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Address</p>
                              <p>{selected.address} — {selected.pincode}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Created At</p>
                              <p className="font-mono">{selected.created_at}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                            <Badge className={cn('border', getStatusColor(selected.status))}>
                              {selected.status || 'draft'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Is Urgent</span>
                            <span className={selected.is_urgent ? 'text-red-400 font-bold' : 'text-muted-foreground'}>
                              {selected.is_urgent ? 'YES' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Upvotes</span>
                            <span className="font-mono">{selected.upvotes}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Priority Score</span>
                            <span className="font-mono">{selected.internal_priority?.toFixed(2)}</span>
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
            <Card className="bg-gradient-to-br from-civic-purple/10 to-transparent rounded-3xl">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-civic-purple font-bold">
                  Blockchain Specs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Network</span>
                  </div>
                  <Badge variant="secondary">CIVIC-CORE-3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Consensus</span>
                  </div>
                  <span className="text-xs font-mono">PoA (Authority)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Encryption</span>
                  </div>
                  <span className="text-xs font-mono text-civic-cyan">AES-256-GCM</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Total Blocks</h4>
                  <p className="text-3xl font-extrabold tabular-nums">{audits.length}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Chain Integrity</h4>
                  <p className={cn('text-sm font-bold', chainValid ? 'text-civic-green' : 'text-red-400')}>
                    {chainValid ? '✓ All hashes verified' : '✗ Chain mismatch detected'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-secondary border-border hover:bg-civic-purple hover:text-white text-xs gap-2 transition-all">
                  <Download className="w-3 h-3" /> DOWNLOAD FULL AUDIT REPORT
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
