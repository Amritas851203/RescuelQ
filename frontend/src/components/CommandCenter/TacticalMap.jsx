import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, Truck, Anchor, Ship, Navigation, AlertTriangle, Home, Zap, Activity, Radio, Satellite } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Enhanced Tactical Vehicle Icons
const vehicleIcons = {
  ambulance: (color) => L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative group">
        <div className={`absolute -inset-4 rounded-full blur-xl opacity-40 bg-${color}-500 animate-pulse`} />
        <div className={`relative bg-gray-950 border-2 border-${color}-400 p-2 rounded-xl shadow-[0_0_20px_rgba(var(--${color}-rgb),0.6)] group-hover:scale-110 transition-transform`}>
          <Ambulance size={20} className={`text-${color}-400`} />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping border-2 border-white" />
        </div>
      </div>
    ),
    className: 'tactical-vehicle-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  fire_truck: (color) => L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative group">
        <div className={`absolute -inset-4 rounded-full blur-xl opacity-40 bg-${color}-500 animate-pulse`} />
        <div className={`relative bg-gray-950 border-2 border-${color}-400 p-2 rounded-xl shadow-[0_0_20px_rgba(var(--${color}-rgb),0.6)] group-hover:scale-110 transition-transform`}>
          <Truck size={20} className={`text-${color}-400`} />
        </div>
      </div>
    ),
    className: 'tactical-vehicle-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  rescue_boat: (color) => L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative group">
        <div className={`absolute -inset-4 rounded-full blur-xl opacity-40 bg-${color}-500 animate-pulse`} />
        <div className={`relative bg-gray-950 border-2 border-${color}-400 p-2 rounded-xl shadow-[0_0_20px_rgba(var(--${color}-rgb),0.6)] group-hover:scale-110 transition-transform`}>
          <Ship size={20} className={`text-${color}-400`} />
        </div>
      </div>
    ),
    className: 'tactical-vehicle-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  helicopter: (color) => L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative group">
        <div className={`absolute -inset-6 rounded-full border border-${color}-400/20 animate-[spin_3s_linear_infinite]`} />
        <div className={`relative bg-gray-950 border-2 border-${color}-400 p-2 rounded-xl shadow-[0_0_20px_rgba(var(--${color}-rgb),0.6)] group-hover:scale-110 transition-transform`}>
          <Navigation size={20} className={`text-${color}-400 rotate-45`} />
        </div>
      </div>
    ),
    className: 'tactical-vehicle-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
};

const RadarSweep = () => {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setAngle(a => (a + 2) % 360), 30);
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

const TacticalOverlay = ({ opacity }) => {
  const map = useMap();
  return (
    <LayerGroup>
      {/* Critical Danger Zones */}
      <Circle 
        center={[28.65, 77.25]} 
        radius={2000} 
        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 * opacity, weight: 1 * opacity, dashArray: '5, 10' }} 
      />
      <Circle 
        center={[28.61, 77.28]} 
        radius={1500} 
        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.05 * opacity, weight: 1 * opacity, dashArray: '5, 10' }} 
      />
      
      {/* Search Coverage Areas */}
      <Circle 
        center={[28.63, 77.20]} 
        radius={3000} 
        pathOptions={{ color: '#00f2ff', fillColor: '#00f2ff', fillOpacity: 0.02 * opacity, weight: 1 * opacity, dashArray: '10, 20' }} 
      />
    </LayerGroup>
  );
};

