import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
  useMapEvents
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
  Loader2,
  MapPin,
  Crosshair,
  Info
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
import {
  solveRoute,
  routeLengthKm,
  estimateHours,
  useOfficerLocation,
  clusterComplaints,
  haversineKm
} from '@/lib/routeOptimizer';

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

const FitBoundsLayer = ({ points }) => {
  const map = useMap();
  React.useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [points, map]);
  return null;
};

const priorityColors = {
  CRITICAL: '#ff4757',
  MEDIUM: '#ffa502',
  LOW: '#2ed573'
};

const priorityDotColors = {
  CRITICAL: 'bg-civic-red',
  MEDIUM: 'bg-civic-orange',
  LOW: 'bg-civic-green'
};

const priorityStatusMap = {
  CRITICAL: 'Priority',
  MEDIUM: 'Secondary',
  LOW: 'On-route'
};

const MapViewPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Departments');
  const [showOptimizer, setShowOptimizer] = useState(true);
  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [routeOrder, setRouteOrder] = useState([]);
  const [routeStats, setRouteStats] = useState(null);
  const [routeKey, setRouteKey] = useState(0); // force recalculation visual

  const { location: officerLocation, locating: locatingOfficer, locError: officerLocError } = useOfficerLocation();

  // Fetch complaints
  useEffect(() => {
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

        // Auto-select all critical + medium by default
        const autoSelected = new Set(
          mappedPoints.filter(p => p.priority === 'CRITICAL' || p.priority === 'MEDIUM').map(p => p.id)
        );
        setSelectedIds(autoSelected);
      } catch (err) {
        setError(err.message);
        console.error('Map fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllComplaints();
  }, []);

  // Recompute route whenever selected points, officer location, or recalculation key changes
  useEffect(() => {
    if (!officerLocation || points.length === 0) return;

    const selected = points.filter(p => selectedIds.has(p.id));
    if (selected.length === 0) {
      setRouteOrder([]);
      setRouteStats(null);
      return;
    }

    // Build coordinate list: [officerLocation, ...selected complaint coords]
    const coords = [officerLocation, ...selected.map(p => [p.lat, p.lng])];
    // Officer is index 0; complaints are 1..N
    const order = solveRoute(coords, 0);

    // Translate indices back to point IDs + position info
    const orderedRoute = order.map(idx => {
      if (idx === 0) {
        return { type: 'officer', lat: officerLocation[0], lng: officerLocation[1], id: 'OFFICER' };
      }
      const p = selected[idx - 1];
      return { type: 'complaint', ...p };
    });

    const totalKm = routeLengthKm(coords, order);
    const estHours = estimateHours(totalKm);

    setRouteOrder(orderedRoute);
    setRouteStats({
      totalKm: totalKm.toFixed(1),
      estHours: estHours.toFixed(1),
      numStops: selected.length,
      clusters: clusterComplaints(selected.map(p => ({ lat: p.lat, lng: p.lng, id: p.id })))
    });

    setRouteKey(prev => prev + 1);
  }, [officerLocation, points, selectedIds]);

  const filteredPoints = useMemo(() => {
    if (activeFilter === 'All Departments') return points;
    return points.filter(p => p.type === activeFilter);
  }, [points, activeFilter]);

  const togglePoint = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRecalculate = useCallback(() => {
    setRouteKey(prev => prev + 1);
  }, []);

  const handleLocateOfficer = useCallback(() => {
    if (officerLocation && map) {
      map.flyTo(officerLocation, 15, { duration: 0.8 });
    }
  }, [officerLocation, map]);

  // Polyline path from the route order
  const routePath = useMemo(() => {
    return routeOrder.map(p => [p.lat, p.lng]);
  }, [routeOrder]);

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

        <Button
          variant="secondary"
          size="icon"
          className="ios-glass h-11 w-11 shadow-sm border border-border rounded-xl"
          onClick={handleLocateOfficer}
          title="Locate Officer"
        >
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

        {!loading && !error && (
          <MapContainer
            center={officerLocation || [23.2599, 77.4126]}
            zoom={14}
            scrollWheelZoom={true}
            zoomControl={false}
            className="w-full h-full"
            key={routeKey}
          >
            <MapInstanceCapture setMap={setMap} />
            <FitBoundsLayer points={filteredPoints} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Officer location marker */}
            {officerLocation && (
              <Marker position={officerLocation}>
                <Popup>
                  <div className="p-1 space-y-1">
                    <p className="font-bold text-sm flex items-center gap-1">
                      <Crosshair className="w-4 h-4 text-primary" /> Your Location
                    </p>
                    <p className="text-[10px] text-muted-foreground">Officer base position</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Complaint markers */}
            {filteredPoints.map(p => (
              <React.Fragment key={p.id}>
                <Marker
                  position={[p.lat, p.lng]}
                  eventHandlers={{
                    click: () => togglePoint(p.id),
                  }}
                  icon={L.divIcon({
                    className: '',
                    html: `<div style="
                      width: 24px;
                      height: 24px;
                      background: ${selectedIds.has(p.id) ? priorityColors[p.priority] : '#ffffff'};
                      border: 2px solid ${priorityColors[p.priority]};
                      border-radius: 50%;
                      box-shadow: 0 0 8px ${priorityColors[p.priority]}80;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: ${selectedIds.has(p.id) ? '#fff' : priorityColors[p.priority]};
                      font-size: 10px;
                      font-weight: bold;
                      cursor: pointer;
                      transition: all 0.2s;
                    "">
                      ${selectedIds.has(p.id) ? '✓' : '●'}
                    </div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                  })}
                >
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className={cn(
                            "w-full h-7 text-[10px] font-bold transition-all",
                            selectedIds.has(p.id)
                              ? "bg-civic-cyan text-background"
                              : "bg-background text-foreground border border-border"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/plans/${p.id}`);
                          }}
                        >
                          {selectedIds.has(p.id) ? '✓ SELECTED' : 'SELECT'}
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={[p.lat, p.lng]}
                  radius={p.priority === 'CRITICAL' ? 150 : 80}
                  pathOptions={{
                    color: priorityColors[p.priority],
                    fillColor: priorityColors[p.priority],
                    fillOpacity: 0.1,
                    weight: 1
                  }}
                />
              </React.Fragment>
            ))}

            {/* Optimized route polyline */}
            {showOptimizer && routePath.length >= 2 && (
              <Polyline
                positions={routePath}
                pathOptions={{
                  color: '#00d9ff',
                  weight: 4,
                  opacity: 0.8,
                  dashArray: null,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}

            {/* Route direction arrows along the polyline */}
            {showOptimizer && routePath.length >= 2 && (
              <>
                {routePath.slice(0, -1).map((start, i) => {
                  const end = routePath[i + 1];
                  const midLat = (start[0] + end[0]) / 2;
                  const midLng = (start[1] + end[1]) / 2;
                  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * (180 / Math.PI);
                  return (
                    <Marker
                      key={`arrow-${i}`}
                      position={[midLat, midLng]}
                      icon={L.divIcon({
                        className: '',
                        html: `<div style="
                          font-size: 18px;
                          transform: rotate(${angle + 90}deg);
                          transform-origin: center;
                          pointer-events: none;
                          line-height: 1;
                        ">➤</div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                      })}
                      interactive={false}
                    />
                  );
                })}
              </>
            )}

            {/* Start/End markers on route */}
            {showOptimizer && routeOrder.length > 0 && (
              <>
                <Marker
                  position={[routeOrder[0].lat, routeOrder[0].lng]}
                  icon={L.divIcon({
                    className: '',
                    html: `<div style="
                      width: 32px;
                      height: 32px;
                      background: #00d9ff;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: #000;
                      font-size: 14px;
                      font-weight: bold;
                      box-shadow: 0 0 12px #00d9ffaa;
                    ">S</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                  })}
                >
                  <Popup>
                    <p className="font-bold text-sm">🚗 Start — Officer Position</p>
                    <p className="text-[10px] text-muted-foreground">Optimization begins here</p>
                  </Popup>
                </Marker>

                {routeOrder.length > 1 && (
                  <Marker
                    position={[routeOrder[routeOrder.length - 1].lat, routeOrder[routeOrder.length - 1].lng]}
                    icon={L.divIcon({
                      className: '',
                      html: `<div style="
                        width: 32px;
                        height: 32px;
                        background: #2ed573;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #000;
                        font-size: 14px;
                        font-weight: bold;
                        box-shadow: 0 0 12px #2ed573aa;
                      ">E</div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                    })}
                  >
                    <Popup>
                      <p className="font-bold text-sm">🏁 End — Last Stop</p>
                      <p className="text-[10px] text-muted-foreground">Route optimization complete</p>
                    </Popup>
                  </Marker>
                )}
              </>
            )}
          </MapContainer>
        )}
      </div>

      {/* Legend & Stats Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] space-y-4">
        <div className="ios-glass border border-border p-4 rounded-2xl shadow-sm space-y-4 min-w-[220px]">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" /> Map Legend
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-civic-red" /> Critical
              </span>
              <Badge variant="secondary" className="bg-civic-red/10 text-civic-red">
                {points.filter(p => p.priority === 'CRITICAL').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-civic-orange" /> Medium
              </span>
              <Badge variant="secondary" className="bg-civic-orange/10 text-civic-orange">
                {points.filter(p => p.priority === 'MEDIUM').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-civic-green" /> Low
              </span>
              <Badge variant="secondary" className="bg-civic-green/10 text-civic-green">
                {points.filter(p => p.priority === 'LOW').length}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] hover:bg-secondary">My Territory</Badge>
            <Badge variant="outline" className="text-[10px] hover:bg-secondary">Last 24h</Badge>
            {officerLocation && (
              <Badge variant="outline" className="text-[10px] bg-civic-cyan/10 text-civic-cyan border-civic-cyan/30">
                📍 Officer Located
              </Badge>
            )}
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
            className="absolute right-4 bottom-4 top-4 w-[28rem] z-[1000]"
          >
            <Card className="h-full border-border flex flex-col ios-glass shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> Route Optimizer
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={handleRecalculate}
                      title="Recalculate route"
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowOptimizer(false)} className="rounded-full">
                      &times;
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow p-6 space-y-5 overflow-y-auto">
                {/* Officer location status */}
                <div className={cn(
                  "p-3 rounded-lg border text-sm flex items-center gap-2",
                  officerLocation
                    ? "bg-civic-green/10 border-civic-green/30 text-civic-green"
                    : "bg-civic-red/10 border-civic-red/30 text-civic-red"
                )}>
                  {officerLocation ? (
                    <>
                      <Crosshair className="w-4 h-4" />
                      <span>Officer located — route starts from your position</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {officerLocError || 'Waiting for location...'} — defaulting to map center
                      </span>
                    </>
                  )}
                </div>

                {/* Stats card */}
                {routeStats ? (
                  <div className="bg-secondary/40 p-4 rounded-lg border border-border space-y-3">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                      Route Summary
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase">Stops</p>
                        <p className="text-lg font-bold text-civic-cyan">{routeStats.numStops}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase">Distance</p>
                        <p className="text-lg font-bold">{routeStats.totalKm} km</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase">Est. Time</p>
                        <p className="text-lg font-bold text-civic-orange">{routeStats.estHours} hrs</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/40 p-4 rounded-lg border border-border text-center">
                    <p className="text-sm text-muted-foreground">
                      Select complaints to build an optimized route.
                    </p>
                  </div>
                )}

                {/* Complaint selection list */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Complaints to Visit
                    <Badge variant="secondary" className="text-[9px]">
                      {selectedIds.size}/{points.length}
                    </Badge>
                  </h5>

                  <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                    {points.map((p) => {
                      const isSelected = selectedIds.has(p.id);
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                            isSelected
                              ? "bg-primary/10 border-primary/30"
                              : "bg-transparent border-border/40 hover:bg-secondary/30"
                          )}
                          onClick={() => togglePoint(p.id)}
                        >
                          <div
                            className={cn(
                              "w-2.5 h-2.5 rounded-full flex-shrink-0",
                              priorityDotColors[p.priority]
                            )}
                          />
                          <div className="flex-grow min-w-0 truncate">
                            <p className="font-medium truncate">{p.desc}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {p.sector}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              "text-[9px] px-1.5 py-0 h-4 font-black rounded-full flex-shrink-0",
                              isSelected
                                ? "bg-civic-cyan text-background"
                                : "bg-border text-muted-foreground"
                            )}
                          >
                            {isSelected ? "ON" : "OFF"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Optimal Sequence */}
                {routeOrder.length > 1 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      Optimized Sequence
                    </h5>
                    <div className="space-y-2 relative pl-5">
                      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-border rounded-full" />
                      {routeOrder.map((stop, i) => {
                        const isFirst = i === 0;
                        const isLast = i === routeOrder.length - 1;
                        const dotColor = isFirst
                          ? 'bg-civic-cyan'
                          : isLast
                          ? 'bg-civic-green'
                          : priorityDotColors[stop.priority] || 'bg-border';

                        return (
                          <div key={`${stop.id || 'officer'}-${i}`} className="relative group">
                            <div
                              className={cn(
                                "absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-2 border-background",
                                dotColor
                              )}
                            />
                            <div className="p-2.5 rounded-lg bg-secondary/20 border border-border group-hover:border-civic-cyan transition-colors">
                              <div className="flex justify-between text-[10px] mb-0.5">
                                <span className="font-bold text-civic-cyan uppercase">
                                  {isFirst
                                    ? '🚗 START'
                                    : isLast
                                    ? '🏁 END'
                                    : `#GR-${String(stop.id).padStart(4, '0')}`}
                                </span>
                                <span className="text-muted-foreground">
                                  {isFirst
                                    ? 'Departure'
                                    : isLast
                                    ? 'Finish'
                                    : priorityStatusMap[stop.priority] || 'Stop'}
                                </span>
                              </div>
                              <p className="text-xs font-medium truncate">
                                {isFirst
                                  ? officerLocation
                                    ? 'Officer Current Position'
                                    : 'Map Center'
                                  : stop.desc}
                              </p>
                              {!isFirst && !isLast && (
                                <p className="text-[9px] text-muted-foreground mt-0.5">
                                  {stop.sector} · {stop.type}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 pt-0 border-t bg-secondary/10 shrink-0">
                <Button
                  className="w-full bg-civic-cyan text-background font-bold tracking-tight h-11 uppercase cyan-glow text-sm"
                  onClick={() => {
                    if (routeOrder.length > 0) {
                      const first = routeOrder[0];
                      if (map && first.lat && first.lng) {
                        map.flyTo([first.lat, first.lng], 15, { duration: 0.8 });
                      }
                    }
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  START NAVIGATION
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recalculate floating button when optimizer is hidden */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {!showOptimizer && (
          <Button
            onClick={() => setShowOptimizer(true)}
            className="bg-civic-cyan text-background font-bold gap-2"
          >
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;