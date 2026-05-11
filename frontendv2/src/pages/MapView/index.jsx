import { useState } from 'react';
import { Card, SectionTitle, Badge, Button } from '@/src/components/ui';
import { MapPin, Filter, ZoomIn, ZoomOut, Layers, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import MapSidebar from './MapSidebar';

const MOCK_MARKERS = [
  { id: 1, x: 30, y: 40, status: 'Filed', category: 'Water' },
  { id: 2, x: 55, y: 25, status: 'Under Review', category: 'Electricity' },
  { id: 3, x: 70, y: 60, status: 'Resolved', category: 'Sanitation' },
  { id: 4, x: 20, y: 75, status: 'Filed', category: 'Roads' },
  { id: 5, x: 45, y: 55, status: 'Under Review', category: 'Safety' },
];

export default function MapView() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionTitle subtitle="Visualize reports in your neighborhood.">
          Interactive Map
        </SectionTitle>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex text-vision-slate-400">
            <Layers size={14} />
            Scan Layout
          </Button>
          <Button variant="outline" size="sm" className="text-vision-slate-400">
            <Filter size={14} />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col lg:flex-row gap-8">
        {/* Map Container */}
        <Card className="flex-1 border-black/5 dark:border-white/5 relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900/50">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0075ff22_0%,_transparent_100%)]" />
            <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-black/20 dark:border-white/20" />
              ))}
            </div>
          </div>

          {/* Map Content (Simulated Streets) */}
          <svg className="absolute inset-0 w-full h-full text-black/5 dark:text-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80 M20,0 L20,100 M50,0 L50,100 M80,0 L80,100" stroke="currentColor" strokeWidth="0.2" />
             <rect x="25" y="25" width="20" height="20" fill="currentColor" opacity="0.1" />
             <rect x="60" y="60" width="30" height="15" fill="currentColor" opacity="0.1" />
          </svg>

          {/* Markers */}
          <div className="absolute inset-0 p-8">
            <div className="relative w-full h-full">
              {MOCK_MARKERS.map((marker) => (
                <motion.button
                  key={marker.id}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl shadow-lg transition-all hover:scale-125 z-10",
                    marker.status === 'Resolved' ? 'bg-green-500 shadow-green-500/40' :
                    marker.status === 'Under Review' ? 'bg-amber-500 shadow-amber-500/40' :
                    'bg-vision-accent shadow-blue-500/40'
                  )}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  onClick={() => setSelectedMarker(marker)}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.95 }}
                >
                   <div className="w-2 h-2 bg-white rounded-full shadow-inner" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
            <button className="w-10 h-10 glass border-black/5 dark:border-white/10 rounded-xl shadow-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all">
              <ZoomIn size={18} />
            </button>
            <button className="w-10 h-10 glass border-black/5 dark:border-white/10 rounded-xl shadow-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all">
              <ZoomOut size={18} />
            </button>
            <button className="w-12 h-12 bg-vision-accent text-white rounded-2xl shadow-lg shadow-blue-500/40 flex items-center justify-center hover:bg-blue-600 mt-2 transition-all group">
              <MapPin size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Floating Search */}
          <div className="absolute top-6 left-6 right-24 md:right-auto md:w-80">
            <Card className="p-2.5 glass border-black/5 dark:border-white/10 flex items-center gap-3 backdrop-blur-2xl rounded-2xl">
               <Search className="ml-2 w-4 h-4 text-vision-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search area..." 
                 className="flex-1 bg-transparent border-none text-xs outline-none placeholder:text-vision-slate-400 font-bold uppercase tracking-tight"
               />
               <div className="pr-1">
                 <Badge className="bg-vision-accent/10 text-vision-accent border-none font-bold uppercase tracking-widest text-[8px]">Sector 4</Badge>
               </div>
            </Card>
          </div>
        </Card>

        <MapSidebar selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} />
      </div>
    </div>
  );
}
