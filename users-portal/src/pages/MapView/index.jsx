import { useState, useEffect } from 'react';
import { Card, SectionTitle, Badge, Button } from '@/src/components/ui';
import { MapPin, Filter, ZoomIn, ZoomOut, Layers, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import MapSidebar from './MapSidebar';

// Leaflet imports
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon issue for default icons if needed
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MOCK_MARKERS = [
  { id: 1, lat: 28.6139, lng: 77.2090, status: 'Filed', category: 'Water' },
  { id: 2, lat: 28.6145, lng: 77.2110, status: 'Under Review', category: 'Electricity' },
  { id: 3, lat: 28.6120, lng: 77.2080, status: 'Resolved', category: 'Sanitation' },
  { id: 4, lat: 28.6160, lng: 77.2050, status: 'Filed', category: 'Roads' },
  { id: 5, lat: 28.6100, lng: 77.2150, status: 'Under Review', category: 'Safety' },
];

// Custom component to handle map controls from external buttons
function MapController({ zoom }) {
  const map = useMap();
  useEffect(() => {
    if (zoom === 'in') map.zoomIn();
    if (zoom === 'out') map.zoomOut();
  }, [zoom, map]);
  return null;
}

export default function MapView() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [zoomAction, setZoomAction] = useState(null);

  const createCustomIcon = (status) => {
    const color = status === 'Resolved' ? '#22c55e' : 
                  status === 'Under Review' ? '#f59e0b' : 
                  '#0075ff';
    
    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${color}; transform: scale(1.2);">
               <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
             </div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

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
        <Card className="flex-1 border-black/5 dark:border-white/5 relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900/50 z-0">
          <MapContainer 
            center={[28.6139, 77.2090]} 
            zoom={15} 
            zoomControl={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapController zoom={zoomAction} />
            
            {MOCK_MARKERS.map((marker) => (
              <Marker 
                key={marker.id} 
                position={[marker.lat, marker.lng]}
                icon={createCustomIcon(marker.status)}
                eventHandlers={{
                  click: () => setSelectedMarker(marker),
                }}
              />
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[1000]">
            <button 
              onClick={() => { setZoomAction('in'); setTimeout(() => setZoomAction(null), 100); }}
              className="w-10 h-10 glass border-black/5 dark:border-white/10 rounded-xl shadow-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all text-foreground"
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={() => { setZoomAction('out'); setTimeout(() => setZoomAction(null), 100); }}
              className="w-10 h-10 glass border-black/5 dark:border-white/10 rounded-xl shadow-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all text-foreground"
            >
              <ZoomOut size={18} />
            </button>
            <button className="w-12 h-12 bg-vision-accent text-white rounded-2xl shadow-lg shadow-blue-500/40 flex items-center justify-center hover:bg-blue-600 mt-2 transition-all group">
              <MapPin size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Floating Search */}
          <div className="absolute top-6 left-6 right-24 md:right-auto md:w-80 z-[1000]">
            <Card className="p-2.5 glass border-black/5 dark:border-white/10 flex items-center gap-3 backdrop-blur-2xl rounded-2xl bg-white/50 dark:bg-black/50">
               <Search className="ml-2 w-4 h-4 text-vision-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search area..." 
                 className="flex-1 bg-transparent border-none text-xs outline-none placeholder:text-vision-slate-400 font-bold uppercase tracking-tight text-foreground"
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

