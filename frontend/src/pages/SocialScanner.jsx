import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Radio, Shield, AlertTriangle, TrendingUp, Search, Filter, 
  Map as MapIcon, CheckCircle2, Clock, Cpu, Zap, 
  Activity, MessageSquare, AlertCircle, Users, 
  Globe, Waves, Flame, Box, ZapOff, CloudLightning, 
  CheckCircle, Target, ChevronRight, ChevronLeft, MapPin
} from 'lucide-react';
import useSocialStore from '../store/useSocialStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapContainer, TileLayer, Marker, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Asset Imports
import imgFlood from '../assets/flood.png';
import imgEarthquake from '../assets/earthquake.png';
import imgSocialIntelHub from '../assets/social_intel_hub.png';
import imgTactical3DGraph from '../assets/tactical_3d_graph.png';

// --- MOCK DATA FOR NEW UI ---
const sparklineData = Array.from({ length: 15 }).map(() => ({ v: Math.random() * 100 }));
const generateSpark = () => Array.from({ length: 15 }).map(() => ({ v: Math.random() * 100 }));

const sentimentData = [
  { name: 'Negative', value: 53, color: '#ef4444' },
  { name: 'Neutral', value: 23, color: '#94a3b8' },
  { name: 'Positive', value: 12, color: '#22c55e' },
  { name: 'Panic', value: 12, color: '#dc2626' }
];

const sourceData = [
  { name: 'Twitter', value: 45, color: '#3b82f6', count: '11.1K' },
  { name: 'Facebook', value: 25, color: '#1d4ed8', count: '6.1K' },
  { name: 'Instagram', value: 15, color: '#d946ef', count: '3.7K' },
  { name: 'News', value: 10, color: '#f59e0b', count: '2.5K' },
  { name: 'Others', value: 5, color: '#64748b', count: '1.3K' }
];

const trendingKeywords = [
  { tag: '#Flood', vol: '8.7K', spark: generateSpark() },
  { tag: '#DelhiRains', vol: '6.2K', spark: generateSpark() },
  { tag: '#Help', vol: '4.1K', spark: generateSpark() },
  { tag: '#TrafficAlert', vol: '3.6K', spark: generateSpark() },
  { tag: '#Rescue', vol: '2.9K', spark: generateSpark() }
];

const recentPosts = [
  { handle: '@DelhiUpdates', text: 'Flood situation near Yamuna Bazar, water level rising fast. People trapped!', time: '2m ago', image: imgFlood },
  { handle: '@Help_India', text: 'Need immediate help near Palam, trees fallen on vehicles.', time: '5m ago', image: imgEarthquake },
  { handle: '@NewsLive', text: 'Heavy rainfall continues in Delhi, IMD issues red alert.', time: '12m ago', image: imgFlood }
];

