import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
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
  FaSearch, 
  FaCompass, 
  FaCog, 
  FaFilter, 
  FaCrosshairs, 
  FaExclamationTriangle, 
  FaBolt, 
  FaClock,
  FaArrowRight,
  FaPlus,
  FaMinus,
  FaTrashAlt
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Card, Button, Badge, SectionTitle } from '@/src/components/ui';
import { cn } from '@/src/lib/utils';

// Simple Separator replacement
const Separator = ({ className }) => (
  <div className={cn("shrink-0 bg-border h-px w-full my-4", className)} />
);

// Custom icon using FontAwesome SVG path
const createMarkerIcon = (priority) => {
  const color = priority === 'CRITICAL' ? '#ff3b30' : 
                priority === 'MEDIUM' ? '#ff9500' : '#34c759';
  
  return L.divIcon({
    className: 'custom-react-icon-marker',
    html: `
      <div style="color: ${color}; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); transform: scale(1.5);">
        <svg viewBox="0 0 384 512" width="24" height="24" fill="currentColor">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

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
    <div className="flex flex-col gap-2 animate-in fade-in duration-500 h-[calc(100vh-90px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionTitle subtitle="Live geospatial ledger of urban reports.">
          Interactive Civic Map
        </SectionTitle>
      </div>

      <div className="flex-1 relative rounded-[32px] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl z-0">
        {/* Search & Filter Bar */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
          <div className="ios-glass border border-black/5 dark:border-white/10 rounded-2xl flex items-center px-4 h-12 w-80 shadow-xl backdrop-blur-2xl">
            <FaSearch className="w-4 h-4 text-vision-slate-400 mr-3" />
            <input 
              placeholder="Search sector, complaint ID..." 
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-tight w-full outline-none placeholder:text-vision-slate-400"
            />
          </div>
          
          <Button variant="secondary" className="ios-glass h-12 shadow-xl gap-2 border border-black/5 dark:border-white/10 rounded-2xl px-4 backdrop-blur-2xl">
            <FaFilter className="w-4 h-4" /> {activeFilter}
          </Button>

          <Button variant="secondary" size="icon" className="ios-glass h-12 w-12 shadow-xl border border-black/5 dark:border-white/10 rounded-2xl backdrop-blur-2xl p-0 flex items-center justify-center">
            <FaCrosshairs className="w-5 h-5" />
          </Button>
        </div>

        {/* Map Content */}
        <div className="w-full h-full z-0 relative">
          {loading && (
            <div className="absolute inset-0 z-[2000] bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="ios-glass p-8 rounded-[40px] border border-black/5 dark:border-white/5 flex flex-col items-center gap-4 shadow-2xl">
                <AiOutlineLoading3Quarters className="w-10 h-10 text-vision-accent animate-spin" />
                <p className="text-[10px] font-bold tracking-widest text-foreground/80 uppercase">Syncing Geospatial Ledger...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 z-[2000] bg-background/60 backdrop-blur-md flex items-center justify-center p-6 text-center">
              <div className="ios-glass p-10 rounded-[40px] border border-destructive/20 max-w-sm space-y-6 shadow-2xl">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mx-auto">
                  <FaExclamationTriangle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Connection Failed</h3>
                  <p className="text-vision-slate-400 text-xs mt-2 font-medium tracking-normal">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full rounded-2xl h-12 font-bold border-black/10">
                  Retry Connection
                </Button>
              </div>
            </div>
          )}
          <MapContainer 
            center={[23.2599, 77.4126]} 
            zoom={15} 
            scrollWheelZoom={true}
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
                <Marker position={[p.lat, p.lng]} icon={createMarkerIcon(p.priority)}>
                  <Popup className="custom-popup">
                    <div className="p-2 space-y-3 min-w-[220px]">
                      <div className="flex justify-between items-center">
                        <Badge className={cn(
                          p.priority === 'CRITICAL' ? 'bg-civic-red border-none text-white' : 'bg-civic-orange border-none text-white',
                          'text-[9px] px-2 py-0.5'
                        )}>
                          {p.priority}
                        </Badge>
                        <span className="text-[9px] font-bold text-vision-slate-400 uppercase tracking-widest">{p.sector}</span>
                      </div>
                      <h4 className="font-bold text-sm leading-tight">{p.desc}</h4>
                      <p className="text-[9px] text-vision-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <FaClock className="w-3 h-3" /> Reported 2h ago
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full h-9 text-[10px] bg-vision-accent text-white font-bold tracking-tight rounded-xl"
                        onClick={() => navigate(`/complaints`)}
                      >
                        VIEW DETAILS
                      </Button>
                    </div>
                  </Popup>
                </Marker>
                <Circle 
                  center={[p.lat, p.lng]} 
                  radius={p.priority === 'CRITICAL' ? 150 : 80}
                  pathOptions={{ 
                    color: p.priority === 'CRITICAL' ? '#ff3b30' : '#ff9500',
                    fillColor: p.priority === 'CRITICAL' ? '#ff3b30' : '#ff9500',
                    fillOpacity: 0.15,
                    weight: 1.5
                  }}
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] space-y-4">
          <div className="ios-glass border border-black/5 dark:border-white/10 p-5 rounded-3xl shadow-2xl min-w-[240px] backdrop-blur-2xl">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-vision-slate-400 flex items-center gap-2 mb-4">
               <FaCompass className="w-4 h-4 text-vision-accent" /> Map Legend
             </h4>
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight">
                    <div className="w-2.5 h-2.5 rounded-full bg-civic-red shadow-lg shadow-red-500/20" /> 
                    Critical Reports
                  </span>
                  <Badge className="bg-civic-red/10 text-civic-red border-none text-[9px]">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight">
                    <div className="w-2.5 h-2.5 rounded-full bg-civic-orange shadow-lg shadow-orange-500/20" /> 
                    Medium Priority
                  </span>
                  <Badge className="bg-civic-orange/10 text-civic-orange border-none text-[9px]">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight">
                    <div className="w-2.5 h-2.5 rounded-full bg-civic-green shadow-lg shadow-green-500/20" /> 
                    Low Priority
                  </span>
                  <Badge className="bg-civic-green/10 text-civic-green border-none text-[9px]">8</Badge>
                </div>
             </div>
             <Separator className="bg-black/5 dark:bg-white/5 my-4" />
             <div className="flex gap-2">
                <Badge className="text-[8px] border-black/5 dark:border-white/10 py-1 font-bold uppercase tracking-widest">Active Zone</Badge>
                <Badge className="text-[8px] border-black/5 dark:border-white/10 py-1 font-bold uppercase tracking-widest">Global Feed</Badge>
             </div>
          </div>
        </div>

        {/* Route Optimizer Sidebar (Adapted for Users as "Resolution Tracker") */}
        <AnimatePresence>
          {showOptimizer && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute right-4 bottom-4 top-4 w-96 z-[1000]"
            >
              <Card className="h-full border-black/5 dark:border-white/10 flex flex-col ios-glass shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-3xl">
                 <div className="p-6 border-b border-black/5 dark:border-white/5 shrink-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
                         <FaBolt className="w-5 h-5 text-vision-accent" /> Resolution Hub
                      </h4>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-full min-h-0" onClick={() => setShowOptimizer(false)}>&times;</Button>
                    </div>
                 </div>
                 <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    <div className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/5 space-y-3 shadow-inner">
                       <p className="text-[9px] text-vision-slate-400 uppercase font-bold tracking-widest">Current Efficiency</p>
                       <p className="text-xs font-bold uppercase tracking-tight">3 reports being resolved in your area</p>
                       <div className="flex justify-between items-center pt-3">
                          <div className="space-y-1">
                             <p className="text-[8px] text-vision-slate-400 uppercase font-bold tracking-widest">Average Wait</p>
                             <p className="text-xl font-bold text-vision-accent">2.5 hrs</p>
                          </div>
                          <div className="space-y-1 text-right">
                             <p className="text-[8px] text-vision-slate-400 uppercase font-bold tracking-widest">Area Coverage</p>
                             <p className="text-xl font-bold">94%</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-5">
                       <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-vision-slate-400">Live Status Stream:</h5>
                       <div className="space-y-4 relative pl-6">
                          <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-black/5 dark:bg-white/5 rounded-full" />
                          {[
                            { id: '#GR-0042', title: 'Main pipe burst', status: 'Fixing Now', dot: 'bg-civic-red shadow-red-500/40' },
                            { id: '#GR-0105', title: 'Sewage overflow', status: 'En-route', dot: 'bg-civic-orange shadow-orange-500/40' },
                            { id: '#GR-0088', title: 'Pothole patch', status: 'Scheduled', dot: 'bg-civic-green shadow-green-500/40' },
                          ].map((item, i) => (
                            <div key={i} className="relative group">
                              <div className={cn("absolute -left-[22.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0b1437] shadow-lg", item.dot)} />
                              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:border-vision-accent/30 transition-all cursor-pointer">
                                <div className="flex justify-between text-[9px] font-bold mb-1.5">
                                  <span className="text-vision-accent uppercase tracking-widest">{item.id}</span>
                                  <span className="text-vision-slate-400 uppercase tracking-widest">{item.status}</span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-tight">{item.title}</p>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="p-6 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 shrink-0">
                    <Button className="w-full h-12 bg-vision-accent text-white font-bold tracking-widest uppercase rounded-2xl shadow-xl shadow-blue-500/20 group">
                      EXPLORE ALL REPORTS <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
           {!showOptimizer && (
              <Button onClick={() => setShowOptimizer(true)} className="bg-vision-accent text-white font-bold gap-3 h-12 px-6 rounded-2xl shadow-2xl shadow-blue-500/20 border-none uppercase tracking-widest text-[10px]">
                <FaBolt className="w-4 h-4" /> REVEAL RESOLUTION HUB
              </Button>
           )}
           
           <div className="ios-glass p-2 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl flex flex-col gap-1 backdrop-blur-2xl">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors rounded-xl min-h-0"
                onClick={() => map?.zoomIn()}
                title="Zoom In"
              >
                <FaPlus className="w-5 h-5 text-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors rounded-xl min-h-0"
                onClick={() => map?.zoomOut()}
                title="Zoom Out"
              >
                <FaMinus className="w-5 h-5 text-foreground" />
              </Button>
              <div className="h-px bg-black/5 dark:bg-white/10 my-1 mx-2" />
              <Button variant="ghost" size="icon" className="h-10 w-10 min-h-0"><FaCog className="w-5 h-5 text-vision-slate-400" /></Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 min-h-0"><FaTrashAlt className="w-5 h-5 text-vision-slate-400" /></Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
