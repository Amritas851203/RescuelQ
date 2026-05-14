import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Shield, Users, MapPin, Battery, Activity, Search, 
  Filter, Home, Zap, Droplets, Heart, ChevronRight, 
  AlertTriangle, ArrowUpRight, BrainCircuit, Waves, 
  Thermometer, Wind, Radio, Signal, ChevronLeft, 
  Maximize2, Crosshair, Timer, Fuel, ShieldCheck, 
  Baby, Syringe, Box, Truck, Ship, Navigation, Satellite,
  ArrowRight, BarChart3, PieChart, TrendingUp, UserCheck,
  Stethoscope, Globe, FlaskConical, AlertCircle, Scan,
  ClipboardList, CheckCircle2, Clock, Map as MapIcon,
  HardDrive, Cpu, Network, ZapOff, Layers, Download
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';

// --- ELITE DESIGN SYSTEM ---
const COLORS = {
  primary: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#ef4444',
  slate: '#64748b',
  bg: '#020617',
  indigo: '#6366f1',
  cyan: '#06b6d4'
};

// --- MOCK DATA ---
const SHELTERS_DATA = [
  {
    id: 'NODE-712-A',
    name: "Sector-7 General Hub",
    type: "Medical Grade",
    coords: "28.61N, 77.21E",
    address: "Downtown District, Zone A",
    capacity: 1500,
    occupied: 1380,
    resources: { food: 85, water: 92, medical: 88, power: 100, oxygen: 95 },
    status: 'OPERATIONAL',
    risk: 'LOW',
    safeWindow: '48H+',
    volunteers: 42,
    staff: { medical: 12, logistics: 8, security: 15 },
    aiInsight: "Infrastructure stable. High medical readiness confirmed. Resupply ETA: 12h.",
    location: [28.61, 77.21],
    lastUpdate: '2m ago'
  },
  {
    id: 'NODE-405-C',
    name: "Harbor Relief Hub",
    type: "Transit Node",
    coords: "28.63N, 77.25E",
    address: "Coastal Highway, Zone C",
    capacity: 3000,
    occupied: 2850,
    resources: { food: 40, water: 45, medical: 60, power: 70, oxygen: 40 },
    status: 'HIGH_DEMAND',
    risk: 'MEDIUM',
    safeWindow: '12H',
    volunteers: 18,
    staff: { medical: 6, logistics: 12, security: 10 },
    aiInsight: "Nearing occupancy threshold. Supply redirection advised for non-critical units.",
    location: [28.63, 77.25],
    lastUpdate: '5m ago'
  },
  {
    id: 'NODE-901-B',
    name: "Unity Sports Complex",
    type: "Mega Shelter",
    coords: "28.58N, 77.18E",
    address: "Midtown, Zone B",
    capacity: 5000,
    occupied: 4950,
    resources: { food: 15, water: 10, medical: 20, power: 30, oxygen: 15 },
    status: 'CRITICAL',
    risk: 'HIGH',
    safeWindow: '2H',
    volunteers: 65,
    staff: { medical: 25, logistics: 15, security: 40 },
    aiInsight: "Critical resource depletion. Immediate aerial resupply required. Structural risk rising.",
    location: [28.58, 77.18],
    lastUpdate: '30s ago'
  }
];

const tacticalIcon = (iconName, color, isPulsing = false) => {
  const icons = {
    shelter: <Home size={14} />,
    hospital: <Heart size={14} />,
    bus: <Navigation size={14} />,
    box: <Box size={14} />,
    survivor: <Users size={14} />
  };

  return L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative group">
        {isPulsing && (
          <div className="absolute inset-0 animate-ping rounded-full opacity-40" style={{ backgroundColor: color }} />
        )}
        <div 
          className="relative w-8 h-8 rounded-xl border border-white/50 shadow-2xl flex items-center justify-center text-white backdrop-blur-md transition-transform group-hover:scale-125"
          style={{ backgroundColor: `${color}80` }}
        >
          {icons[iconName] || <MapPin size={14} />}
        </div>
      </div>
    ),
    className: 'tactical-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const MOCK_INTEL = {
  hospitals: [
    { id: 'H1', location: [28.62, 77.22], name: 'General Medical Center' },
    { id: 'H2', location: [28.59, 77.19], name: 'Emergency Trauma Wing' }
  ],
  buses: [
    { id: 'B1', location: [28.60, 77.23], name: 'EVAC_NODE_1' },
    { id: 'B2', location: [28.63, 77.20], name: 'EVAC_NODE_2' }
  ],
  deliveries: [
    { id: 'D1', location: [28.61, 77.24], name: 'SUPPLY_DROP_ALPHA' }
  ],
  clusters: [
    { id: 'C1', location: [28.58, 77.21], size: 45 }
  ]
};

