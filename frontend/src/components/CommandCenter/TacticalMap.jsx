import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Marker Icons
const createIcon = (color, isPulse = false) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      ${isPulse ? `<div class="absolute w-8 h-8 rounded-full bg-${color}-500/20 animate-ping"></div>` : ''}
      <div class="w-4 h-4 rounded-full bg-${color}-500 border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const hospitalIcon = L.divIcon({
  className: 'hospital-icon',
  html: `
    <div class="relative flex items-center justify-center bg-white rounded-lg p-1 border-2 border-red-500 shadow-lg">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="3">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle map centering and effects
const MapEffects = ({ reports, activeFilter }) => {
  const map = useMap();
  
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.location.lat, r.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
    }
  }, [reports, map]);

  return null;
};

// Mock data for medical facilities
const MOCK_HOSPITALS = [
  { id: 1, name: 'AIIMS Delhi', lat: 28.5672, lng: 77.2100, beds: 12, status: 'Active' },
  { id: 2, name: 'Safdarjung Hospital', lat: 28.5647, lng: 77.2034, beds: 45, status: 'Full' },
  { id: 3, name: 'Max Super Speciality', lat: 28.5276, lng: 77.2140, beds: 22, status: 'Active' },
];

const TacticalMap = ({ sosReports = [], teams = [], activeFilter, onSelectSos }) => {
  const [mapReady, setMapReady] = useState(false);
  
  const mapStyles = useMemo(() => {
    if (activeFilter === 'CRITICAL') return 'hue-rotate-[320deg] saturate-150 contrast-125';
    if (activeFilter === 'MEDICAL') return 'hue-rotate-[180deg] saturate-125';
    return '';
  }, [activeFilter]);

  return (
    <div className="w-full h-full bg-[#050811] relative overflow-hidden group">
      <MapContainer 
        center={[28.6139, 77.2090]} 
        zoom={12} 
        className={`w-full h-full transition-all duration-1000 ${mapStyles}`}
        zoomControl={false}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapEffects reports={sosReports} activeFilter={activeFilter} />

        {/* SOS Markers */}
        {sosReports.map((sos) => (
          <React.Fragment key={sos.id}>
            <Marker 
              position={[sos.location.lat, sos.location.lng]}
              icon={createIcon(sos.severity?.toLowerCase() === 'critical' ? 'red' : 'orange', sos.severity?.toLowerCase() === 'critical')}
              eventHandlers={{
                click: () => onSelectSos(sos)
              }}
            >
              <Popup className="tactical-popup">
                <div className="p-2 bg-slate-900 text-white min-w-[150px]">
                   <p className="text-[9px] font-black uppercase text-cyan-400 mb-1">Incident Profile</p>
                   <p className="text-xs font-bold mb-2 uppercase">{sos.callerName}</p>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white/40 uppercase font-black tracking-widest">Trust</span>
                      <span className="font-mono text-cyan-400">{sos.aiTrustScore}%</span>
                   </div>
                </div>
              </Popup>
            </Marker>
            
            {/* Pulsating danger zone for critical */}
            {sos.severity?.toLowerCase() === 'critical' && (
              <Circle 
                center={[sos.location.lat, sos.location.lng]}
                radius={800}
                pathOptions={{ 
                  fillColor: '#ef4444', 
                  fillOpacity: 0.1, 
                  color: '#ef4444', 
                  weight: 1,
                  className: 'animate-pulse'
                }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Medical Assets Layer */}
        {activeFilter === 'MEDICAL' && MOCK_HOSPITALS.map(h => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
            <Popup className="tactical-popup">
              <div className="p-2 bg-slate-900 text-white">
                <p className="text-[9px] font-black uppercase text-red-400 mb-1">Medical Facility</p>
                <p className="text-xs font-bold mb-1 uppercase">{h.name}</p>
                <p className="text-[10px] text-white/40">Capacity: <span className="text-white">{h.beds} Beds</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Team Markers */}
        {teams.map((team) => (
          <Marker 
            key={team.id}
            position={[team.location.lat, team.location.lng]}
            icon={createIcon('cyan')}
          >
            <Popup>
               <div className="p-2 bg-slate-900 text-white">
                  <p className="text-xs font-bold uppercase">{team.name}</p>
                  <p className="text-[10px] text-cyan-400 uppercase font-black mt-1">{team.status}</p>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Scanning HUD */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 animate-scan" />
        <div className="absolute inset-0 border-[1px] border-white/5" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/5" />
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
         <div className="glass-panel px-3 py-1.5 flex items-center gap-3 border-white/5">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">GPS Sync: Active</span>
         </div>
      </div>
    </div>
  );
};

export default TacticalMap;
