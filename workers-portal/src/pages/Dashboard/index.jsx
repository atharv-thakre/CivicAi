import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  LogOut, 
  Loader2, 
  AlertCircle, 
  MapPin, 
  Clock, 
  ChevronRight,
  Filter,
  HardHat,
  CheckCircle2,
  AlertTriangle,
  Send,
  UploadCloud,
  CheckCircle,
  Camera,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState(null);
  const [reportingStatus, setReportingStatus] = useState({}); // { [ref]: 'loading' | 'success' | 'error' }

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleAction = (ref, action) => {
    if (action === 'upload') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          postEvidence(ref, file);
        }
      };
      input.click();
    } else if (action === 'complete') {
      markComplete(ref);
    }
  };

  const postEvidence = (ref, file) => {
    setReportingStatus(prev => ({ ...prev, [ref]: 'detecting-location' }));
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setReportingStatus(prev => ({ ...prev, [ref]: null }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Detected location for complaint ${ref}: ${latitude}, ${longitude}`);
        
        setReportingStatus(prev => ({ ...prev, [ref]: 'posting' }));
        
        // Placeholder for future POST route
        setTimeout(() => {
          console.log(`Evidence for ${ref} would be posted here with location:`, { latitude, longitude, file });
          setReportingStatus(prev => ({ ...prev, [ref]: 'success' }));
          setTimeout(() => {
            setReportingStatus(prev => ({ ...prev, [ref]: null }));
            setActiveReport(null);
          }, 2000);
        }, 1500);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Failed to detect location. Please enable location services.");
        setReportingStatus(prev => ({ ...prev, [ref]: null }));
      }
    );
  };

  const markComplete = (ref) => {
    setReportingStatus(prev => ({ ...prev, [ref]: 'posting' }));
    setTimeout(() => {
      console.log(`Complaint ${ref} marked as complete`);
      setReportingStatus(prev => ({ ...prev, [ref]: 'success' }));
      setTimeout(() => {
        setReportingStatus(prev => ({ ...prev, [ref]: null }));
        setActiveReport(null);
      }, 2000);
    }, 1000);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://app.totalchaos.online/complaint/all');

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.ref?.toString().includes(searchQuery)
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'in-progress': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'resolved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold tracking-tight">CIVIC AI</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Worker Portal</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Search complaints..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl bg-secondary/30 border-border/50 focus-visible:ring-blue-600/30 text-sm transition-all w-full"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-xl border-border/50 bg-secondary/30 hover:bg-blue-600/10 hover:text-blue-400 transition-all">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">


        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-muted-foreground animate-pulse font-medium">Syncing with Civic-Core...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center text-red-400 mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Failed to Load Complaints</h2>
            <p className="text-muted-foreground max-w-xs">{error}</p>
            <Button onClick={fetchComplaints} variant="outline" className="mt-4">
              Retry Connection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.ref || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative ios-glass rounded-[28px] border border-border/50 bg-card/40 p-6 hover:bg-card/60 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(complaint.status)}`}>
                        {complaint.status || 'Open'}
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(complaint.ai_severity)}
                        <span className="text-[10px] font-mono text-muted-foreground">#{complaint.ref}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {complaint.title || 'Untitled Complaint'}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                      {complaint.description || 'No description provided.'}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-border/30">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0 text-blue-500" />
                        <span className="line-clamp-1">{complaint.address || 'Location Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0 text-blue-500" />
                        <span>{new Date(complaint.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>

                    <div className="mt-6 relative">
                      <AnimatePresence mode="wait">
                        {activeReport === complaint.ref ? (
                          <motion.div
                            key="actions"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col gap-2"
                          >
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleAction(complaint.ref, 'complete')}
                                disabled={!!reportingStatus[complaint.ref]}
                                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 shadow-lg shadow-emerald-600/20"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-bold">Complete</span>
                              </Button>
                              <Button 
                                onClick={() => handleAction(complaint.ref, 'upload')}
                                disabled={!!reportingStatus[complaint.ref]}
                                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-600/20"
                              >
                                <Camera className="w-4 h-4" />
                                <span className="text-xs font-bold">Evidence</span>
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setActiveReport(null)}
                              className="h-8 text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:bg-transparent"
                            >
                              Cancel
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div key="main-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Button 
                              onClick={() => setActiveReport(complaint.ref)}
                              className="w-full h-11 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl transition-all duration-300 gap-2 border border-blue-600/20 shadow-lg shadow-blue-600/5 group"
                            >
                              {reportingStatus[complaint.ref] === 'success' ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                                  Report Sent
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  Send Report
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Status Overlay */}
                      {reportingStatus[complaint.ref] && reportingStatus[complaint.ref] !== 'success' && (
                        <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                            {reportingStatus[complaint.ref].replace('-', ' ')}...
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-bold text-muted-foreground">No matching complaints found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search terms.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