// --- HELPER COMPONENTS ---

const PerspectiveCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`perspective-1000 ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="preserve-3d">
        {children}
      </div>
    </motion.div>
  );
};

const Sparkline = ({ color }) => (
  <svg viewBox="0 0 100 20" className="w-16 h-6 opacity-30">
    <motion.path
      d="M0 15 Q 10 5, 20 12 T 40 8 T 60 15 T 80 5 T 100 10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

const InitializingOverlay = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Establishing Quantum Uplink...",
    "Synchronizing Regional Nodes...",
    "Decrypting Tactical Intelligence...",
    "Bio-Signature Verified.",
    "System Ready."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return s;
        }
        return s + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-8 font-mono"
    >
      <div className="relative w-64 h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-blue-500 rounded-full shadow-[0_0_20px_#3b82f6]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border-b-2 border-emerald-500/50 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield size={40} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]"
        >
          {steps[step]}
        </motion.div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step + 1) * 20}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>

      <div className="absolute bottom-12 left-12 text-[8px] text-white/10 space-y-1">
        <div>LAT: 28.6139° N</div>
        <div>LON: 77.2090° E</div>
        <div>UPLINK_STRENGTH: 98%</div>
      </div>
    </motion.div>
  );
};

// --- MOCK DATA ---

const StatusBadge = ({ status }) => {
  const styles = {
    OPERATIONAL: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    HIGH_DEMAND: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    CRITICAL: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };
  return (
    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <PerspectiveCard className="h-full">
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex flex-col gap-4 group hover:bg-white/[0.05] transition-all relative overflow-hidden h-full">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-3">
          <Sparkline color={color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#ef4444' : '#f59e0b'} />
          <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-400' : trend === 'Stable' ? 'text-blue-400' : 'text-rose-400'}`}>{trend}</span>
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-black text-white tabular-nums tracking-tight">{value}</div>
        <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  </PerspectiveCard>
);

const ResourceBar = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end gap-4">
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">{label}</span>
      <span className={`text-xs font-black text-${color}-400`}>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full bg-${color}-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
      />
    </div>
  </div>
);

