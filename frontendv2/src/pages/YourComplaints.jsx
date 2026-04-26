import { useState } from 'react';
import { Card, SectionTitle, Badge, MotionCard, Button } from '@/src/components/ui';
import { Search, Filter, MapPin, Calendar, Clock, Heart, MessageCircle, Share2, MoreHorizontal, User, AlertCircle } from 'lucide-react';
import { cn, formatDate } from '@/src/lib/utils';

const MY_COMPLAINTS = [
  {
    id: 'CA-829472',
    title: 'Water pipe burst at corner',
    description: 'Large amount of water being wasted on 12th Cross near the park entrance. Emergency repair needed!',
    category: 'Water Supply',
    status: 'Filed',
    location: '12th Cross, Sector 4',
    createdAt: '2024-03-20T10:00:00Z',
    upvotes: 24,
    comments: 5,
    updates: [
      { date: '2024-03-20T11:00:00Z', note: 'Complaint received and assigned to utility department.' }
    ]
  }
];

export default function YourComplaints() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredComplaints = MY_COMPLAINTS.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24 px-4 md:px-0">
      <SectionTitle subtitle="Track and manage your filed reports.">
        Your Complaints
      </SectionTitle>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', value: 1, color: 'text-blue-500' },
          { label: 'Resolved', value: 0, color: 'text-green-500' },
          { label: 'Votes', value: 24, color: 'text-vision-accent' }
        ].map((stat) => (
          <div key={stat.label} className="glass p-4 rounded-2xl border-black/5 dark:border-white/5 text-center">
            <p className="text-[8px] font-bold text-vision-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className={cn("text-xl font-bold tracking-tighter", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
          <input
            type="text"
            placeholder="Search your reports..."
            className="w-full pl-11 pr-4 py-4 glass border-none rounded-2xl text-xs focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all font-sans uppercase tracking-tight font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((c, i) => (
            <MotionCard key={c.id} transition={{ delay: i * 0.1 }}>
              <Card className="border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Status & ID */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold text-vision-accent bg-vision-accent/10 px-2 py-0.5 rounded border border-vision-accent/20 tracking-widest uppercase">
                        {c.id}
                      </span>
                      <Badge className={cn(
                        "border-none px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest",
                        c.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                        c.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-500'
                      )}>{c.status}</Badge>
                    </div>
                    <button className="text-vision-slate-400 hover:text-vision-accent transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold leading-tight uppercase tracking-tight">{c.title}</h3>
                    <p className="text-[10px] text-vision-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={12} className="text-vision-accent" />
                      {c.location} • {formatDate(c.createdAt)}
                    </p>
                  </div>

                  {/* Latest Update */}
                  <div className="p-4 bg-vision-accent/5 border border-vision-accent/10 rounded-2xl flex gap-3 items-start">
                    <div className="mt-0.5">
                      <AlertCircle size={14} className="text-vision-accent" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-vision-accent uppercase tracking-widest mb-1">Latest Update</p>
                      <p className="text-[10px] font-bold text-vision-slate-400 uppercase tracking-tight leading-relaxed">
                        {c.updates[0].note}
                      </p>
                    </div>
                  </div>

                  {/* Footer Interaction */}
                  <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-vision-slate-400">
                        <Heart size={16} />
                        <span className="text-[10px] font-bold">{c.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-vision-slate-400">
                        <MessageCircle size={16} />
                        <span className="text-[10px] font-bold">{c.comments}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="text-[9px] font-bold uppercase tracking-widest h-8">
                      Detailed Timeline
                    </Button>
                  </div>
                </div>
              </Card>
            </MotionCard>
          ))
        ) : (
          <div className="py-24 text-center glass rounded-3xl border-black/5 dark:border-white/5 mt-10">
            <h3 className="text-xl font-bold uppercase tracking-tighter">No Reports Yet</h3>
            <p className="text-vision-slate-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto leading-loose">
              You haven't filed any complaints yet. Start by reporting an issue in your area.
            </p>
            <Button className="mt-8 px-8" onClick={() => window.location.href = '/register'}>
              File First Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
