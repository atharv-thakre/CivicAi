import { useState } from 'react';
import { Card, SectionTitle, Badge, MotionCard } from '@/src/components/ui';
import { Search, Filter, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { cn, getStatusColor, formatDate } from '@/src/lib/utils';

const USER_COMPLAINTS = [
  {
    id: 'CA-829472',
    title: 'Water pipe burst at corner',
    description: 'Large amount of water being wasted on 12th Cross near the park entrance.',
    category: 'Water Supply',
    status: 'Filed',
    location: '12th Cross, Sector 4',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 'CA-771239',
    title: 'Frequent power cuts at night',
    description: 'Power goes out every night between 8 PM and 10 PM consistently for a week.',
    category: 'Electricity',
    status: 'Under Review',
    location: 'Hill View Apartments',
    createdAt: '2024-03-15T18:30:00Z',
    updatedAt: '2024-03-16T11:00:00Z',
  },
  {
    id: 'CA-665102',
    title: 'Uncollected garbage for 3 days',
    description: 'Waste truck has not visited the street for three consecutive days.',
    category: 'Sanitation',
    status: 'Resolved',
    location: 'Lane 5, Green Woods',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-12T15:00:00Z',
  },
];

export default function MyComplaints() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredComplaints = USER_COMPLAINTS.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <SectionTitle subtitle="Manage and track your civic reports.">
        Incident Ledger
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
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((c, i) => (
            <MotionCard key={c.id} transition={{ delay: i * 0.1 }}>
              <Card className="hover:border-vision-accent/30 transition-all cursor-pointer group p-6 md:p-8 border-black/5 dark:border-white/5 active:scale-[0.99]">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-vision-accent bg-vision-accent/10 px-3 py-1 rounded-lg uppercase tracking-tight border border-vision-accent/20">
                        {c.id}
                      </span>
                      <Badge className={cn(
                        getStatusColor(c.status), 
                        "border-none px-3 py-1 bg-opacity-20 font-bold",
                        c.status === 'Resolved' ? 'bg-green-500 text-green-600 dark:text-green-400' :
                        c.status === 'Under Review' ? 'bg-amber-500 text-amber-600 dark:text-amber-400' :
                        'bg-blue-500 text-blue-600 dark:text-blue-400'
                      )}>{c.status}</Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-vision-accent transition-colors truncate uppercase tracking-tight">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-vision-slate-400 font-medium leading-relaxed mt-2 line-clamp-2">
                        {c.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap md:flex-col items-center md:items-end gap-6 md:gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">
                      <Calendar size={14} className="text-vision-accent" />
                      {formatDate(c.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">
                      <MapPin size={14} className="text-vision-accent" />
                      {c.location}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center border-black/5 dark:border-white/5">
                      <Clock size={16} className="text-vision-accent" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 dark:text-vision-slate-600 uppercase tracking-widest">Update</p>
                      <p className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-widest">
                        {formatDate(c.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-vision-accent text-[10px] font-bold gap-2 group-hover:translate-x-2 transition-transform uppercase tracking-widest">
                    Details
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Card>
            </MotionCard>
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
