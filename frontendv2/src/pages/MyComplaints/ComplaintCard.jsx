import { Card, Badge, MotionCard } from '@/src/components/ui';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { cn, getStatusColor, formatDate } from '@/src/lib/utils';

export default function ComplaintCard({ complaint, index }) {
  return (
    <MotionCard transition={{ delay: index * 0.1 }}>
      <Card className="hover:border-vision-accent/30 transition-all cursor-pointer group p-6 md:p-8 border-black/5 dark:border-white/5 active:scale-[0.99]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-vision-accent bg-vision-accent/10 px-3 py-1 rounded-lg uppercase tracking-tight border border-vision-accent/20">
                {complaint.id}
              </span>
              <Badge className={cn(
                getStatusColor(complaint.status), 
                "border-none px-3 py-1 bg-opacity-20 font-bold",
                complaint.status === 'Resolved' ? 'bg-green-500 text-green-600 dark:text-green-400' :
                complaint.status === 'Under Review' ? 'bg-amber-500 text-amber-600 dark:text-amber-400' :
                'bg-blue-500 text-blue-600 dark:text-blue-400'
              )}>{complaint.status}</Badge>
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-vision-accent transition-colors truncate uppercase tracking-tight">
                {complaint.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-vision-slate-400 font-medium leading-relaxed mt-2 line-clamp-2">
                {complaint.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-col items-center md:items-end gap-6 md:gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">
              <Calendar size={14} className="text-vision-accent" />
              {formatDate(complaint.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vision-slate-400">
              <MapPin size={14} className="text-vision-accent" />
              {complaint.location}
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
                {formatDate(complaint.updatedAt)}
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
  );
}
