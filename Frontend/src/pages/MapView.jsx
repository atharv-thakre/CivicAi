import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Navigation, 
  Settings, 
  Filter, 
  Locate, 
  AlertTriangle, 
  Droplet, 
  Route, 
  Zap, 
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const points = [
  { id: 1, lat: 28.6139, lng: 77.2090, type: 'Water', priority: 'CRITICAL', sector: 'Sector 4', desc: 'Main pipe burst' },
  { id: 2, lat: 28.6145, lng: 77.2110, type: 'Roads', priority: 'MEDIUM', sector: 'Sector 4', desc: 'Pothole cluster' },
  { id: 3, lat: 28.6120, lng: 77.2080, type: 'Electric', priority: 'LOW', sector: 'Sector 4', desc: 'Streetlight out' },
  { id: 4, lat: 28.6160, lng: 77.2050, type: 'Water', priority: 'CRITICAL', sector: 'Sector 5', desc: 'Sewage overflow' },
  { id: 5, lat: 28.6100, lng: 77.2150, type: 'Sanitary', priority: 'MEDIUM', sector: 'Sector 7', desc: 'Garbage pileup' },
];

const MapViewPage = () => {
  const [activeFilter, setActiveFilter] = useState('All Departments');
  const [showOptimizer, setShowOptimizer] = useState(true);

  return (
    <div className="h-[calc(100vh-120px)] relative rounded-xl overflow-hidden border border-border shadow-xl">
      {/* Search & Filter Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
        <div className="ios-glass border border-border rounded-xl flex items-center px-3 h-11 w-80 shadow-sm">
          <Search className="w-5 h-5 text-muted-foreground mr-2" />
          <input 
            placeholder="Search sector, complaint ID..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <Button variant="secondary" className="ios-glass h-11 shadow-sm gap-2 border border-border rounded-xl px-4">
                <Filter className="w-4 h-4" /> {activeFilter}
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveFilter('All Departments')}>All Departments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('Water')}>Water</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('Sanitary')}>Sanitary</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('Infrastructure')}>Infrastructure</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="secondary" size="icon" className="ios-glass h-11 w-11 shadow-sm border border-border rounded-xl">
          <Locate className="w-5 h-5" />
        </Button>
      </div>

      {/* Map Content */}
      <div className="w-full h-full z-0">
        <MapContainer 
          center={[28.6139, 77.2090]} 
          zoom={15} 
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {points.map(p => (
            <React.Fragment key={p.id}>
              <Marker position={[p.lat, p.lng]}>
                <Popup className="custom-popup">
                  <div className="p-1 space-y-2 min-w-[200px]">
                    <div className="flex justify-between items-center">
                      <Badge className={cn(
                        p.priority === 'CRITICAL' ? 'bg-civic-red' : 'bg-civic-orange',
                        'text-[10px] px-2 py-0'
                      )}>
                        {p.priority}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground">{p.sector}</span>
                    </div>
                    <h4 className="font-bold text-sm">{p.desc}</h4>
                    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Reported 2h ago
                    </p>
                    <Button size="sm" className="w-full h-7 text-[10px] bg-civic-cyan text-background font-bold">
                      RESOLVE NOW
                    </Button>
                  </div>
                </Popup>
              </Marker>
              <Circle 
                center={[p.lat, p.lng]} 
                radius={p.priority === 'CRITICAL' ? 150 : 80}
                pathOptions={{ 
                  color: p.priority === 'CRITICAL' ? '#ff4757' : '#ffa502',
                  fillColor: p.priority === 'CRITICAL' ? '#ff4757' : '#ffa502',
                  fillOpacity: 0.2,
                  weight: 1
                }}
              />
            </React.Fragment>
          ))}
          
          {/* Active Route Optimizer Path (Visual Proxy) */}
          {showOptimizer && (
             <Circle 
                center={[28.6139, 77.2090]} 
                radius={500}
                pathOptions={{ color: '#00d9ff', fillOpacity: 0, weight: 2, dashArray: '10, 10' }}
             />
          )}
        </MapContainer>
      </div>

      {/* Legend & Stats Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] space-y-4">
        <div className="ios-glass border border-border p-4 rounded-2xl shadow-sm space-y-4 min-w-[220px]">
           <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
             <Navigation className="w-4 h-4 text-primary" /> Map Legend
           </h4>
           <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-civic-red" /> Critical</span>
                <Badge variant="secondary" className="bg-civic-red/10 text-civic-red">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-civic-orange" /> Medium</span>
                <Badge variant="secondary" className="bg-civic-orange/10 text-civic-orange">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-civic-green" /> Low</span>
                <Badge variant="secondary" className="bg-civic-green/10 text-civic-green">8</Badge>
              </div>
           </div>
           <Separator />
           <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px] hover:bg-secondary">My Territory</Badge>
              <Badge variant="outline" className="text-[10px] hover:bg-secondary">Last 24h</Badge>
           </div>
        </div>
      </div>

      {/* Route Optimizer Sidebar */}
      <AnimatePresence>
        {showOptimizer && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-4 bottom-4 top-4 w-96 z-[1000]"
          >
            <Card className="h-full border-border flex flex-col ios-glass shadow-xl rounded-3xl overflow-hidden">
               <CardHeader className="bg-primary/5 border-b shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                       <Zap className="w-5 h-5 text-primary" /> Route Optimizer
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowOptimizer(false)} className="rounded-full">&times;</Button>
                  </div>
               </CardHeader>
               <CardContent className="flex-grow p-6 space-y-6">
                  <div className="bg-secondary/40 p-4 rounded-lg border border-border space-y-2">
                     <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Selected Cluster</p>
                     <p className="text-sm font-semibold">3 complaints in Sector 4-5 cluster</p>
                     <div className="flex justify-between items-center pt-2">
                        <div className="space-y-0.5">
                           <p className="text-[10px] text-muted-foreground uppercase">Estimated Time</p>
                           <p className="text-lg font-bold text-civic-cyan">2.5 hrs</p>
                        </div>
                        <div className="space-y-0.5 text-right">
                           <p className="text-[10px] text-muted-foreground uppercase">Distance</p>
                           <p className="text-lg font-bold">4.2 km</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Optimal Sequence:</h5>
                     <div className="space-y-3 relative pl-6">
                        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-border rounded-full" />
                        {[
                          { id: '#GR-0042', title: 'Main pipe burst', status: 'Priority', dot: 'bg-civic-red' },
                          { id: '#GR-0105', title: 'Sewage overflow', status: 'Secondary', dot: 'bg-civic-orange' },
                          { id: '#GR-0088', title: 'Pothole patch', status: 'On-route', dot: 'bg-civic-green' },
                        ].map((item, i) => (
                          <div key={i} className="relative group">
                            <div className={cn("absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-background", item.dot)} />
                            <div className="p-3 rounded-lg bg-secondary/20 border border-border group-hover:border-civic-cyan transition-colors">
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="font-bold text-civic-cyan uppercase">{item.id}</span>
                                <span className="text-muted-foreground">{item.status}</span>
                              </div>
                              <p className="text-xs font-medium">{item.title}</p>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="p-6 pt-0 border-t bg-secondary/10 shrink-0">
                  <Button className="w-full bg-civic-cyan text-background font-bold tracking-tight h-12 uppercase cyan-glow">
                    START NAVIGATION <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
         {!showOptimizer && (
            <Button onClick={() => setShowOptimizer(true)} className="bg-civic-cyan text-background font-bold gap-2">
              <Navigation className="w-4 h-4" /> RE-CALCULATE ROUTE
            </Button>
         )}
         <div className="bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-lg flex flex-col gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
         </div>
      </div>
    </div>
  );
};

export default MapViewPage;
