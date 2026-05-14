import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayersControl, LayerGroup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useSosStore from '../store/useSosStore';
import { 
  Shield, AlertCircle, MapPin, Wind, Droplets, Activity, Crosshair, 
  Search, Filter, Info, Users, Truck, Clock, Target, ChevronRight,
  Maximize2, Database, Zap, Globe, Thermometer, Waves, Flame, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TACTICAL ICON GENERATOR ---
const getTacticalIcon = (type, severity, status) => {
  if (status === 'En Route') {
    return L.divIcon({
      className: 'tactical-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full bg-[#0ea5e9] opacity-30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-[#020617] border-2 border-[#0ea5e9] flex items-center justify-center shadow-[0_0_20px_#0ea5e9]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  const color = severity === 'CRITICAL' ? '#ef4444' : severity === 'HIGH' ? '#f59e0b' : '#3b82f6';
  const pulseClass = severity === 'CRITICAL' ? 'animate-ping' : '';
  
  return L.divIcon({
    className: 'tactical-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-[${color}] opacity-20 ${pulseClass}"></div>
        <div class="w-5 h-5 rounded-lg bg-[#020617] border-2 border-[${color}] flex items-center justify-center shadow-[0_0_15px_${color}] rotate-45">
          <div class="-rotate-45">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// --- MAP CONTROL COMPONENTS ---
const MapController = ({ reports, selectedIncident }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedIncident) {
      map.flyTo([selectedIncident.location.lat, selectedIncident.location.lng], 14, { duration: 1.5 });
    }
  }, [selectedIncident, map]);

  return null;
};

const LiveMap = () => {
  const { reports, fetchReports, isLoading } = useSosStore();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 60000); 
    return () => clearInterval(interval);
  }, [fetchReports]);

  // Filtering Logic
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesType = filterType === 'ALL' || r.type?.toUpperCase() === filterType;
      const matchesSearch = !searchQuery || 
        r.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.callerName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [reports, filterType, searchQuery]);

  const stats = useMemo(() => ({
    total: filteredReports.length,
    critical: filteredReports.filter(r => r.severity === 'CRITICAL').length,
    population: filteredReports.reduce((acc, r) => acc + (r.affected_people || 0), 0)
  }), [filteredReports]);

  return (
<<<<<<< HEAD
    <div className="h-full relative glass-panel overflow-hidden border-0">
      <MapContainer center={center} zoom={12} className="h-full w-full z-0">
        <TileLayer 
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
          attribution='&copy; Esri'
        />
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" 
          opacity={0.6}
        />
        
        {reports.map((report) => (
          <div key={report.id}>
            <Marker position={[report.location.lat, report.location.lng]}>
              <Popup>
                <div className="text-slate-900 p-1">
                  <h4 className="font-bold border-b border-slate-200 mb-1">{report.severity} Alert</h4>
                  <p className="text-xs mb-1">{report.summary}</p>
                  <p className="text-[10px] text-slate-500">From: {report.caller_phone}</p>
=======
    <div className="h-full w-full relative bg-[#020617] flex overflow-hidden font-sans">
      {/* --- LEFT INTELLIGENCE SIDEBAR (Restored Dark UI) --- */}
      <aside className="w-80 h-full bg-slate-950/80 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
              <Globe className="text-primary" size={22} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-tighter italic">Global Intel</h2>
              <p className="text-[8px] text-primary font-bold uppercase tracking-widest">Real-Time Sync Active</p>
            </div>
          </div>

          <div className="relative group">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH LOCATIONS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono tracking-wider"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Incident Feed</span>
            <span className="text-[10px] font-mono text-primary">{filteredReports.length} Active</span>
          </div>

          {filteredReports.map(report => (
            <motion.div 
              key={report.id}
              layout
              onClick={() => setSelectedIncident(report)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedIncident?.id === report.id 
                  ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  report.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                  report.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {report.type || 'Alert'}
                </span>
                <span className="text-[9px] font-mono text-slate-500">{new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              {/* FIXED: Text Clipping - break-words and padding */}
              <h4 className="text-xs font-bold text-white mb-1 uppercase break-words leading-tight">
                {report.address}
              </h4>
              <div className="flex items-center gap-3 text-[9px] text-slate-400 mt-2">
                <span className="flex items-center gap-1"><Users size={10} /> {report.affected_people || 0}</span>
                <span className="flex items-center gap-1"><Activity size={10} /> Risk: {report.risk_level}/10</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/5">
           <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                 <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Global Load</p>
                 <p className="text-sm font-black text-white">LOW</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                 <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Sat Link</p>
                 <p className="text-sm font-black text-safe italic underline decoration-safe/30">98% SYNC</p>
              </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN REALISTIC MAP (RESTORED MAP THEME) --- */}
      <section className="flex-1 h-full relative">
        <MapContainer 
          center={[20, 0]} 
          zoom={3} 
          className="h-full w-full z-0"
          zoomControl={false}
        >
          {/* REALISTIC MAP THEME: Green land, Blue water, White roads */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Disaster Heatmap">
              <LayerGroup>
                {reports.map(r => (
                  <Circle 
                    key={`heat-${r.id}`}
                    center={[r.location.lat, r.location.lng]}
                    radius={150000}
                    pathOptions={{
                      fillColor: r.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                      fillOpacity: 0.1,
                      color: 'transparent',
                      weight: 0
                    }}
                  />
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
            
            <LayersControl.Overlay checked name="Atmospheric Radar">
              <TileLayer
                url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY || 'e56e21ee34437fa8973c55863aaca3c8'}`}
                opacity={0.3}
              />
            </LayersControl.Overlay>
          </LayersControl>

          <MapController reports={filteredReports} selectedIncident={selectedIncident} />

          {filteredReports.map((report) => (
            <Marker 
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={getTacticalIcon(report.type, report.severity, report.status)}
              eventHandlers={{ click: () => setSelectedIncident(report) }}
            >
              <Popup className="tactical-popup">
                <div className="p-3 bg-slate-900 text-white min-w-[200px]">
                   <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Tactical Analysis</span>
                   {/* FIXED: Clipping in popup */}
                   <h4 className="font-bold text-sm mb-2 break-words leading-tight">{report.address}</h4>
                   <button 
                     onClick={() => setSelectedIncident(report)}
                     className="w-full py-1.5 bg-primary/20 border border-primary/40 text-[10px] font-black uppercase text-primary"
                   >
                     Inspect Data
                   </button>
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a
                </div>
              </Popup>
            </Marker>
          ))}
          
          <ZoomControl position="bottomright" />
        </MapContainer>

        {/* --- MAP HUD OVERLAYS (Restored to Top-Left with Compact Sizing) --- */}
        <div className="absolute top-6 left-6 z-[1000] pointer-events-none flex flex-col gap-3">
          <div className="bg-slate-950/80 backdrop-blur-md p-3 flex items-center gap-4 border border-white/10 rounded-xl pointer-events-auto shadow-2xl">
             <div className="flex flex-col">
                <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Incidents</span>
                <span className="text-sm font-black text-white">{stats.total}</span>
             </div>
             <div className="w-px h-6 bg-white/10"></div>
             <div className="flex flex-col">
                <span className="text-[7px] text-red-500/60 font-black uppercase tracking-widest mb-0.5">Critical</span>
                <span className="text-sm font-black text-red-500">{stats.critical}</span>
             </div>
             <div className="w-px h-6 bg-white/10"></div>
             <div className="flex flex-col">
                <span className="text-[7px] text-primary/60 font-black uppercase tracking-widest mb-0.5">Impact</span>
                <span className="text-sm font-black text-primary">{stats.population.toLocaleString()}</span>
             </div>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-xl pointer-events-auto overflow-x-auto no-scrollbar flex items-center gap-1.5 shadow-2xl w-fit">
             {['ALL', 'EARTHQUAKE', 'FLOOD', 'CYCLONE', 'VOLCANO'].map(t => (
               <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-[8px] font-black uppercase tracking-tighter whitespace-nowrap px-2 py-1 rounded-md transition-all ${
                  filterType === t ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'
                }`}
               >
                 {t}
               </button>
             ))}
          </div>
        </div>

        {/* --- DETAIL INTELLIGENCE OVERLAY (Restored Dark UI) --- */}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-0 right-0 h-full w-[400px] z-[1100] bg-slate-950/95 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 relative">
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                  <AlertCircle size={12} className="text-red-500" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Incident Profile Alpha-1</span>
                </div>

                {/* FIXED: Title Clipping - break-words and leading-tight */}
                <h2 className="text-3xl font-black text-white leading-tight mb-2 uppercase italic tracking-tighter break-words">
                  {selectedIncident.type || 'Emergency'} Detected
                </h2>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-2 break-words">
                  <MapPin size={14} className="text-primary" />
                  {selectedIncident.address}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                         <Users size={14} />
                         <span className="text-[9px] font-black uppercase">Impact Score</span>
                      </div>
                      <p className="text-xl font-black text-white">{selectedIncident.affected_people || '---'}</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">Confirmed Souls</p>
                   </div>
                   <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                         <Zap size={14} />
                         <span className="text-[9px] font-black uppercase">Risk Index</span>
                      </div>
                      <p className="text-xl font-black text-amber-500">{selectedIncident.risk_level}/10</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">AI Calculated</p>
                   </div>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <Activity className="text-primary" size={16} />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AI Intelligence Summary</h4>
                   </div>
                   <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-primary" />
                      {/* FIXED: Summary Clipping - break-words */}
                      <p className="text-sm text-slate-300 leading-relaxed italic break-words">
                        "{selectedIncident.aiSummary || 'Decrypting event telemetry... monitoring secondary seismic waves and structural integrity.'}"
                      </p>
                   </div>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <Database className="text-cyan-400" size={16} />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Resource Allocation</h4>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {(selectedIncident.resources || ['Alpha Rescue', 'Trauma Medics', 'Aerial Drone', 'Heavy Lift']).map(r => (
                        <div key={r} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {r}
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40">
                 <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-95">
                    INITIATE EMERGENCY DISPATCH
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- REFRESH LOADER --- */}
      {isLoading && (
        <div className="absolute bottom-10 right-10 z-[2000] bg-slate-950 p-4 rounded-xl shadow-2xl border border-white/5 flex items-center gap-4">
           <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Syncing Intel...</span>
        </div>
      )}
    </div>
  );
};

export default LiveMap;
