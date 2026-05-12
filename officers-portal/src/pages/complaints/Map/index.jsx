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
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Plus,
  Minus,
  Loader2
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



const MapInstanceCapture = ({ setMap }) => {
  const map = useMap();
  React.useEffect(() => {
    if (map) setMap(map);
  }, [map, setMap]);
  return null;
};

const MapViewPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Departments');
  const [showOptimizer, setShowOptimizer] = useState(true);
  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchAllComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://app.totalchaos.online/complaint/all');
        if (!response.ok) throw new Error('Failed to fetch global map data');
        
        const data = await response.json();
        const mappedPoints = data.map(item => ({
          id: item.ref,
          lat: item.lat,
          lng: item.lng,
          type: item.category,
          priority: item.is_urgent ? 'CRITICAL' : 
                   (item.ai_severity === 'high' ? 'CRITICAL' : 
                    item.ai_severity === 'medium' ? 'MEDIUM' : 'LOW'),
          sector: item.address || `Sector ${item.pincode}`,
          desc: item.title,
          status: item.status
        }));
        
        setPoints(mappedPoints);
      } catch (err) {
        setError(err.message);
        console.error('Map fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllComplaints();
  }, []);

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
      <div className="w-full h-full z-0 relative">
        {loading && (
          <div className="absolute inset-0 z-[2000] bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="ios-glass p-6 rounded-3xl border border-border/50 flex flex-col items-center gap-3 shadow-2xl">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold tracking-tight text-foreground/80 uppercase">Syncing Geospatial Ledger...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-[2000] bg-background/60 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="ios-glass p-8 rounded-[32px] border border-destructive/20 max-w-sm space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Connection Failed</h3>
                <p className="text-muted-foreground text-sm mt-1">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full rounded-2xl h-12 font-bold border-border/50">
                Retry Connection
              </Button>
            </div>
          </div>
        )}
        <MapContainer 
          center={[23.2599, 77.4126]} 
          zoom={15} 
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full"
        >
          <MapInstanceCapture setMap={setMap} />
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
                    <Button 
                      size="sm" 
                      className="w-full h-7 text-[10px] bg-civic-cyan text-background font-bold"
                      onClick={() => navigate(`/plans/${p.id}`)}
                    >
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-secondary transition-colors"
              onClick={() => map?.zoomIn()}
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-secondary transition-colors"
              onClick={() => map?.zoomOut()}
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Separator className="my-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
         </div>
      </div>
    </div>
  );
};

export default MapViewPage;
