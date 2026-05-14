import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Activity, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Truck,
  BarChart3,
  List,
  Info,
  Shield,
  Stethoscope,
  X,
  Zap,
  TrendingUp,
  Thermometer,
  CloudRain,
  Target,
  BrainCircuit,
  Waves,
  Cpu,
  Globe
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import useSosStore from '../store/useSosStore';

const DISASTER_ICONS = {
  Fire: Flame,
  Flood: Droplets,
  Earthquake: Activity,
  'Gas Leak': Wind,
  Default: AlertTriangle
};

const SEVERITY_COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e'
};

const calculateAIScore = (report) => {
  const affected = report.affected_people || 0;
  const riskFactor = (report.risk_level || 5) * 4;
  const injuryFactor = (report.injury_severity || 5) * 3;
  const populationFactor = Math.min(affected / 10, 10) * 3;
  const totalScore = riskFactor + injuryFactor + populationFactor;
  
  let priority = 'Low';
  if (totalScore > 80) priority = 'Critical';
  else if (totalScore > 60) priority = 'High';
  else if (totalScore > 30) priority = 'Medium';

  const typeLower = report.type?.toLowerCase() || '';
  const images = {
    flood: '/src/assets/flood.png',
    earthquake: '/src/assets/earthquake.png',
    cyclone: '/src/assets/cyclone.png',
    landslide: '/src/assets/landslide.png',
    fire: '/src/assets/fire.png',
    volcano: '/src/assets/volcano.png',
    tsunami: '/src/assets/tsunami.png',
    swinami: '/src/assets/tsunami.png'
  };
  
  let missionImage = null;
  for (const [key, path] of Object.entries(images)) {
    if (typeLower.includes(key)) {
      missionImage = path;
      break;
    }
  }

  return { 
    score: Math.round(totalScore), 
    priority,
    casualties: Math.floor(affected * 0.1),
    weather: { temp: '28°C', wind: '12km/h', condition: 'Stormy' },
    eta: Math.floor(Math.random() * 15) + 5 + 'm',
    evacPriority: totalScore > 70 ? 'IMMEDIATE' : (totalScore > 40 ? 'ELEVATED' : 'STABLE'),
    image: missionImage
  };
};