const TacticalMap = ({ teams, missions, sosReports, selectedTeam, onTeamSelect, isAIActive }) => {
  const center = [28.6139, 77.2090];
  const [tacticalOpacity, setTacticalOpacity] = useState(0);

  useEffect(() => {
    if (isAIActive) {
      setTacticalOpacity(1);
    } else {
      const timeout = setTimeout(() => setTacticalOpacity(0), 100);
      return () => clearTimeout(timeout);
    }
  }, [isAIActive]);
  
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
            {/* Tactical Grid */}
            <div className="absolute inset-0 pointer-events-none z-[1000] opacity-[0.03]"
                 style={{ backgroundImage: 'linear-gradient(#00f2ff 1px, transparent 1px), linear-gradient(90deg, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <MapContainer 
        center={center} 
        zoom={13} 
        className="w-full h-full bg-[#050811]"
        zoomControl={false}
      >
        <TileLayer 
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
          attribution='&copy; Esri'
        />
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" 
          opacity={0.6}
        />
        
        {(isAIActive || tacticalOpacity > 0) && <TacticalOverlay opacity={tacticalOpacity} />}

        {/* SOS Markers */}
        {sosReports.map(sos => (
          <Marker 
            key={sos.id} 
            position={sos.location} 
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div className="relative">
                  <div className={`absolute -inset-6 rounded-full blur-xl opacity-60 ${sos.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'} animate-pulse`} />
                  <div className={`relative p-2.5 rounded-full border-2 border-white shadow-2xl ${sos.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'}`}>
                    <AlertTriangle size={24} className="text-white" />
                    {sos.isMedical && (
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                        <Zap size={10} className="text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              ),
              className: 'tactical-sos-icon',
              iconSize: [48, 48],
              iconAnchor: [24, 24],
            })}
          >
            <Popup className="tactical-popup">
              <div className="p-3 bg-gray-950 text-white border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-black uppercase text-red-400">Target Acquired</span>
                </div>
                <h3 className="font-bold text-sm mb-1">{sos.callerName}</h3>
                <p className="text-[10px] opacity-60 leading-tight">{sos.aiSummary}</p>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-cyan-400">#ID-{sos.id}</span>
                  <span className="text-[9px] font-mono text-white/40">S7-GRID</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Team Markers with Interpolation */}
        {teams.map(team => {
          const color = team.status === 'AVAILABLE' ? 'cyan' : team.status === 'RESCUING' ? 'emerald' : 'orange';
          return (
            <Marker 
              key={team.id} 
              position={team.location} 
              icon={vehicleIcons[team.type](color)}
              eventHandlers={{
                click: () => onTeamSelect(team),
              }}
            >
              <Popup className="tactical-popup">
                <div className="p-3 bg-gray-950 text-white border border-cyan-500/30 rounded-xl min-w-[160px]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-cyan-400">{team.name}</span>
                    <span className="text-[9px] font-mono text-white/30">ONLINE</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-white/40">FUEL</span>
                      <span className="text-white font-bold">{Math.floor(team.fuel)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${team.fuel}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] mt-2">
                      <span className="text-white/40">SPEED</span>
                      <span className="text-white font-bold">{Math.floor(team.speed)} KM/H</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Animated Routes */}
        {(isAIActive || tacticalOpacity > 0) && missions.map(mission => (
          <LayerGroup key={mission.id}>
            <Polyline 
              positions={mission.route} 
              pathOptions={{ 
                color: '#00f2ff', 
                weight: 6, 
                opacity: 0.1 * tacticalOpacity, 
                lineCap: 'round',
                className: 'transition-opacity duration-1000'
              }} 
            />
            <Polyline 
              positions={mission.route} 
              pathOptions={{ 
                color: '#00f2ff', 
                weight: 2, 
                opacity: 0.6 * tacticalOpacity,
                dashArray: '8, 12',
                dashOffset: '0',
                className: 'animate-route-glow transition-opacity duration-1000'
              }} 
            />
          </LayerGroup>
        ))}
      </MapContainer>

      {/* Floating Tactical Elements */}
      <AnimatePresence>
        {isAIActive && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 z-[1000] space-y-3"
          >
            <div className="bg-gray-950/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Satellite size={18} className="text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Network Lock</div>
                <div className="text-xs font-black text-white">4 SATELLITES ACTIVE</div>
              </div>
            </div>
            <div className="bg-gray-950/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Radio size={18} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Comms Relay</div>
                <div className="text-xs font-black text-white">CH-8 STABLE</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Control Overlay */}
      <div className="absolute bottom-10 left-6 z-[1000] flex flex-col gap-2">
        <button className="w-12 h-12 bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
          <Zap size={20} />
        </button>
        <button className="w-12 h-12 bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
          <Activity size={20} />
        </button>
      </div>
    </div>
  );
};

export default TacticalMap;