const Shelters = () => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(SHELTERS_DATA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const filteredShelters = useMemo(() => 
    SHELTERS_DATA.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      <AnimatePresence>
        {isInitializing && <InitializingOverlay onComplete={() => setIsInitializing(false)} />}
      </AnimatePresence>

      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Tactical Grid with 3D Perspective */}
        <div 
          className="absolute inset-0 tactical-grid opacity-[0.03] origin-center"
          style={{ 
            transform: `perspective(1000px) rotateX(60deg) translateY(${mousePosition.y * 0.02}px) translateZ(-100px)`,
            transition: 'transform 0.1s ease-out'
          }} 
        />
        
        {/* Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] tactical-radar-sweep opacity-[0.02] animate-spin" style={{ animationDuration: '10s' }} />
        
        {/* Floating Tactical Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity }}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full blur-[1px]"
          />
        ))}

        {/* Scan Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full animate-scan-line pointer-events-none" />
      </div>

      {/* --- HERO HEADER --- */}
      <header className="relative z-20 p-6 lg:p-10 border-b border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] relative group overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                 <Home size={24} className="relative z-10" />
               </div>
               <div>
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block mb-1">Operational Dashboard v4.0</span>
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                   <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Link: Optimized</span>
                 </div>
               </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white uppercase leading-none perspective-1000">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40"
              >
                Shelter Coordination
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="block text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                Hub_Alpha
              </motion.span>
            </h1>
          </div>
          
          <div className="flex flex-col gap-6">
             <div className="flex gap-4">
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 group">
                  <Download size={16} className="group-hover:translate-y-1 transition-transform" /> Export Intelligence
                </button>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all">
                  Initialize Resupply
                </button>
             </div>
             <div className="flex items-center justify-end gap-8 border-t border-white/5 pt-4">
               <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={12} /> Sync_Interval: 1.2s
               </div>
               <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                 <Signal size={12} /> Latency: 14ms
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <main className="relative z-10 max-w-[1700px] mx-auto p-6 lg:p-10 space-y-10">
        
        {/* TOP ANALYTICS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard label="Active Nodes" value="42" trend="+3" icon={Shield} color="blue" />
          <StatCard label="Hosted Survivors" value="8,420" trend="+124" icon={Users} color="emerald" />
          <StatCard label="Bed Capacity" value="25.7%" trend="-2.1%" icon={Box} color="blue" />
          <StatCard label="Medical Units" value="156" trend="+12" icon={Stethoscope} color="emerald" />
          <StatCard label="Supply Health" value="94%" trend="Stable" icon={Truck} color="amber" />
          <StatCard label="Critical Zones" value="3" trend="-1" icon={AlertCircle} color="rose" />
        </section>

        {/* MAIN TWO-COLUMN DASHBOARD */}
        <div className="grid grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: LIST & MAP (4/12) */}
          <div className="col-span-12 lg:col-span-4 space-y-10 lg:sticky lg:top-10 lg:self-start">
            {/* Shelter List */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 space-y-8 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <ClipboardList size={120} />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Node_Directory</h3>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors"><Filter size={16} /></button>
                  <button className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors"><Maximize2 size={16} /></button>
                </div>
              </div>
              
              <div className="relative z-10">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH_BY_NODE_ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black text-white uppercase tracking-[0.3em] focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {filteredShelters.map(s => (
                  <motion.div 
                    key={s.id}
                    onClick={() => setSelectedShelter(s)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5 }}
                    className={`p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer flex flex-col gap-5 ${
                      selectedShelter?.id === s.id ? 'bg-blue-600/15 border-blue-600/50 shadow-[0_0_30px_rgba(37,99,235,0.1)] scale-[1.02]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                          <div className="text-[9px] font-mono text-white/30 tracking-wider mb-1">NODE_ID: {s.id}</div>
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{s.name}</h4>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest">
                         <div className="p-1.5 rounded-lg bg-white/5"><Users size={14} /></div>
                         {s.occupied} / {s.capacity}
                       </div>
                       <div className="text-[10px] font-black text-blue-400 tabular-nums">
                         {Math.round((s.occupied/s.capacity)*100)}% LOAD
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tactical Map Widget */}
            {/* Tactical Map Widget */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden h-[420px] relative group shadow-2xl backdrop-blur-md">
              <div className="absolute top-8 left-8 z-[1000] flex items-center gap-3">
                <div className="bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live_Spatial_Intel</span>
                </div>
                <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase">SAT_LINK: ONLINE</div>
              </div>

              {/* Tactical Overlays */}
              <div className="absolute inset-0 pointer-events-none z-[500] overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border border-blue-500/5 rounded-full"
                >
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-blue-500/20 via-transparent to-transparent" />
                </motion.div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
              </div>

              <MapContainer 
                center={selectedShelter.location} 
                zoom={12} 
                className="w-full h-full contrast-125 brightness-110"
                zoomControl={false}
              >
                <TileLayer 
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
                  attribution='&copy; Esri'
                />
                <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" 
                  opacity={0.7}
                />
                
                {/* Evacuation Routes (Simulated) */}
                <Circle center={selectedShelter.location} radius={2000} pathOptions={{ color: COLORS.primary, fillOpacity: 0.05, weight: 1, dashArray: '5, 10' }} />
                <Circle center={selectedShelter.location} radius={500} pathOptions={{ color: COLORS.emerald, fillOpacity: 0.1, weight: 2 }} />

                {/* Primary Shelter */}
                <Marker position={selectedShelter.location} icon={tacticalIcon('shelter', COLORS.primary, true)} />

                {/* Nearby Intel Elements */}
                {MOCK_INTEL.hospitals.map(h => (
                  <Marker key={h.id} position={h.location} icon={tacticalIcon('hospital', COLORS.rose)} />
                ))}
                {MOCK_INTEL.buses.map(b => (
                  <Marker key={b.id} position={b.location} icon={tacticalIcon('bus', COLORS.amber)} />
                ))}
                {MOCK_INTEL.deliveries.map(d => (
                  <Marker key={d.id} position={d.location} icon={tacticalIcon('box', COLORS.emerald)} />
                ))}
                {MOCK_INTEL.clusters.map(c => (
                  <Marker key={c.id} position={c.location} icon={tacticalIcon('survivor', COLORS.indigo, true)} />
                ))}
              </MapContainer>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-[1000]">
                 <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                   <div className="text-[9px] font-mono text-white/40 space-y-1">
                      <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> SECTOR_GRID: B-12</div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500" /> RES_HASH: HIGH_DEF</div>
                   </div>
                 </div>
                 <button 
                  onClick={() => setIsMapExpanded(true)}
                  className="p-5 rounded-2xl bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-110 active:scale-95 transition-all group"
                >
                  <Maximize2 size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>

            {/* LIVE SYSTEM LOGS - FILLING SPACE */}
            <div className="bg-black/40 border border-white/5 rounded-[2rem] p-6 font-mono text-[9px] h-[200px] overflow-hidden relative group">
              <div className="absolute top-4 right-4 flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }} className="w-1 h-1 bg-blue-500 rounded-full" />
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black to-transparent z-10" />
              <div className="space-y-2 opacity-30">
                <div className="flex gap-4">
                  <span className="text-emerald-500">[OK]</span>
                  <span className="text-white/40">13:54:21</span>
                  <span>Uplink synchronized with Sector-7</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-blue-500">[INF]</span>
                  <span className="text-white/40">13:54:22</span>
                  <span>Resource telemetry update received</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-amber-500">[WRN]</span>
                  <span className="text-white/40">13:54:25</span>
                  <span>Low bandwidth detected in Zone C</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-emerald-500">[OK]</span>
                  <span className="text-white/40">13:54:28</span>
                  <span>Satellite pass successful</span>
                </div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="flex gap-4">
                  <span className="text-blue-500">[BUSY]</span>
                  <span className="text-white/40">13:54:30</span>
                  <span>Scanning local grid for anomalies...</span>
                </motion.div>
                <div className="flex gap-4">
                  <span className="text-emerald-500">[OK]</span>
                  <span className="text-white/40">13:54:35</span>
                  <span>Uplink synchronized with Sector-9</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black to-transparent z-10" />
            </div>

            {/* GLOBAL THREAT PULSE - MORE DETAIL */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Global_Threat_Pulse</span>
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Minimal</span>
               </div>
               <div className="flex items-end gap-1 h-8">
                  {[...Array(24)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: "20%" }}
                      animate={{ height: `${Math.random() * 80 + 20}%` }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="flex-1 bg-blue-500/20 rounded-t-sm"
                    />
                  ))}
               </div>
            </div>

            {/* SECURE DATA STREAM - FILLING SPACE */}
            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-6 space-y-4 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Radio size={40} className="text-blue-500" />
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shadow-[0_0_10px_#3b82f6]" />
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Secure_Data_Stream</span>
               </div>
               <div className="grid grid-cols-4 gap-3">
                  {[
                    { color: 'blue', delay: 0 },
                    { color: 'emerald', delay: 0.2 },
                    { color: 'amber', delay: 0.4 },
                    { color: 'rose', delay: 0.6 },
                    { color: 'cyan', delay: 0.1 },
                    { color: 'indigo', delay: 0.3 },
                    { color: 'violet', delay: 0.5 },
                    { color: 'pink', delay: 0.7 }
                  ].map((item, i) => (
                    <div key={i} className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }} 
                        transition={{ duration: 1.5 + item.delay, repeat: Infinity, ease: 'linear' }}
                        className={`w-1/2 h-full opacity-60 bg-${item.color}-500 shadow-[0_0_10px_currentColor]`}
                      />
                    </div>
                  ))}
               </div>
               <div className="flex justify-between items-center text-[7px] font-mono text-white/20 uppercase tracking-widest mt-2">
                 <span>PKT_RECV: 0x82...{Math.random().toString(16).slice(2, 6)}</span>
                 <span className="text-emerald-500/50">CHECKSUM: VALID</span>
               </div>
            </div>
            {/* REGIONAL CONNECTIVITY - FILLING SPACE */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6 relative overflow-hidden group">
               <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 <Globe size={100} />
               </div>
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
                    <Network size={14} className="text-blue-500" /> Regional_Link_Map
                  </div>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
               </div>
               <div className="space-y-4 relative z-10">
                  {[
                    { label: 'NORTH_ZONE', val: 98, color: 'emerald' },
                    { label: 'COASTAL_LINK', val: 72, color: 'blue' },
                    { label: 'GRID_B_7', val: 88, color: 'cyan' },
                  ].map((link, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                         <span>{link.label}</span>
                         <span className={`text-${link.color}-400`}>{link.val}%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${link.val}%` }}
                           className={`h-full bg-gradient-to-r from-${link.color}-600 to-${link.color}-400 rounded-full shadow-[0_0_10px_rgba(var(--${link.color}-500),0.3)]`}
                         />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* SECTOR READINESS - FINAL FILLER */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
               <div className="flex items-center justify-between relative z-10">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Sector_Readiness_Analysis</span>
                 <BarChart3 size={16} className="text-blue-500 animate-bounce" />
               </div>
               <div className="flex items-end gap-3 h-20 relative z-10">
                  {[
                    { h: 40, c: 'blue' },
                    { h: 70, c: 'emerald' },
                    { h: 45, c: 'rose' },
                    { h: 90, c: 'amber' },
                    { h: 65, c: 'cyan' }
                  ].map((item, i) => (
                    <div key={i} className="flex-1 group/bar relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`w-full bg-${item.c}-500/30 border-t-2 border-${item.c}-500 rounded-t-lg group-hover/bar:bg-${item.c}-500/50 transition-all shadow-[0_0_20px_rgba(var(--${item.c}-500),0.2)]`}
                      />
                      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[6px] font-black text-white/20 group-hover/bar:text-white/50 transition-colors`}>S-{i+1}</div>
                    </div>
                  ))}
               </div>
               <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                 <div className="text-[7px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
                   <Zap size={10} className="text-amber-500" /> Optimized_Load: ACTIVE
                 </div>
                 <div className="text-[7px] font-mono text-white/20 uppercase tracking-widest">
                   VER_0x{Math.floor(Math.random()*1000).toString(16)}
                 </div>
               </div>
            </div>

            {/* NEURAL COMMAND CORE - REDESIGNED FOR HIGH-FIDELITY */}
            <div className="bg-[#0a0f1c]/80 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl backdrop-blur-3xl">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
               
               <div className="relative z-10 flex flex-col gap-10">
                  {/* Status Panel (Top Left) */}
                  <div className="flex justify-between items-start">
                    <div className="bg-black/60 border border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-xl flex gap-10">
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Neural Link</div>
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black text-emerald-400 uppercase tracking-tighter italic">Verified</span>
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                          </div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Sync Strength</div>
                          <div className="text-sm font-black text-blue-400 tabular-nums italic">99.98%</div>
                        </div>
                    </div>
                    <Activity size={20} className="text-blue-500/40 animate-pulse" />
                  </div>

                  {/* Central Neural Display */}
                  <div className="relative h-64 flex items-center justify-center">
                    {/* Concentric Tactical Rings */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute border border-white/5 rounded-full"
                        style={{ 
                          width: `${140 + i * 40}px`, 
                          height: `${140 + i * 40}px` 
                        }}
                      />
                    ))}
                    
                    {/* Glowing Brain Core */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full animate-pulse" />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 p-8 bg-white/[0.02] border border-white/10 rounded-full backdrop-blur-md"
                      >
                        <BrainCircuit size={80} className="text-white/20" />
                        {/* Animated Data Nodes */}
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#ef4444]" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute bottom-6 left-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Telemetry Waveform */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                      <span>Real-time Neural Stream</span>
                      <span className="text-blue-500">Encrypted</span>
                    </div>
                    <div className="h-12 w-full opacity-40">
                      <svg viewBox="0 0 400 100" className="w-full h-full">
                        <motion.path
                          d="M0 50 Q 25 10, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50"
                          fill="none"
                          stroke="url(#pulseGradientNew)"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                          <linearGradient id="pulseGradientNew" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED INTELLIGENCE (8/12) */}
          <div className="col-span-12 lg:col-span-8 space-y-12">
            {selectedShelter ? (
              <>
                {/* Hero Section */}
                <PerspectiveCard>
                  <section className="bg-gradient-to-br from-blue-600/20 via-white/[0.02] to-transparent border border-white/10 rounded-[4rem] p-8 lg:p-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute -top-20 -right-20 p-12 opacity-[0.03] animate-spin-slow">
                      <Globe size={400} />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    
                    <div className="relative z-10 space-y-8">
                       <div className="flex items-center gap-4">
                          <StatusBadge status={selectedShelter.status} />
                          <div className="h-4 w-px bg-white/10" />
                          <span className="text-[10px] font-mono text-blue-400 tracking-wider uppercase font-bold">NODE_PROTOCOL: {selectedShelter.id}</span>
                       </div>
                      <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] drop-shadow-2xl">
                        {selectedShelter.name.split(' ').map((word, i) => (
                          <span key={i} className={i === 1 ? 'text-blue-500' : ''}>{word} </span>
                        ))}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                         <div className="flex items-center gap-5 group">
                            <div className="p-4 rounded-[1.5rem] bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform shadow-xl"><MapPin size={24} /></div>
                            <div>
                               <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Deployment Address</div>
                               <div className="text-sm font-black text-white">{selectedShelter.address}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-5 group">
                            <div className="p-4 rounded-[1.5rem] bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform shadow-xl"><Clock size={24} /></div>
                            <div>
                               <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Temporal Safety</div>
                               <div className="text-sm font-black text-white">{selectedShelter.safeWindow} REMAINING</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-5 group">
                            <div className="p-4 rounded-[1.5rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-xl"><Activity size={24} /></div>
                            <div>
                               <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Verified Telemetry</div>
                               <div className="text-sm font-black text-white">{selectedShelter.lastUpdate} AGO</div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </section>
                </PerspectiveCard>

                {/* Capacity & Logistics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Occupancy Analysis */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 lg:p-14 flex flex-col items-center gap-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />
                    <div className="relative w-64 h-64 shrink-0 scale-110">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                        <motion.circle 
                          cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="18" fill="transparent"
                          strokeDasharray="691"
                          initial={{ strokeDashoffset: 691 }}
                          animate={{ strokeDashoffset: 691 - (691 * (selectedShelter.occupied/selectedShelter.capacity)) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white leading-none tabular-nums tracking-tighter drop-shadow-xl">
                          {Math.round((selectedShelter.occupied/selectedShelter.capacity)*100)}%
                        </span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-normal mt-3">Node Load Factor</span>
                      </div>
                    </div>
                    
                    <div className="w-full space-y-10 relative z-10">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 border border-white/5 p-10 rounded-[2.5rem] text-center flex flex-col items-center justify-center gap-3 group hover:bg-white/10 transition-all">
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Occupancy</div>
                            <div className="text-4xl font-black text-white tabular-nums leading-tight">{selectedShelter.occupied}</div>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-10 rounded-[2.5rem] text-center flex flex-col items-center justify-center gap-3 group hover:bg-white/10 transition-all">
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Availability</div>
                            <div className="text-4xl font-black text-blue-500 tabular-nums leading-tight">{selectedShelter.capacity - selectedShelter.occupied}</div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Resource Vital Signs */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 lg:p-14 space-y-10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Resource_Vitals</h3>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400">NOMINAL</div>
                    </div>
                    <div className="space-y-8">
                       <ResourceBar label="Ration Reserves" value={selectedShelter.resources.food} color="blue" />
                       <ResourceBar label="Hydration Grid" value={selectedShelter.resources.water} color="cyan" />
                       <ResourceBar label="Medical Payload" value={selectedShelter.resources.medical} color="emerald" />
                       <ResourceBar label="Quantum Power" value={selectedShelter.resources.power} color="amber" />
                       <ResourceBar label="Oxygen Supply" value={selectedShelter.resources.oxygen} color="blue" />
                    </div>
                    <div className="pt-6 border-t border-white/5 flex items-center gap-4 text-[9px] font-mono text-white/20">
                       <ZapOff size={14} /> Power Grid: Redundant Link Active
                    </div>
                  </div>
                </div>

                {/* Workforce & Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                   <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col gap-6 shadow-2xl backdrop-blur-md group hover:bg-blue-600/5 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform"><UserCheck size={24} /></div>
                      <div>
                        <div className="text-3xl font-black text-white tabular-nums tracking-tighter">{selectedShelter.volunteers}</div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Field Volunteers</div>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-blue-500" />
                      </div>
                   </div>
                   <div className="lg:col-span-2 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <BrainCircuit size={150} />
                      </div>
                      <div className="relative z-10 space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="px-3 py-1 rounded-full bg-blue-500 text-white text-[8px] font-black uppercase tracking-[0.2em]">AI Intelligence</div>
                            <div className="text-[9px] font-mono text-white/30">CONFIDENCE: 98.4%</div>
                         </div>
                         <p className="text-xl lg:text-2xl font-bold text-white/90 leading-tight tracking-tight">
                            "{selectedShelter.aiInsight}"
                         </p>
                         <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest border-t border-white/10 pt-6">
                            Aerial scans confirm optimal weather window for resupply drones in 12m. Initiating launch-ready sequence for Node Alpha-1.
                         </p>
                         <div className="space-y-4 relative z-10">
                            <div className="flex justify-between text-[9px] font-black text-blue-400/50 uppercase tracking-widest">
                              <span>ORBITAL_PHASE: APEX</span>
                              <span>SIGNAL_VERIFIED</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                               <motion.div animate={{ x: ['-100%', '300%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-1/4 h-full bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* PLATFORM-WIDE TACTICAL INTELLIGENCE CORE */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-transparent to-emerald-500/[0.05]" />
                  
                  {/* Background Neural Network Simulation */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
                        className="absolute inset-0 border border-blue-500/10 rounded-full"
                        style={{ margin: `${i * 15}%` }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">Global Ops</div>
                          <div className="text-[9px] font-mono text-white/30 tracking-[0.3em]">RELAY_ID: EDGE_CORE_01</div>
                        </div>
                        <h3 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                          Tactical <span className="text-blue-500">Intelligence</span> Matrix
                        </h3>
                        <p className="text-sm font-bold text-white/40 max-w-md leading-relaxed">
                          Synchronizing regional node data with orbital satellite imagery for real-time humanitarian logistics and threat assessment.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {[
                          { label: 'Network Latency', val: '14ms', icon: Signal, color: 'emerald' },
                          { label: 'Data Throughput', val: '2.4 GB/s', icon: Zap, color: 'blue' },
                          { label: 'Active Relays', val: '128', icon: Network, color: 'cyan' },
                          { label: 'Security Level', val: 'Tier 5', icon: ShieldCheck, color: 'indigo' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-3 group/stat hover:bg-white/10 transition-all">
                            <stat.icon size={20} className={`text-${stat.color}-400 group-hover/stat:scale-110 transition-transform`} />
                            <div>
                              <div className="text-xl font-black text-white tracking-tight">{stat.val}</div>
                              <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative aspect-square">
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-full h-full relative">
                            {/* Central Core Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] animate-pulse" />
                            
                            {/* Orbital Rings */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div 
                                key={i}
                                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-dashed border-white/10 rounded-full"
                                style={{ margin: `${i * 10}%` }}
                              >
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-${i === 0 ? 'blue' : i === 1 ? 'emerald' : 'rose'}-500 shadow-[0_0_15px_currentColor]`} />
                              </motion.div>
                            ))}

                            <div className="absolute inset-0 flex items-center justify-center">
                              <BrainCircuit size={100} className="text-white/10 animate-pulse" />
                            </div>
                         </div>
                      </div>
                      
                      {/* Decorative HUD Lines */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
                      <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
                      <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
                    </div>
                  </div>

                  <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap gap-8 items-center justify-between">
                     <div className="flex gap-12">
                        <div>
                           <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Global Load Balance</div>
                           <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                              <motion.div animate={{ width: '74%' }} className="h-full bg-blue-500" />
                           </div>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">System Integrity</div>
                           <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                              <motion.div animate={{ width: '99.4%' }} className="h-full bg-emerald-500" />
                           </div>
                        </div>
                     </div>
                     <div className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] animate-pulse">
                        Uplink_Confirmed // All_Systems_Nominal
                     </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[800px] flex flex-col items-center justify-center text-center">
                <div className="relative w-48 h-48 mb-12">
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border border-dashed border-white/10 rounded-full" />
                   <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-8 border border-dashed border-white/5 rounded-full" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Scan size={64} className="text-white/10 animate-pulse" />
                   </div>
                </div>
                <h2 className="text-4xl font-black uppercase tracking-[0.8em] text-white/20">Standby</h2>
                <p className="text-sm font-black max-w-sm mt-6 uppercase tracking-[0.4em] text-white/10">Establish Data Link to Begin Monitoring</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TACTICAL FOOTER */}
      <footer className="relative z-20 p-10 border-t border-white/5 bg-black/60 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:grid lg:grid-cols-3 items-center gap-10">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group">
              <Cpu size={16} className="text-blue-500 group-hover:rotate-180 transition-transform duration-700" /> 
              <span>Uptime: 104:12:08</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group">
              <Layers size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" /> 
              <span>DB_RELAY: EDGE_01</span>
            </div>
          </div>
          
          <div className="text-[11px] font-black text-white/10 uppercase tracking-[1em] text-center">
            RESCUE_IQ // ALPHA_CORE
          </div>

          <div className="flex justify-end gap-6 w-full">
            <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white/20 uppercase tracking-widest">
              SECURE_TLS_1.3
            </div>
            <div className="px-5 py-2 rounded-xl bg-blue-600/10 border border-blue-600/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">
              STATUS: NOMINAL
            </div>
          </div>
        </div>
      </footer>

      {/* --- FULLSCREEN TACTICAL MAP MODAL --- */}
      <AnimatePresence>
        {isMapExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl p-6 lg:p-12 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                  <Globe className="text-blue-500" /> Advanced_Spatial_Intelligence_Core
                </h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-2">
                  Live Satellite Uplink: NODE_{selectedShelter.id} // SECURE_RELAY: ACTIVE
                </p>
              </div>
              <button 
                onClick={() => setIsMapExpanded(false)}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-rose-500/20 hover:text-rose-500 transition-all flex items-center gap-3 uppercase text-[10px] font-black"
              >
                Terminate Link <Maximize2 size={18} className="rotate-45" />
              </button>
            </div>

            <div className="flex-1 rounded-[3rem] border border-white/10 overflow-hidden relative group">
              {/* Internal Tactical HUD */}
              <div className="absolute top-8 left-8 z-[1000] space-y-4">
                 <div className="bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4 max-w-xs">
                    <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase">
                      <span>Node Health</span>
                      <span className="text-emerald-500">Nominal</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                       <motion.div animate={{ width: '88%' }} className="h-full bg-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-xs font-black text-white">420</div>
                          <div className="text-[7px] text-white/20 uppercase font-bold">Inbound</div>
                       </div>
                       <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-xs font-black text-blue-400">12</div>
                          <div className="text-[7px] text-white/20 uppercase font-bold">Transit</div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-blue-600/20 backdrop-blur-md p-4 rounded-2xl border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase flex items-center gap-3">
                   <AlertCircle size={14} className="animate-pulse" /> Resupply ETA: 12m 45s
                 </div>
              </div>

              <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-3">
                 {['SAT_IMG', 'HEAT_MAP', 'TERRAIN', 'INFRA'].map(mode => (
                   <button key={mode} className="px-5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-[9px] font-black text-white/40 uppercase hover:text-white hover:bg-blue-600/50 transition-all">
                     {mode}
                   </button>
                 ))}
              </div>

              <MapContainer 
                center={selectedShelter.location} 
                zoom={14} 
                className="w-full h-full contrast-125 brightness-110"
                zoomControl={true}
              >
                <TileLayer 
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
                  attribution='&copy; Esri'
                />
                <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" 
                  opacity={0.8}
                />
                
                {/* Tactical Visuals */}
                <Circle center={selectedShelter.location} radius={3000} pathOptions={{ color: COLORS.indigo, fillOpacity: 0.05, weight: 1, dashArray: '10, 20' }} />
                <Circle center={selectedShelter.location} radius={1000} pathOptions={{ color: COLORS.emerald, fillOpacity: 0.1, weight: 2 }} />

                <Marker position={selectedShelter.location} icon={tacticalIcon('shelter', COLORS.primary, true)} />
                
                {/* Expanded Intel */}
                {MOCK_INTEL.hospitals.map(h => (
                  <Marker key={h.id} position={h.location} icon={tacticalIcon('hospital', COLORS.rose)} />
                ))}
                {MOCK_INTEL.buses.map(b => (
                  <Marker key={b.id} position={b.location} icon={tacticalIcon('bus', COLORS.amber, true)} />
                ))}
                {MOCK_INTEL.deliveries.map(d => (
                  <Marker key={d.id} position={d.location} icon={tacticalIcon('box', COLORS.emerald)} />
                ))}
              </MapContainer>

              {/* Scan Overlay */}
              <div className="absolute inset-0 pointer-events-none z-[500] border-[40px] border-black/20" />
              <div className="absolute inset-0 pointer-events-none z-[501] tactical-scan-effect opacity-20" />
            </div>

            <div className="mt-8 flex justify-between items-center">
               <div className="flex gap-8">
                  <div className="text-[10px] font-mono text-white/30">
                     SYSTEM_LOAD: 12% // GPU_RELAY: ENABLED
                  </div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                     <Signal size={12} className="text-emerald-500" /> Signal Integrity: 99.4%
                  </div>
               </div>
               <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">
                  Streaming Realtime Spatial Data
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Shelters;
