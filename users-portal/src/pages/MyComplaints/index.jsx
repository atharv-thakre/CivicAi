import { useState, useEffect } from 'react';
import { SectionTitle, Badge, Button } from '@/src/components/ui';
import { Search, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import ComplaintCard from './ComplaintCard';
import { useAuth } from '@/src/contexts/AuthContext';
import { API_BASE_URL } from '@/src/constants';

export default function MyComplaints() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/user/complaints`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        
        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchComplaints();
    }
  }, [token]);

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'All' || c.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.ref.toString().toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <SectionTitle subtitle="Manage and track your civic reports.">
        My Complaints
      </SectionTitle>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-11 pr-4 py-3 glass border-none rounded-2xl text-xs focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all font-sans uppercase tracking-tight font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide glass p-1.5 rounded-2xl border-black/5 dark:border-white/5">
          {['All', 'Filed', 'Under Review', 'Resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all",
                filter === f
                  ? "bg-vision-accent text-white shadow-lg shadow-blue-500/20"
                  : "text-vision-slate-400 hover:text-slate-700 dark:hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-24 text-center glass rounded-3xl border-black/5 dark:border-white/5 mt-10">
            <Loader2 className="w-10 h-10 animate-spin text-vision-accent mx-auto mb-4" />
            <p className="text-vision-slate-400 text-xs font-bold uppercase tracking-widest">Retrieving your complaints...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center glass rounded-3xl border-black/5 dark:border-white/5 mt-10 border-red-500/20">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredComplaints.length > 0 ? (
          filteredComplaints.map((c, i) => (
            <ComplaintCard key={c.ref} complaint={c} index={i} />
          ))
        ) : (
          <div className="py-24 text-center glass rounded-3xl border-black/5 dark:border-white/5 mt-10">
            <div className="w-20 h-20 bg-vision-accent/10 border border-vision-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-vision-accent shadow-lg shadow-blue-500/10">
              <Filter size={36} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tighter">No Reports Found</h3>
            <p className="text-vision-slate-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto leading-loose">
              We couldn&apos;t find any reports matching your current criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
