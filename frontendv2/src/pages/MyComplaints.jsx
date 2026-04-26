import { useState } from 'react';
import { Card, SectionTitle, Badge, MotionCard, Button } from '@/src/components/ui';
import { Search, Filter, MapPin, Calendar, Clock, Heart, MessageCircle, Share2, MoreHorizontal, User } from 'lucide-react';
import { cn, formatDate } from '@/src/lib/utils';

const RECENT_COMPLAINTS = [
  {
    id: 'CA-829472',
    user: {
      name: 'Rahul Sharma',
      avatar: 'RS',
      location: 'Sector 4, Bangalore'
    },
    title: 'Water pipe burst at corner',
    description: 'Large amount of water being wasted on 12th Cross near the park entrance. Emergency repair needed!',
    image: '/assets/pipe.png',
    category: 'Water Supply',
    status: 'Filed',
    location: '12th Cross, Sector 4',
    createdAt: '2024-03-20T10:00:00Z',
    upvotes: 24,
    comments: 5,
  },
  {
    id: 'CA-771239',
    user: {
      name: 'Anjali Gupta',
      avatar: 'AG',
      location: 'HSR Layout'
    },
    title: 'Major Pothole on Main Road',
    description: 'A massive pothole has appeared right after the rains. Multiple bikers almost slipped this morning.',
    image: '/assets/pothole.png',
    category: 'Roads & Potholes',
    status: 'Under Review',
    location: 'Main 27th Cross, HSR',
    createdAt: '2024-03-15T18:30:00Z',
    upvotes: 56,
    comments: 12,
  },
  {
    id: 'CA-665102',
    user: {
      name: 'Municipal Alert',
      avatar: 'MA',
      location: 'System'
    },
    title: 'Uncollected garbage for 3 days',
    description: 'Waste truck has not visited the street for three consecutive days. Health hazard concerns.',
    category: 'Sanitation',
    status: 'Resolved',
    location: 'Lane 5, Green Woods',
    createdAt: '2024-03-10T08:00:00Z',
    upvotes: 12,
    comments: 2,
  },
];

export default function MyComplaints() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredComplaints = RECENT_COMPLAINTS.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24 px-4 md:px-0">
      <SectionTitle subtitle="Public feed of community reported issues.">
        Recent Complaints
      </SectionTitle>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-slate-400" />
          <input
            type="text"
            placeholder="Search community issues..."
            className="w-full pl-11 pr-4 py-4 glass border-none rounded-2xl text-xs focus:ring-1 focus:ring-vision-accent/50 outline-none transition-all font-sans uppercase tracking-tight font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Filed', 'Under Review', 'Resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all border",
                filter === f
                  ? "bg-vision-accent border-vision-accent text-white shadow-lg shadow-blue-500/20"
                  : "glass border-black/5 dark:border-white/5 text-vision-slate-400 hover:text-slate-700 dark:hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((c, i) => (
            <MotionCard key={c.id} transition={{ delay: i * 0.1 }}>
              <Card className="border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 overflow-hidden">
                {/* Header */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-vision-accent/10 flex items-center justify-center border border-vision-accent/20 text-vision-accent font-bold text-xs">
                      {c.user.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight">{c.user.name}</h4>
                      <p className="text-[9px] text-vision-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-vision-accent" />
                        {c.user.location} • {formatDate(c.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button className="text-vision-slate-400 hover:text-vision-accent transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-5 pb-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "border-none px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest",
                      c.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                      c.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-blue-500/10 text-blue-500'
                    )}>{c.status}</Badge>
                    <span className="text-[9px] font-bold text-vision-slate-400 uppercase tracking-widest">{c.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold leading-tight uppercase tracking-tight">{c.title}</h3>
                  <p className="text-sm text-vision-slate-400 font-medium leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {/* Image */}
                {c.image && (
                  <div className="relative aspect-video overflow-hidden border-y border-black/5 dark:border-white/5">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Footer Interaction */}
                <div className="p-3 px-5 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-vision-slate-400 hover:text-red-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-red-500/10">
                        <Heart size={18} />
                      </div>
                      <span className="text-xs font-bold">{c.upvotes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-vision-slate-400 hover:text-vision-accent transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-vision-accent/10">
                        <MessageCircle size={18} />
                      </div>
                      <span className="text-xs font-bold">{c.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-vision-slate-400 hover:text-green-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-green-500/10">
                        <Share2 size={18} />
                      </div>
                    </button>
                  </div>
                  
                  <Button variant="outline" size="sm" className="text-[9px] font-bold uppercase tracking-widest h-8">
                    Track Issue
                  </Button>
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
