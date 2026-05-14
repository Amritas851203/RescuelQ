import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayerGroup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Satellite, Radio, Ambulance, Truck, Ship, Navigation, 
  BrainCircuit, Activity, Shield, Maximize2, Minimize2, Crosshair, 
  Search, Lock, Unlock, Zap 
} from 'lucide-react';

// --- SMOOTH MOVING MARKER COMPONENT ---
const MovingMarker = ({ position, icon, children, eventHandlers }) => {
  if (!position || position[0] === undefined || position[1] === undefined) return null;
  
  const [currentPos, setCurrentPos] = useState(position);
  const prevPos = useRef(position);
  const animationRef = useRef(null);

  useEffect(() => {
    if (position[0] !== prevPos.current[0] || position[1] !== prevPos.current[1]) {
      const startPos = prevPos.current;
      const endPos = position;
      const duration = 2000; 
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        const easedProgress = easeInOutCubic(progress);

        const lat = startPos[0] + (endPos[0] - startPos[0]) * easedProgress;
        const lng = startPos[1] + (endPos[1] - startPos[1]) * easedProgress;

        setCurrentPos([lat, lng]);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          prevPos.current = endPos;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [position]);

  return (
    <Marker position={currentPos} icon={icon} eventHandlers={eventHandlers}>
      {children}
    </Marker>
  );
};

// Custom Marker Icons - Matching the Orange Glow in Screenshot
const createIcon = (color, isPulse = false) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      ${isPulse ? `<div class="absolute w-12 h-12 rounded-full bg-${color}-500/20 animate-ping"></div>` : ''}
      <div class="w-5 h-5 rounded-full bg-${color}-500 border-2 border-white shadow-[0_0_15px_rgba(255,165,0,0.5)]"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const vehicleIcons = {
  ambulance: (color) => L.divIcon({
    className: 'vehicle-icon',
    html: `
      <div class="relative group">
        <div class="absolute -inset-3 bg-orange-500/30 blur-xl rounded-full transition-opacity opacity-70 group-hover:opacity-100"></div>
        <div class="p-3 rounded-2xl bg-gray-950 border-2 border-orange-500/50 text-orange-400 shadow-[0_0_25px_rgba(255,165,0,0.4)] relative transition-transform group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  }),
  fire_truck: (color) => L.divIcon({
    className: 'vehicle-icon',
    html: `
      <div class="relative group">
        <div class="absolute -inset-3 bg-orange-500/30 blur-xl rounded-full transition-opacity opacity-70 group-hover:opacity-100"></div>
        <div class="p-3 rounded-2xl bg-gray-950 border-2 border-orange-500/50 text-orange-400 shadow-[0_0_25px_rgba(255,165,0,0.4)] relative transition-transform group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="10" width="20" height="8" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/><path d="M2 10l3-3h12l3 3"/><path d="M12 4v3"/></svg>
        </div>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  }),
  rescue_boat: (color) => L.divIcon({
    className: 'vehicle-icon',
    html: `
      <div class="relative group">
        <div class="absolute -inset-3 bg-orange-500/30 blur-xl rounded-full transition-opacity opacity-70 group-hover:opacity-100"></div>
        <div class="p-3 rounded-2xl bg-gray-950 border-2 border-orange-500/50 text-orange-400 shadow-[0_0_25px_rgba(255,165,0,0.4)] relative transition-transform group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M4 12V8l2-2h12l2 2v4"/><path d="m11 4 1-1 1 1"/></svg>
        </div>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  }),
  uav: (color) => L.divIcon({
    className: 'vehicle-icon',
    html: `
      <div class="relative group">
        <div class="absolute -inset-3 bg-orange-500/30 blur-xl rounded-full transition-opacity opacity-70 group-hover:opacity-100"></div>
        <div class="p-3 rounded-2xl bg-gray-950 border-2 border-orange-500/50 text-orange-400 shadow-[0_0_25px_rgba(255,165,0,0.4)] relative transition-transform group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 12L3 3m18 0l-9 9m0 0l9 9m-9-9l-9 9m9-9V3m0 18v-9m0 0H3m18 0h-9"/></svg>
        </div>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  })
};

const RadarSweep = () => {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-[1000] opacity-10 overflow-hidden"
      style={{
        background: `conic-gradient(from ${angle}deg, #00f2ff, transparent 90deg)`
      }}
    />
  );
};

const MapController = ({ target, isLocked }) => {
  const map = useMap();
  useEffect(() => {
    if (target && isLocked) {
      const pos = Array.isArray(target) ? target : [target.lat, target.lng];
      map.flyTo(pos, 14, { animate: true, duration: 2 });
    }
  }, [target, map, isLocked]);
  return null;
};

const TacticalMap = ({ 
  teams = [], 
  missions = [], 
  sosReports = [], 
  selectedTeam, 
  onTeamSelect, 
  isAIActive, 
  onSelectSos, 
  activeFilter, 
  onScan, 
  onExpand,
  isHUDHidden 
}) => {
  const [tacticalOpacity, setTacticalOpacity] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [mapTarget, setMapTarget] = useState(null);

  useEffect(() => {
    if (isAIActive) {
      setTacticalOpacity(1);
    } else {
      const timeout = setTimeout(() => setTacticalOpacity(0), 100);
      return () => clearTimeout(timeout);
    }
  }, [isAIActive]);

  // Sync map target when selection changes if locked
  useEffect(() => {
    if (isLocked) {
      if (selectedTeam) {
        setMapTarget(selectedTeam.location);
      } else if (sosReports.length > 0) {
        const critical = sosReports.find(r => r.severity?.toUpperCase() === 'CRITICAL') || sosReports[0];
        setMapTarget(critical.location);
      }
    }
  }, [selectedTeam, sosReports, isLocked]);

  const handleLockToggle = () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    if (nextLocked) {
      // Immediate lock on toggle
      if (selectedTeam) {
        setMapTarget(selectedTeam.location);
      } else if (sosReports.length > 0) {
        const critical = sosReports.find(r => r.severity?.toUpperCase() === 'CRITICAL') || sosReports[0];
        setMapTarget(critical.location);
      }
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden group">
      {/* Cinematic Map Effects */}
      <AnimatePresence>
        {isAIActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <RadarSweep />
            <div className="absolute inset-0 pointer-events-none z-[1000] opacity-[0.03]"
                 style={{ backgroundImage: 'linear-gradient(#00f2ff 1px, transparent 1px), linear-gradient(90deg, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer 
        center={[28.6139, 77.2090]} 
        zoom={12} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer 
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
          attribution='&copy; Esri'
        />
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png" 
          opacity={0.8}
        />
        
        <MapController target={mapTarget} isLocked={isLocked} />

        {/* SOS Markers */}
        {sosReports.map((sos) => (
          <Marker 
            key={sos.id}
            position={Array.isArray(sos.location) ? sos.location : [sos.location?.lat, sos.location?.lng]}
            icon={createIcon(sos.severity?.toLowerCase() === 'critical' ? 'red' : 'orange', sos.severity?.toLowerCase() === 'critical')}
            eventHandlers={{ click: () => onSelectSos(sos) }}
          />
        ))}

        {/* Team Markers with SMOOTH MOVEMENT */}
        {teams.map(team => {
          const color = team.status === 'AVAILABLE' ? 'cyan' : team.status === 'RESCUING' ? 'emerald' : 'orange';
          const icon = vehicleIcons[team.type] ? vehicleIcons[team.type](color) : createIcon(color);
          return (
            <MovingMarker 
              key={team.id} 
              position={Array.isArray(team.location) ? team.location : [team.location?.lat, team.location?.lng]} 
              icon={icon}
              eventHandlers={{ click: () => onTeamSelect(team) }}
            />
          );
        })}

        {/* Animated Routes */}
        {(isAIActive || tacticalOpacity > 0) && missions.map(mission => (
          <LayerGroup key={mission.id}>
            <Polyline 
              positions={mission.route} 
              pathOptions={{ 
                color: '#00f2ff', 
                weight: 2, 
                opacity: 0.6 * tacticalOpacity,
                dashArray: '8, 12',
                className: 'animate-route-glow'
              }} 
            />
          </LayerGroup>
        ))}
      </MapContainer>

      {/* Floating Tactical Panels - Top Left */}
      <div className="absolute top-8 left-8 z-[1000] flex flex-col gap-3">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-950/80 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-3xl flex items-center gap-4 min-w-[240px] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping" />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">Network Coverage</div>
            <div className="text-lg font-black text-white flex items-baseline gap-2">
              94.2% <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-950/80 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-3xl flex items-center gap-4 min-w-[240px] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-2.5 bg-purple-500/20 rounded-xl">
            <BrainCircuit size={20} className="text-purple-400" />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">AI Status</div>
            <div className="text-lg font-black text-white flex items-baseline gap-2 uppercase tracking-tight">
              Predictive <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Stable</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Tools - Bottom Center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-gray-950/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-2 shadow-2xl">
          <button 
            onClick={onScan}
            className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/5 transition-all group active:scale-95"
          >
            <Search size={16} className={`group-hover:text-cyan-400 ${isAIActive ? 'text-cyan-400' : 'text-white/40'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest group-hover:text-white ${isAIActive ? 'text-white' : 'text-white/40'}`}>Scan</span>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button 
            onClick={handleLockToggle}
            className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/5 transition-all group active:scale-95"
          >
            {isLocked ? (
              <>
                <Unlock size={16} className="text-cyan-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Unlock</span>
              </>
            ) : (
              <>
                <Lock size={16} className="text-white/40 group-hover:text-cyan-400" />
                <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Lock</span>
              </>
            )}
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button 
            onClick={onExpand}
            className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/5 transition-all group active:scale-95"
          >
            {isHUDHidden ? (
              <>
                <Minimize2 size={16} className="text-cyan-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Restore</span>
              </>
            ) : (
              <>
                <Maximize2 size={16} className="text-white/40 group-hover:text-cyan-400" />
                <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TacticalMap;
