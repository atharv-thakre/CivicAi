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
  Tag
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

// Mock data for complaints
const MOCK_COMPLAINTS = [
  { id: 'GR-2026-0042', subject: 'Water Supply: Main pipe burst', sector: 'Sector 4', status: 'CRITICAL', time: '2h ago', officer: 'Sharma' },
  { id: 'GR-2026-0039', subject: 'Street Light Malfunction', sector: 'Sector 7', status: 'IN_PROGRESS', time: '5h ago', officer: 'Gupta' },
  { id: 'GR-2026-0035', subject: 'Waste Collection Delay', sector: 'Sector 2', status: 'PENDING', time: '1d ago', officer: 'Verma' },
  { id: 'GR-2026-0031', subject: 'Pothole Assessment', sector: 'Sector 4', status: 'RESOLVED', time: '2d ago', officer: 'Sharma' },
  { id: 'GR-2026-0028', subject: 'Sewage Overflow', sector: 'Sector 12', status: 'CRITICAL', time: '3d ago', officer: 'Reddy' },
  { id: 'GR-2026-0025', subject: 'Illegal Parking Report', sector: 'Sector 5', status: 'IN_PROGRESS', time: '4d ago', officer: 'Gupta' },
  { id: 'GR-2026-0022', subject: 'Park Bench Vandalism', sector: 'Sector 3', status: 'RESOLVED', time: '1w ago', officer: 'Verma' },
];

const RecentComplaintsPage = ({ defaultFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultFilter) {
      if (defaultFilter === 'NEW') setFilter('PENDING');
      else if (defaultFilter === 'OVERDUE') setFilter('CRITICAL');
      else setFilter(defaultFilter);
    } else {
      setFilter('ALL');
    }
  }, [defaultFilter]);

  const filteredComplaints = MOCK_COMPLAINTS.filter(c => {
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
      <div className="space-y-3">
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
                  onClick={() => navigate(`/plans/${complaint.id}`)}
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
      </div>
    </div>
  );
};

export default RecentComplaintsPage;
