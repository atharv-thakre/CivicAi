import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  Tag,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';



// Time formatting utility
const formatTime = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const RecentComplaintsPage = ({ defaultFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://app.totalchaos.online/complaint/officer', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch assigned complaints');
        }
        
        const data = await response.json();
        
        // Map API data to component structure
        const mappedData = data.map(item => ({
          ref: item.ref,
          id: `GR-${new Date(item.created_at).getFullYear()}-${String(item.ref).padStart(4, '0')}`,
          subject: item.title,
          sector: item.address || item.category,
          status: item.is_urgent ? 'CRITICAL' : 
                  item.status === 'open' ? 'PENDING' : 
                  item.status === 'resolved' ? 'RESOLVED' : 'IN_PROGRESS',
          time: formatTime(item.created_at),
          officer: item.assigned_to || 'You'
        }));
        
        setComplaints(mappedData);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (defaultFilter) {
      if (defaultFilter === 'NEW') setFilter('PENDING');
      else if (defaultFilter === 'OVERDUE') setFilter('CRITICAL');
      else setFilter(defaultFilter);
    } else {
      setFilter('ALL');
    }
  }, [defaultFilter]);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.subject.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return 'bg-destructive text-white';
      case 'IN_PROGRESS': return 'bg-primary text-white';
      case 'RESOLVED': return 'bg-civic-green text-white';
      default: return 'bg-secondary text-text-secondary';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Complaints</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage and monitor live citizen grievances.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full gap-2 border-border/50 ios-glass">
                <Calendar className="w-4 h-4" /> Last 30 Days
            </Button>
            <Button className="bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20">
                + New Report
            </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by ID or Subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-card border-border/40 text-lg shadow-sm focus-visible:ring-primary/20 transition-all"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn(
                "h-14 px-6 rounded-2xl border-border/40 gap-2 font-bold transition-all",
                filter !== 'ALL' ? "bg-primary text-white border-primary" : "bg-card"
            )}>
              <Filter className="w-5 h-5" />
              {filter === 'ALL' ? 'Filter Results' : filter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
            <DropdownMenuItem onClick={() => setFilter('ALL')} className="rounded-xl">All Complaints</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('CRITICAL')} className="rounded-xl text-destructive font-bold">Critical Only</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('IN_PROGRESS')} className="rounded-xl">In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('PENDING')} className="rounded-xl">Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('RESOLVED')} className="rounded-xl">Resolved</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border/40 bg-card">
           <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Complaints List */}
      <div className="space-y-3 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Syncing with Civic-Core Ledger...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-bold">Failed to load complaints</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">Try Again</Button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className="group border-border/40 hover:border-primary/30 transition-all cursor-pointer overflow-hidden rounded-[24px] shadow-sm hover:shadow-md"
                    onClick={() => navigate(`/plans/${complaint.ref}`)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center p-5 sm:p-6 gap-4 sm:gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-transparent transition-colors",
                          complaint.status === 'CRITICAL' ? "bg-destructive/10 text-destructive" :
                          complaint.status === 'RESOLVED' ? "bg-civic-green/10 text-civic-green" :
                          "bg-primary/10 text-primary"
                        )}>
                          {complaint.status === 'CRITICAL' ? <AlertCircle className="w-6 h-6" /> : 
                           complaint.status === 'RESOLVED' ? <CheckCircle2 className="w-6 h-6" /> : 
                           <Clock className="w-6 h-6" />}
                        </div>
  
                        <div className="flex-grow min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{complaint.id}</span>
                             <Badge className={cn("text-[9px] px-2 py-0 h-4 font-black rounded-full", getStatusColor(complaint.status))}>
                               {complaint.status}
                             </Badge>
                          </div>
                          <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{complaint.subject}</h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                             <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {complaint.sector}
                             </div>
                             <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {complaint.time}
                             </div>
                             <div className="flex items-center gap-1 font-medium">
                                Officer: <span className="text-foreground">{complaint.officer}</span>
                             </div>
                          </div>
                        </div>
  
                        <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <MoreHorizontal className="w-5 h-5" />
                           </Button>
                           <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 ios-glass rounded-[40px] border border-dashed border-border/50">
                 <div className="inline-flex w-16 h-16 rounded-full bg-secondary items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <h3 className="text-xl font-bold">No complaints found</h3>
                 <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default RecentComplaintsPage;