const StatCard = ({ label, value, trend, isDown, colorClass, sparkColor }) => (
  <div className="glass-panel p-4 flex flex-col justify-between group hover:bg-white/[0.04] transition-all relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
        <Activity size={14} />
      </div>
      <p className="text-[9px] font-black uppercase text-slate-500">{label}</p>
    </div>
    <div className="mb-4 relative z-10">
      <h3 className="text-2xl font-black text-white">{value}</h3>
      <p className={`text-[10px] font-bold ${isDown ? 'text-critical' : 'text-safe'} flex items-center gap-1`}>
        {isDown ? '↓' : '↑'} {trend} from last hour
      </p>
    </div>
    <div className="h-10 w-full absolute bottom-0 left-0 opacity-40 group-hover:opacity-100 transition-opacity z-0 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={generateSpark()}>
          <Area type="monotone" dataKey="v" stroke={sparkColor} fill={sparkColor} fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// --- NEW HIGH-FIDELITY RADAR GLOW MAP MARKER ---
const svgs = {
  AlertTriangle: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  Flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  Shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  Activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'
};

const getGlowingIcon = (color, label, delay = '0s', svgName = 'AlertTriangle') => {
  const colorMap = {
    critical: 'rgba(239, 68, 68, ', // red-500
    warning: 'rgba(249, 115, 22, ', // orange-500
    primary: 'rgba(59, 130, 246, ', // blue-500
    safe: 'rgba(34, 197, 94, '      // green-500
  };
  const baseColor = colorMap[color];
  const svgPath = svgs[svgName];
  const labelHTML = label ? `<span class="absolute top-4 left-4 text-[10px] font-black text-white/80 tracking-widest uppercase drop-shadow-md whitespace-nowrap">${label}</span>` : '';

  return L.divIcon({
    className: 'custom-radar-icon bg-transparent border-0',
    html: `
    <div style="position: absolute; transform: translate(-50%, -50%);">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none" style="background-color: ${baseColor} 0.15)"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border opacity-30 pointer-events-none" style="border-color: ${baseColor} 1)"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border opacity-50 pointer-events-none" style="border-color: ${baseColor} 1)"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full blur-md pointer-events-none" style="background-color: ${baseColor} 0.8)"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none" style="background-color: ${baseColor} 1); box-shadow: 0 0 20px 5px ${baseColor} 1)"></div>
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce" style="animation-delay: ${delay}">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${baseColor} 1)" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-2xl" style="filter: drop-shadow(0 0 10px ${baseColor} 0.8))"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <div class="absolute top-1 left-1/2 -translate-x-1/2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>
          </div>
        </div>
      </div>
      ${labelHTML}
    </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const MapControls = () => {
  const map = useMap();
  
  const resetView = () => {
    map.flyTo([20, 0], 2, { duration: 1.5 });
  };

  const toggleFullscreen = () => {
    const mapContainer = map.getContainer();
    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2 pointer-events-auto">
      <button 
        onClick={resetView}
        className="w-8 h-8 bg-slate-900/80 backdrop-blur border border-white/20 rounded-md flex items-center justify-center hover:bg-slate-800 hover:border-primary transition-colors group"
        title="Reset Global View"
      >
        <Globe size={14} className="text-slate-400 group-hover:text-primary" />
      </button>
      <button 
        onClick={toggleFullscreen}
        className="w-8 h-8 bg-slate-900/80 backdrop-blur border border-white/20 rounded-md flex items-center justify-center hover:bg-slate-800 hover:border-primary transition-colors group"
        title="Toggle Fullscreen"
      >
        <MapIcon size={14} className="text-slate-400 group-hover:text-primary" />
      </button>
    </div>
  );
};

const SocialScanner = () => {
  const { alerts, fetchAlerts, convertToIncident } = useSocialStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); 
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const scrollFeed = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-[#0a0f1c] min-h-full font-sans text-white">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Globe className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">Social Scanner</h1>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium">Real-time Social Intelligence & Incident Detection</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Global search intelligence..." 
              className="w-full bg-[#111827] border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-primary/50 text-white placeholder-slate-500"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe/10 border border-safe/20 text-safe text-[9px] font-black uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-safe animate-ping" /> Neural Link: Active
          </div>
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard label="Total Mentions" value="24.7K" trend="16%" colorClass="text-primary" sparkColor="#3b82f6" />
        <StatCard label="Crit Alerts" value="312" trend="24%" colorClass="text-critical" sparkColor="#ef4444" />
        <StatCard label="High Priority" value="578" trend="12%" colorClass="text-warning" sparkColor="#f97316" />
        <StatCard label="Medium Priority" value="1.2K" trend="8%" colorClass="text-yellow-400" sparkColor="#eab308" />
        <StatCard label="Resolved" value="842" trend="15%" colorClass="text-safe" sparkColor="#22c55e" />
        <StatCard label="False Positives" value="98" trend="6%" isDown colorClass="text-purple-400" sparkColor="#c084fc" />
      </div>

      {/* LIVE INTELLIGENCE FEED CAROUSEL */}
      <div className="glass-panel p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-critical animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Intelligence Feed</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scrollFeed('left')} className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ChevronLeft size={16} />
          </button>
          
          <div ref={scrollRef} className="flex gap-3 overflow-x-hidden scroll-smooth flex-1 py-1">
            {alerts.slice(0, 10).map((alert, i) => (
              <div key={i} className="min-w-[300px] flex-shrink-0 bg-[#0f172a] border border-white/5 rounded-xl p-3 flex gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className={`p-2 rounded-lg ${alert.priority === 'Critical' ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'}`}>
                    <Radio size={14} />
                  </div>
                  <span className="text-[8px] font-bold text-slate-500">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[11px] font-bold text-white line-clamp-1">{alert.content}</p>
                  <p className="text-[9px] font-bold text-primary mt-1">{alert.location}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scrollFeed('right')} className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 3 COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Sentiment & Keywords */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          <div className="glass-panel p-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Sentiment Analysis</h3>
            <div className="h-[140px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentData} innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="value">
                    {sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 pl-4 space-y-2">
                {sentimentData.map(e => (
                  <div key={e.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                      <span className="text-[9px] font-bold text-slate-300">{e.name}</span>
                    </div>
                    <span className="text-[9px] font-bold">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[9px] font-bold text-critical mt-2 text-center">High negative sentiment detected</p>
            
            <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Public Sentiment Feed</h4>
                <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[7px] font-black text-red-500 animate-pulse">PANIC DETECTED</div>
              </div>
              <div className="relative group overflow-hidden rounded-xl border border-white/10 aspect-video">
                <img 
                  src={imgEarthquake} 
                  alt="Public Sentiment" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-3 text-[9px] font-black text-white uppercase tracking-widest">Sector-7 Social Impact</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trending Keywords</h3>
              <span className="text-[9px] text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              {trendingKeywords.map(kw => (
                <div key={kw.tag} className="flex items-center justify-between group">
                  <span className="text-[11px] font-bold text-white w-24">{kw.tag}</span>
                  <span className="text-[10px] font-bold text-slate-400 w-12">{kw.vol}</span>
                  <div className="h-4 flex-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kw.spark}>
                        <Area type="monotone" dataKey="v" stroke="#ef4444" fill="transparent" strokeWidth={1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Field Intelligence</h4>
                <Activity size={10} className="text-primary animate-pulse" />
              </div>
              <div className="relative group overflow-hidden rounded-xl border border-white/10 aspect-video">
                <img 
                  src={imgFlood} 
                  alt="Field Intelligence" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-3 text-[9px] font-black text-white uppercase tracking-widest">Live: Rescue Operations</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 flex-1 flex flex-col min-h-[180px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intelligence Pulse</h3>
              <div className="flex items-center gap-1 text-[8px] font-black text-safe uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" /> Live
              </div>
            </div>
            <div className="flex-1 min-h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateSpark()}>
                  <defs>
                    <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="stepAfter" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPulse)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
               {[
                 { l: 'SEC-A', v: '84%', c: 'text-safe' },
                 { l: 'SEC-B', v: '92%', c: 'text-primary' },
                 { l: 'SEC-C', v: '76%', c: 'text-warning' }
               ].map(s => (
                 <div key={s.l} className="p-2 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                    <span className="text-[7px] font-black text-slate-500 uppercase">{s.l}</span>
                    <span className={`text-[10px] font-black ${s.c}`}>{s.v}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Map & AI Summary */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="glass-panel p-4 flex flex-col relative overflow-hidden h-[450px]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 z-10">Incident Hotspots</h3>
            <div className="absolute top-12 inset-0 m-3 rounded-xl overflow-hidden border border-white/5 z-0">
               <MapContainer 
                 center={[20, 0]} 
                 zoom={2} 
                 className="h-full w-full bg-[#020617]"
                 zoomControl={true}
                 scrollWheelZoom={true}
                 doubleClickZoom={true}
                 dragging={true}
               >
                 <LayersControl position="topright">
                   <LayersControl.Overlay checked name="Tactical Dark">
                     <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
                   </LayersControl.Overlay>
                   <LayersControl.Overlay name="Satellite">
                     <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
                   </LayersControl.Overlay>
                 </LayersControl>
                 
                 <LayerGroup>
                   <Marker position={[28.6315, 77.2167]} icon={getGlowingIcon('critical', 'Connaught Place', '0s', 'AlertTriangle')} />
                   <Marker position={[28.6304, 77.2773]} icon={getGlowingIcon('critical', 'Laxmi Nagar', '0.4s', 'AlertTriangle')} />
                   <Marker position={[28.5823, 77.0500]} icon={getGlowingIcon('warning', 'Dwarka', '0.2s', 'Flame')} />
                   <Marker position={[28.5245, 77.2066]} icon={getGlowingIcon('warning', 'Saket', '0.6s', 'Flame')} />
                   <Marker position={[28.7041, 77.1025]} icon={getGlowingIcon('primary', 'Rohini', '0.1s', 'Shield')} />
                   <Marker position={[28.6981, 77.1388]} icon={getGlowingIcon('primary', 'Pitampura', '0.5s', 'Shield')} />
                   <Marker position={[-23.5505, -46.6333]} icon={getGlowingIcon('safe', '', '0.3s', 'Activity')} />
                 </LayerGroup>
                 
                 <MapControls />
               </MapContainer>
            </div>
            
            <div className="absolute right-6 top-10 bg-[#0f172a]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 space-y-2 z-10 pointer-events-none">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-critical shadow-[0_0_5px_#ef4444]" /><span className="text-[9px] font-bold">Critical</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_5px_#f97316]" /><span className="text-[9px] font-bold">High</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_#eab308]" /><span className="text-[9px] font-bold">Medium</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe shadow-[0_0_5px_#22c55e]" /><span className="text-[9px] font-bold">Low</span></div>
            </div>
          </div>

          <div className="glass-panel p-4 flex gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <Cpu className="w-10 h-10 text-primary mb-2 animate-pulse" />
              <h3 className="text-[8px] font-black uppercase text-slate-400 text-center">AI Intelligence<br/>Summary</h3>
            </div>
            <div className="flex-1 space-y-2 border-r border-white/5 pr-4">
              <ul className="text-[10px] font-bold text-slate-300 space-y-2 list-disc pl-4 marker:text-primary">
                <li>Sudden spike in flood-related mentions in North region.</li>
                <li>High probability of waterlogging in low-lying areas.</li>
                <li>Emergency response teams deployment recommended.</li>
                <li>Monitor critical infrastructure belts closely.</li>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center pl-2">
               <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-safe/30 border-t-safe">
                  <span className="text-sm font-black text-white">92%</span>
               </div>
               <p className="text-[8px] font-black uppercase text-safe mt-2 text-center">Objective<br/>Confidence</p>
            </div>
          </div>

          <div className="glass-panel p-4 flex-1 flex flex-col min-h-[300px] relative overflow-hidden group">
            <div className="flex justify-between items-center mb-4 relative z-10">
               <div>
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Threat Projection</h3>
                 <p className="text-[8px] text-primary font-bold uppercase tracking-widest">3D Data Stream Active</p>
               </div>
               <div className="flex gap-2">
                 <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[7px] font-black text-primary">REAL-TIME</div>
                 <TrendingUp size={12} className="text-primary" />
               </div>
            </div>
            
            <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5 bg-black/20">
               <img 
                 src={imgTactical3DGraph} 
                 alt="Tactical 3D Graph" 
                 className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
               
               <div className="absolute top-4 right-4 flex flex-col gap-1 pointer-events-none">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                       <div className="h-full bg-primary animate-pulse" style={{ width: `${Math.random()*100}%`, animationDelay: `${i*0.2}s` }} />
                    </div>
                  ))}
               </div>
               
               <div className="absolute bottom-4 left-4 p-3 bg-[#0f172a]/80 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase">Trend Intensity</span>
                    <span className="text-[12px] font-black text-white italic">HIGH VELOCITY</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase">Detection Accuracy</span>
                    <span className="text-[12px] font-black text-safe italic">98.4%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sources & Posts */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          <div className="glass-panel p-4 flex-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Source Breakdown</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="h-[120px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} innerRadius="70%" outerRadius="90%" paddingAngle={2} dataKey="value">
                      {sourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-white">24.7K</span>
                  <span className="text-[8px] font-black uppercase text-slate-500">Total</span>
                </div>
              </div>
              <div className="w-full space-y-1.5">
                {sourceData.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-[9px] font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-300">{s.name}</span>
                    </div>
                    <span>{s.value}% <span className="text-slate-500 ml-1">({s.count})</span></span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 w-full pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Intelligence Hub</h4>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-75" />
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-150" />
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img 
                    src={imgSocialIntelHub} 
                    alt="Emergency Intelligence Hub" 
                    className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-white/50 uppercase">Operational Status</span>
                      <span className="text-[9px] font-black text-primary uppercase">Hub Synchronized</span>
                    </div>
                    <div className="p-1.5 bg-primary/20 rounded-lg backdrop-blur-md">
                       <Shield size={12} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 flex-1 flex flex-col min-h-[220px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Posts</h3>
              <span className="text-[9px] text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {recentPosts.map((post, i) => (
                <div key={i} className="flex gap-3 items-start bg-[#0f172a]/50 p-2.5 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white">
                    {post.handle[1]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-primary">{post.handle}</span>
                      <span className="text-[8px] font-bold text-slate-500">{post.time}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 leading-relaxed font-medium mb-2">{post.text}</p>
                    {post.image && (
                      <div className="h-20 w-full rounded-lg overflow-hidden border border-white/5">
                        <img src={post.image} alt="post intelligence" className="w-full h-full object-cover opacity-80" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SocialScanner;
