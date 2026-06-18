import React, { useEffect, useMemo } from 'react';
import { 
  AlertCircle, Users, Shield, TrendingUp, Clock, 
  Layers, AlertTriangle, CheckCircle2, Activity, MapPin, Target,
  Heart
} from 'lucide-react';
import useSosStore from '../store/useSosStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const Dashboard = () => {
  const { reports, fetchReports } = useSosStore();

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  // --- DATA AGGREGATION ---
  const stats = useMemo(() => {
    const total = reports.length;
    const critical = reports.filter(r => r.severity === 'Critical' || (r.risk_level && r.risk_level > 8)).length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const pending = reports.filter(r => r.status === 'Pending').length;
    
    // By Type
    const typeCounts = {};
    reports.forEach(r => { typeCounts[r.type || 'Unknown'] = (typeCounts[r.type || 'Unknown'] || 0) + 1; });
    const typeData = Object.entries(typeCounts).map(([name, value], i) => ({
      name, value, color: ['#3b82f6', '#ef4444', '#f59e0b', '#6366f1', '#22c55e', '#64748b'][i % 6]
    }));

    // By Severity
    const sevCounts = { Critical: critical, High: 0, Medium: 0, Low: 0 };
    reports.forEach(r => {
      if (r.severity && r.severity !== 'Critical') {
        sevCounts[r.severity] = (sevCounts[r.severity] || 0) + 1;
      } else if (!r.severity && r.risk_level) {
        if (r.risk_level > 6 && r.risk_level <= 8) sevCounts.High++;
        if (r.risk_level > 3 && r.risk_level <= 6) sevCounts.Medium++;
        if (r.risk_level <= 3) sevCounts.Low++;
      }
    });

    // Top Areas
    const areaCounts = {};
    reports.forEach(r => { 
      const loc = r.location || 'Unknown Sector';
      areaCounts[loc] = (areaCounts[loc] || 0) + 1; 
    });
    const topAreas = Object.entries(areaCounts).sort((a,b) => b[1]-a[1]).slice(0, 4);

    // Mission Status
    const statusCounts = { 'In Progress': 0, 'En Route': 0, 'On Hold': 0, 'Completed': resolved };
    reports.forEach(r => {
      if (r.status === 'In Progress') statusCounts['In Progress']++;
      if (r.status === 'Team Assigned') statusCounts['En Route']++;
      if (r.status === 'Pending') statusCounts['On Hold']++;
    });
    
    const popRisk = reports.reduce((acc, r) => acc + (r.affected_people || Math.floor(Math.random()*100)), 0);

    return { total, critical, resolved, pending, typeData, sevCounts, topAreas, statusCounts, popRisk };
  }, [reports]);

  // --- MOCK DATA FOR MISSING GDACS FIELDS ---
  const sparklineData = Array.from({ length: 10 }).map(() => ({ v: Math.random() * 100 + 20 }));
  const trendData = [
    { t: '08 May', v: 40 }, { t: '09 May', v: 120 }, { t: '10 May', v: 220 }, 
    { t: '11 May', v: 180 }, { t: '12 May', v: 310 }, { t: '13 May', v: 250 }, { t: '14 May', v: 350 }
  ];

  // --- REUSABLE COMPONENTS ---
  const TopCard = ({ title, value, sub, color, icon: Icon }) => (
    <div className="glass-panel p-3 flex flex-col justify-between group overflow-hidden relative">
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${color}`}>
            <Icon size={12} />
          </div>
          <span className="text-[9px] font-black uppercase text-slate-400">{title}</span>
        </div>
      </div>
      <div className="mb-2 relative z-10">
        <h3 className="text-xl font-black text-white">{value}</h3>
        <p className={`text-[8px] font-bold ${sub.startsWith('↑') ? 'text-safe' : 'text-primary'}`}>{sub}</p>
      </div>
      <div className="h-6 w-full absolute bottom-0 left-0 opacity-40 z-0 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <Area type="monotone" dataKey="v" stroke="currentColor" fill="currentColor" fillOpacity={0.2} strokeWidth={1} className={color} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color, count }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] font-bold text-slate-300">
        <span className={color}>{label}</span>
        <div className="space-x-2">
          <span>{value}</span>
          <span className="text-slate-500">({count})</span>
        </div>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} style={{ width: `${(value/max)*100}%` }} />
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[#0a0f1c] flex flex-col gap-3 font-sans text-white pb-6 overflow-y-auto custom-scrollbar">
      
      {/* ROW 1: TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 flex-shrink-0">
        <TopCard title="Total Incidents" value={stats.total || 247} sub="↑ 18% from last 24h" color="text-primary" icon={Layers} />
        <TopCard title="Critical Incidents" value={stats.critical || 68} sub="↑ 24% from last 24h" color="text-critical" icon={AlertTriangle} />
        <TopCard title="Active Rescue Units" value="128" sub="Live Deployed" color="text-primary" icon={Users} />
        <TopCard title="Pending Emergencies" value={stats.pending || 79} sub="Needs Attention" color="text-warning" icon={Clock} />
        <TopCard title="Resolved Today" value={stats.resolved || 145} sub="↑ 32% vs yesterday" color="text-safe" icon={CheckCircle2} />
        <TopCard title="Avg Response Time" value="18m" sub="↓ 8% faster" color="text-primary" icon={Activity} />
      </div>

      {/* ROW 2: BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        
        <div className="glass-panel p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Incident By Type</h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="h-[120px] flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={stats.typeData} innerRadius="65%" outerRadius="85%" paddingAngle={2} dataKey="value">
                  {stats.typeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 pl-2 space-y-1.5 overflow-y-auto max-h-full custom-scrollbar">
              {stats.typeData.map(e => (
                <div key={e.name} className="flex justify-between text-[8px] font-bold">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                    <span className="text-slate-300 truncate max-w-[40px]">{e.name}</span>
                  </div>
                  <span>{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Incident Severity</h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            <ProgressBar label="Critical" value={stats.sevCounts.Critical || 68} max={stats.total || 247} color="text-critical" count="27%" />
            <ProgressBar label="High" value={stats.sevCounts.High || 72} max={stats.total || 247} color="text-warning" count="29%" />
            <ProgressBar label="Medium" value={stats.sevCounts.Medium || 64} max={stats.total || 247} color="text-yellow-400" count="26%" />
            <ProgressBar label="Low" value={stats.sevCounts.Low || 43} max={stats.total || 247} color="text-safe" count="18%" />
          </div>
        </div>

        <div className="glass-panel p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Resource Utilization</h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            <ProgressBar label="Ambulances" value={78} max={100} color="text-critical" count="28/36" />
            <ProgressBar label="Medical Teams" value={65} max={100} color="text-safe" count="26/40" />
            <ProgressBar label="Fire Units" value={52} max={100} color="text-warning" count="11/21" />
            <ProgressBar label="Rescue Boats" value={42} max={100} color="text-primary" count="8/19" />
          </div>
        </div>

        <div className="glass-panel p-3 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Response Time Analytics</h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="flex-1 min-h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                  { t: '00:00', v: 25 }, { t: '04:00', v: 32 }, { t: '08:00', v: 28 },
                  { t: '12:00', v: 55 }, { t: '16:00', v: 18 }, { t: '20:00', v: 40 }, { t: '24:00', v: 30 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="t" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} width={20} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ROW 3: TRENDS & SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        
        <div className="glass-panel p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Incident Trend <span className="text-[8px] text-slate-500">(Last 7 Days)</span></h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="t" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} width={20} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '9px' }} />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Top Affected Areas</h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-4 pt-2">
            {stats.topAreas.map((area, i) => (
              <ProgressBar key={i} label={area[0].substring(0,25)} value={area[1]} max={stats.total} color={['text-critical', 'text-warning', 'text-safe', 'text-primary'][i]} count={Math.round((area[1]/stats.total)*100)+'%'} />
            ))}
            {stats.topAreas.length === 0 && <ProgressBar label="Global Basin" value={92} max={100} color="text-critical" count="92" />}
            {stats.topAreas.length <= 1 && <ProgressBar label="Coastal Zones" value={74} max={100} color="text-warning" count="74" />}
          </div>
        </div>

        <div className="glass-panel p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[9px] font-black uppercase text-slate-400">Mission Status</h3>
            <span className="text-[8px] text-primary cursor-pointer hover:underline">View All</span>
          </div>
          <div className="h-[140px] flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={[
                  {name: 'In Progress', value: stats.statusCounts['In Progress'] || 62, color: '#3b82f6'},
                  {name: 'En Route', value: stats.statusCounts['En Route'] || 34, color: '#22c55e'},
                  {name: 'On Hold', value: stats.statusCounts['On Hold'] || 18, color: '#f59e0b'},
                  {name: 'Completed', value: stats.statusCounts['Completed'] || 14, color: '#8b5cf6'}
                ]} innerRadius="65%" outerRadius="85%" paddingAngle={2} dataKey="value">
                  {/* eslint-disable-next-line react/jsx-key */}
                  {Array.from({length: 4}).map((_, i) => <Cell key={i} fill={['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'][i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 pl-4 space-y-2">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[9px] font-bold">In Progress</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe" /><span className="text-[9px] font-bold">En Route</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-[9px] font-bold">On Hold</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-[9px] font-bold">Completed</span></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-[9px] font-black uppercase text-slate-400 absolute top-3 left-3">System Performance</h3>
          
          <div className="w-32 h-16 mt-6 relative">
             {/* Fake SVG Gauge */}
             <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
               <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
               <path d="M 10 50 A 40 40 0 0 1 80 20" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
               <defs>
                 <linearGradient id="gradient">
                   <stop offset="0%" stopColor="#22c55e" />
                   <stop offset="50%" stopColor="#eab308" />
                   <stop offset="100%" stopColor="#ef4444" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-2">
                <Activity className="w-4 h-4 text-primary animate-pulse mb-1" />
                <span className="text-xl font-black text-safe">92%</span>
             </div>
          </div>
          <p className="text-[9px] font-bold text-safe mt-4">All Systems Operational</p>
        </div>

      </div>

      {/* ROW 4: GLOBAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 flex-shrink-0 mt-2">
         <div className="glass-panel p-3 flex items-center gap-3">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary"><Users size={16}/></div>
           <div><p className="text-[8px] font-black uppercase text-slate-500">Pop. At Risk</p><h4 className="text-sm font-black">{stats.popRisk > 0 ? (stats.popRisk/1000).toFixed(1)+'K' : '1.2M'}</h4></div>
         </div>
         <div className="glass-panel p-3 flex items-center gap-3">
           <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400"><Shield size={16}/></div>
           <div><p className="text-[8px] font-black uppercase text-slate-500">Est. Damage</p><h4 className="text-sm font-black">$12.4M</h4></div>
         </div>
         <div className="glass-panel p-3 flex items-center gap-3">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary"><MapPin size={16}/></div>
           <div><p className="text-[8px] font-black uppercase text-slate-500">Evac Areas</p><h4 className="text-sm font-black">3 Zones</h4></div>
         </div>
         <div className="glass-panel p-3 flex items-center gap-3">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary"><Target size={16}/></div>
           <div><p className="text-[8px] font-black uppercase text-slate-500">Shelters</p><h4 className="text-sm font-black">24 Active</h4></div>
         </div>
         <div className="glass-panel p-3 flex items-center gap-3">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary"><Users size={16}/></div>
           <div><p className="text-[8px] font-black uppercase text-slate-500">Volunteers</p><h4 className="text-sm font-black">356</h4></div>
         </div>
         <div className="glass-panel p-3 flex items-center gap-3">
           <div className="p-2 rounded-lg bg-critical/10 border border-critical/20 text-critical"><Heart size={16}/></div>
           <div><p className="text-[8px] font-black uppercase text-slate-500">Donations</p><h4 className="text-sm font-black">$245K</h4></div>
         </div>
      </div>

      {/* ROW 4: OPERATIONAL INTELLIGENCE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-shrink-0">
        <div className="glass-panel overflow-hidden group">
          <div className="h-24 w-full relative">
            <img src="/src/assets/volcano.png" alt="Volcano" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-critical/20 border border-critical/40 text-critical text-[8px] font-black uppercase">Active Eruption</div>
          </div>
          <div className="p-3">
            <h4 className="text-[10px] font-black text-white uppercase mb-1">Volcanic Activity Detected</h4>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">Thermal anomalies detected via satellite. Evacuation protocols initiated in Sector 14.</p>
          </div>
        </div>

        <div className="glass-panel overflow-hidden group">
          <div className="h-24 w-full relative">
            <img src="/src/assets/flood.png" alt="Flood" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-warning/20 border border-warning/40 text-warning text-[8px] font-black uppercase">Severe Flooding</div>
          </div>
          <div className="p-3">
            <h4 className="text-[10px] font-black text-white uppercase mb-1">Urban Flood Monitoring</h4>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">Water levels rising in low-lying zones. Rescue units dispatched for shallow water extraction.</p>
          </div>
        </div>

        <div className="glass-panel overflow-hidden group">
          <div className="h-24 w-full relative">
            <img src="/src/assets/earthquake.png" alt="Earthquake" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary/20 border border-primary/40 text-primary text-[8px] font-black uppercase">Seismic Alert</div>
          </div>
          <div className="p-3">
            <h4 className="text-[10px] font-black text-white uppercase mb-1">Structural Damage Report</h4>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">Minor structural collapses reported after 6.2 magnitude shock. AI assessing building integrity.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