const OperationalIntelligencePanel = ({ report, onClose }) => {
  const { score, priority, casualties, weather, eta, evacPriority } = useMemo(() => calculateAIScore(report), [report]);
  const updateReportStatus = useSosStore((state) => state.updateReportStatus);

  const handleDeploy = () => {
    updateReportStatus(report.id, 'En Route');
    onClose();
  };

  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="glass-panel w-full max-w-4xl h-full max-h-[85vh] md:max-h-[90vh] overflow-hidden flex flex-col relative border-primary/20 shadow-2xl shadow-primary/10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-50 bg-black/20 backdrop-blur-md border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 md:p-6 border-b border-white/5 bg-primary/5 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-primary/20 text-primary border border-primary/30 animate-pulse`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Operational Intelligence</h2>
              <p className="text-xs md:text-sm text-slate-400">Incident Sector: {report.location_lat?.toFixed(4)}, {report.location_lng?.toFixed(4)}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-4 border-dashed border-white/10">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">AI Assessment</h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">{score}</span>
                <span className="text-xs text-primary font-medium">Confidence Score</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${score}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">Threat level: {priority.toUpperCase()}</p>
              </div>
            </div>

            <div className="glass-panel p-4 border-dashed border-white/10">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Casualty Estimation</h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-critical">{casualties}</span>
                <span className="text-xs text-critical/60 font-medium">Potential Fatalities</span>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 italic">"Immediate medical intervention required to mitigate escalation."</p>
            </div>

            <div className="glass-panel p-4 border-dashed border-white/10">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Tactical Status</h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-warning">{evacPriority}</span>
              </div>
              <p className="mt-4 text-[10px] text-slate-400">Evacuation Priority Level</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                AI Tactical Recommendations
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-300">Deploy Alpha Unit for high-rise extraction. Sector isolation is critical due to secondary threat signatures.</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-300">Activate secondary medical triage at {report.address || 'nearest hub'}. Reserve air extraction for critical casualties.</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-300">Maintain continuous satellite uplink. Signal degradation predicted within 45 minutes.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-safe" />
                Nearby Medical Resources
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Metro Trauma Center', dist: '1.2km', status: 'AVAILABLE', cap: '82%' },
                  { name: 'City General Hospital', dist: '2.8km', status: 'BUSY', cap: '95%' },
                  { name: 'Primary Field Clinic', dist: '0.5km', status: 'STANDBY', cap: '40%' }
                ].map((hub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm font-medium">{hub.name}</p>
                      <p className="text-[10px] text-slate-500">{hub.dist} away • Capacity: {hub.cap}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      hub.status === 'AVAILABLE' ? 'bg-safe/20 text-safe' : 'bg-warning/20 text-warning'
                    }`}>
                      {hub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1c] border-t border-white/5 flex justify-end flex-shrink-0 gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeploy}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-bold transition-colors flex items-center shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            <Truck className="w-4 h-4 mr-2" />
            Deploy Rescue Team
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TriageCard = ({ report, onUpdateStatus, onClick }) => {
  const { score, priority, casualties, weather, eta, evacPriority } = useMemo(() => calculateAIScore(report), [report]);
  const Icon = DISASTER_ICONS[report.type] || DISASTER_ICONS.Default;
  
  const priorityColors = {
    Critical: 'text-critical border-critical/50 bg-critical/10 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]',
    High: 'text-warning border-warning/50 bg-warning/10',
    Medium: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10',
    Low: 'text-safe border-safe/50 bg-safe/10'
  };

  const statusColors = {
    Pending: 'bg-slate-700 text-slate-300',
    'Team Assigned': 'bg-primary/20 text-primary border border-primary/30',
    'In Progress': 'bg-warning/20 text-warning border border-warning/30',
    Resolved: 'bg-safe/20 text-safe border border-safe/30'
  };

  return (
    <motion.div 
      layout
      whileHover={{ scale: 1.01 }}
      className={`glass-panel border-l-4 group cursor-pointer overflow-hidden ${
        priority === 'Critical' ? 'border-l-critical' : 
        priority === 'High' ? 'border-l-warning' : 
        priority === 'Medium' ? 'border-l-yellow-400' : 'border-l-safe'
      }`}
      onClick={() => onClick(report)}
    >
      {/* Incident Image Header */}
      {useMemo(() => calculateAIScore(report).image, [report]) && (
        <div className="h-24 w-full relative overflow-hidden mb-3">
          <img 
            src={calculateAIScore(report).image} 
            alt={report.type}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        </div>
      )}
      
      <div className="px-4 pb-4 pt-2">
        <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${priorityColors[priority]} ${priority === 'Critical' ? 'animate-pulse' : ''}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-lg leading-tight">{report.type}</h4>
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-500 font-mono">ID:{report.id?.slice(-4)}</span>
            </div>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {report.address || `${report.location_lat?.toFixed(2)}, ${report.location_lng?.toFixed(2)}`}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${priorityColors[priority]}`}>
            {priority} • AI {score}%
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-end">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 bg-black/20 p-2 rounded-lg">
        <div className="text-center border-r border-white/5">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Casualties</p>
          <p className="text-xs font-bold text-critical">{casualties}</p>
        </div>
        <div className="text-center border-r border-white/5">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Pop.</p>
          <p className="text-xs font-bold">{report.affected_people || 0}</p>
        </div>
        <div className="text-center border-r border-white/5">
          <p className="text-[9px] text-slate-500 uppercase font-bold">ETA</p>
          <p className="text-xs font-bold text-primary">{eta}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Weather</p>
          <div className="flex items-center justify-center text-[10px] font-bold">
            <Thermometer className="w-2 h-2 mr-0.5" /> 28°
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-tighter ${statusColors[report.status || 'Pending']}`}>
          {report.status || 'Pending'}
        </div>
        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
          {(!report.status || report.status === 'Pending') && (
            <button 
              onClick={() => onUpdateStatus(report.id, 'Team Assigned')}
              className="text-[10px] bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-md font-bold transition-all shadow-lg shadow-primary/20"
            >
              DISPATCH ALPHA
            </button>
          )}
          {report.status === 'Team Assigned' && (
            <button 
              onClick={() => onUpdateStatus(report.id, 'In Progress')}
              className="text-[10px] bg-warning hover:bg-warning/80 text-black px-3 py-1.5 rounded-md font-bold transition-all"
            >
              CONFIRM ARRIVAL
            </button>
          )}
          {report.status === 'In Progress' && (
            <button 
              onClick={() => onUpdateStatus(report.id, 'Resolved')}
              className="text-[10px] bg-safe hover:bg-safe/80 text-white px-3 py-1.5 rounded-md font-bold transition-all"
            >
              RESOLVE
            </button>
          )}
        </div>
      </div>
    </div>
    </motion.div>
  );
};

const OperationalAnalytics = ({ reports }) => {
  const stats = useMemo(() => {
    const total = reports.length || 47;
    const critical = reports.filter(r => calculateAIScore(r).priority === 'Critical').length || 12;
    const high = reports.filter(r => calculateAIScore(r).priority === 'High').length || 18;
    const medium = reports.filter(r => calculateAIScore(r).priority === 'Medium').length || 11;
    const low = reports.filter(r => calculateAIScore(r).priority === 'Low').length || 6;
    const resolved = reports.filter(r => r.status === 'Resolved').length || 23;

    const severityData = [
      { name: 'Critical', value: critical, color: SEVERITY_COLORS.Critical },
      { name: 'High', value: high, color: SEVERITY_COLORS.High },
      { name: 'Medium', value: medium, color: SEVERITY_COLORS.Medium },
      { name: 'Low', value: low, color: SEVERITY_COLORS.Low }
    ];

    const typeCounts = {};
    reports.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
    const typeData = Object.entries(typeCounts).map(([name, value], i) => ({
      name, value, color: `hsl(${i * 60 + 200}, 70%, 50%)`
    }));

    return { total, critical, high, medium, low, resolved, severityData, typeData };
  }, [reports]);

  const StatCard = ({ label, value, trend, icon: Icon, color, sparkData }) => (
    <div className="glass-panel p-3 flex flex-col space-y-2 group hover:bg-white/[0.04] transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-1.5 rounded-lg bg-white/5 ${color} border border-white/5`}>
          <Icon size={14} />
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live</div>
      </div>
      <div>
        <h3 className="text-xl font-bold tracking-tighter">{value}</h3>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      </div>
      <div className="h-8 w-full opacity-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <Area type="monotone" dataKey="v" stroke="currentColor" fill="currentColor" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={`text-[8px] font-bold flex items-center ${trend.startsWith('↑') ? 'text-safe' : 'text-slate-500'}`}>
        {trend} from last hour
      </div>
    </div>
  );

  const sparkMock = Array.from({ length: 10 }).map((_, i) => ({ v: Math.random() * 10 + 5 }));

  return (
    <div className="space-y-4 p-1 overflow-y-auto custom-scrollbar">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard label="Total Incidents" value={stats.total} trend="↑ 12%" icon={List} color="text-primary" sparkData={sparkMock} />
        <StatCard label="Critical Alerts" value={stats.critical} trend="↑ 8%" icon={AlertCircle} color="text-critical" sparkData={sparkMock} />
        <StatCard label="High Priority" value={stats.high} trend="↑ 5%" icon={AlertTriangle} color="text-warning" sparkData={sparkMock} />
        <StatCard label="Medium Priority" value={stats.medium} trend="↓ 3%" icon={Info} color="text-yellow-400" sparkData={sparkMock} />
        <StatCard label="Resolved Today" value={stats.resolved} trend="↑ 15%" icon={CheckCircle2} color="text-safe" sparkData={sparkMock} />
        <StatCard label="Avg Response" value="18m" trend="↓ 7%" icon={Clock} color="text-cyan-400" sparkData={sparkMock} />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Severity Donut */}
        <div className="glass-panel p-4 flex flex-col min-h-[250px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
              <Activity className="w-3 h-3 mr-2 text-primary" /> Incident Severity Distribution
            </h4>
            <span className="text-[9px] text-slate-500 hover:text-primary cursor-pointer">View Details</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.severityData} innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="value">
                    {stats.severityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black">{stats.total}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase">Total</span>
              </div>
            </div>
            <div className="w-1/2 pl-4 space-y-2">
              {stats.severityData.map(e => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                    <span className="text-[10px] font-bold text-slate-400">{e.name}</span>
                  </div>
                  <span className="text-[10px] font-bold">{e.value} ({Math.round(e.value / stats.total * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[9px] text-critical font-bold flex items-center gap-1">
            <TrendingUp size={10} /> 14% increase in critical incidents
          </p>
        </div>

        {/* Incident Types Donut */}
        <div className="glass-panel p-4 flex flex-col min-h-[250px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
              <Target className="w-3 h-3 mr-2 text-primary" /> Incident Types
            </h4>
            <span className="text-[9px] text-slate-500 hover:text-primary cursor-pointer">View Details</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.typeData} innerRadius="60%" outerRadius="80%" paddingAngle={2} dataKey="value">
                    {stats.typeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4 space-y-1.5 overflow-y-auto max-h-[150px] custom-scrollbar">
              {stats.typeData.map(e => (
                <div key={e.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                    <span className="text-[9px] font-bold text-slate-400 truncate max-w-[60px]">{e.name}</span>
                  </div>
                  <span className="text-[9px] font-bold">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[9px] text-primary font-bold">
            ↑ Flood incidents are highest in current scenario
          </p>
        </div>

        {/* Resource Utilization */}
        <div className="glass-panel p-4 flex flex-col min-h-[250px]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
              <Truck className="w-3 h-3 mr-2 text-primary" /> Resource Utilization
            </h4>
            <span className="text-[9px] text-slate-500 hover:text-primary cursor-pointer">View Details</span>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { label: 'Ambulances', val: 78, count: '28 / 36', color: 'bg-primary', icon: Truck },
              { label: 'Medical Teams', val: 65, count: '26 / 40', color: 'bg-safe', icon: Stethoscope },
              { label: 'Fire Units', val: 52, count: '11 / 21', color: 'bg-warning', icon: Flame },
              { label: 'Rescue Boats', val: 42, count: '8 / 19', color: 'bg-cyan-500', icon: Droplets },
              { label: 'Helicopters', val: 60, count: '6 / 10', color: 'bg-purple-500', icon: Wind }
            ].map(r => (
              <div key={r.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                    <r.icon size={10} className="text-white/40" /> {r.label}
                  </div>
                  <span>{r.val}% <span className="text-slate-600 ml-2">{r.count}</span></span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.val}%` }} className={`h-full ${r.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Response Time Area Chart */}
        <div className="glass-panel p-4 lg:col-span-5 min-h-[220px] h-full">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
              <Activity className="w-3 h-3 mr-2 text-primary" /> Response Time Analytics
            </h4>
            <select className="bg-transparent border-none text-[9px] font-bold text-slate-500 focus:outline-none uppercase cursor-pointer">
              <option>Today</option>
              <option>Week</option>
            </select>
          </div>
          <div className="h-[140px] flex gap-4 min-w-0">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { t: '00:00', v: 25 }, { t: '04:00', v: 32 }, { t: '08:00', v: 28 },
                  { t: '12:00', v: 45 }, { t: '16:00', v: 38 }, { t: '20:00', v: 22 }, { t: '24:00', v: 30 }
                ]}>
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '9px' }} />
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorV)" strokeWidth={2} />
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={0} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="w-24 flex flex-col justify-between border-l border-white/5 pl-4">
              <div className="text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold">Average</p>
                <p className="text-sm font-black text-primary">18m</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold">Fastest</p>
                <p className="text-sm font-black text-safe">6m</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold">Slowest</p>
                <p className="text-sm font-black text-critical">52m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-panel p-4 lg:col-span-3 min-h-[220px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
              <Globe className="w-3 h-3 mr-2 text-primary" /> Live Incident Timeline
            </h4>
            <span className="text-[9px] text-slate-500 cursor-pointer">View All</span>
          </div>
          <div className="space-y-4 relative before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
            {[
              { id: 'ev1', t: '01:17 PM', m: 'Incident Detected Social Scanner', c: 'bg-primary' },
              { id: 'ev2', t: '01:19 PM', m: 'Incident Verified AI Validation', c: 'bg-safe' },
              { id: 'ev3', t: '01:21 PM', m: 'Team Assigned Rescue Alpha-7', c: 'bg-warning' },
              { id: 'ev4', t: '01:24 PM', m: 'Rescue In Progress Unit En-Route', c: 'bg-purple-500' }
            ].map((ev) => (
              <div key={ev.id} className="flex gap-4 pl-4 relative">
                <div className={`absolute left-[-2px] top-1.5 w-2 h-2 rounded-full ${ev.c} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold text-slate-500">{ev.t}</p>
                  <p className="text-[10px] font-bold text-slate-300 leading-tight">{ev.m}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Operational Insights */}
        <div className="glass-panel p-4 lg:col-span-4 min-h-[220px] relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10">
            <Cpu className="w-20 h-20 text-primary animate-pulse" />
          </div>
          <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center mb-6">
            <BrainCircuit className="w-3 h-3 mr-2 text-primary" /> AI Operational Insights
          </h4>
          <div className="space-y-4">
            {[
              { id: 'ins1', icon: Waves, color: 'critical', title: 'High flood risk in Northern region', desc: 'Heavy rainfall predicted in next 6 hours. Evacuation level: HIGH.' },
              { id: 'ins2', icon: Shield, color: 'warning', title: 'Deploy 3 additional medical teams', desc: 'Injured count may increase by 18% based on current density analysis.' },
              { id: 'ins3', icon: Target, color: 'safe', title: 'Evacuation recommended in 2 zones', desc: 'Risk of water level rise is exceeding safe threshold limits.' }
            ].map(ins => (
              <div key={ins.id} className="flex items-start gap-4">
                <div className={`p-2 rounded-xl bg-${ins.color}/10 text-${ins.color} border border-${ins.color}/20`}>
                  <ins.icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white mb-1">{ins.title}</p>
                  <p className="text-[9px] text-slate-500 leading-relaxed">{ins.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TriageQueue = () => {
  const { reports, updateReportStatus } = useSosStore();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('All');

  const filteredReports = useMemo(() => {
    let result = reports.map(r => ({ ...r, ...calculateAIScore(r) }));
    if (filterType !== 'All') result = result.filter(r => r.type === filterType);
    
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || b.score - a.score);
  }, [reports, filterType]);

  const disasterTypes = ['All', ...new Set(reports.map(r => r.type))];

  return (
    <div className="space-y-4 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-xl font-bold tracking-tighter uppercase italic">Mission Triage</h3>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'queue' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            LIVE QUEUE
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'analytics' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            ANALYTICS
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
            {disasterTypes.map(t => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full border whitespace-nowrap transition-all ${
                  filterType === t ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-slate-500'
                }`}
              >
                {t?.toUpperCase() || 'UNKNOWN'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-6">
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report, idx) => (
                <TriageCard 
                  key={report.id || `report-${idx}`} 
                  report={report} 
                  onUpdateStatus={updateReportStatus}
                  onClick={setSelectedReport}
                />
              ))}
            </AnimatePresence>
            {filteredReports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 glass-panel border-dashed opacity-50">
                <Shield className="w-12 h-12 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Sector Secured • No Alerts</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <OperationalAnalytics reports={reports} />
        </motion.div>
      )}

      <AnimatePresence>
        {selectedReport && (
          <OperationalIntelligencePanel 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TriageQueue;
