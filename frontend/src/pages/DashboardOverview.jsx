import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Activity, Users, Map, 
  AlertTriangle, CheckCircle2, TrendingUp, 
  Zap, Clock, ArrowUpRight, BarChart3,
  Search, Bell, MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

const colorMap = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', glow: 'bg-blue-500/10', hoverGlow: 'group-hover:bg-blue-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', glow: 'bg-cyan-500/10', hoverGlow: 'group-hover:bg-cyan-500/20' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', glow: 'bg-orange-500/10', hoverGlow: 'group-hover:bg-orange-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'bg-emerald-500/10', hoverGlow: 'group-hover:bg-emerald-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', glow: 'bg-red-500/10', hoverGlow: 'group-hover:bg-red-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', glow: 'bg-indigo-500/10', hoverGlow: 'group-hover:bg-indigo-500/20' },
};

const StatCard = ({ title, value, trend, icon: Icon, color }) => {
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.glow} blur-3xl -mr-16 -mt-16 ${colors.hoverGlow} transition-all duration-500`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${colors.bg} ${colors.text}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'} bg-white/5 px-2 py-1 rounded-full`}>
            {trend > 0 ? '+' : ''}{trend}%
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
          </div>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black tracking-tight mb-1">{value}</div>
        <div className="text-white/40 text-xs font-bold uppercase tracking-widest">{title}</div>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Operation Dashboard</h1>
          <p className="text-white/40 font-medium">Commander, 14 active missions require your attention.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Search Missions..." 
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-indigo-500/50 w-full md:w-64 transition-all"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Missions" value="14" trend={8} icon={Shield} color="indigo" />
        <StatCard title="Personnel on Site" value="128" trend={12} icon={Users} color="cyan" />
        <StatCard title="SOS Signals" value="42" trend={-4} icon={Zap} color="orange" />
        <StatCard title="Success Rate" value="98.4%" trend={2} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Missions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">Critical Missions</h2>
            <Link to="/command-center" className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-all flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="grid gap-4">
            {[
              { id: 'MS-842', title: 'Flash Flood Extraction', location: 'District 9', priority: 'CRITICAL', status: 'In Progress', personnel: 8 },
              { id: 'MS-839', title: 'Urban Search & Rescue', location: 'Coastal Zone', priority: 'HIGH', status: 'Deploying', personnel: 12 },
              { id: 'MS-835', title: 'Medical Evacuation', location: 'East Hill', priority: 'MEDIUM', status: 'On Site', personnel: 4 },
            ].map((mission) => (
              <motion.div 
                key={mission.id}
                whileHover={{ x: 5 }}
                className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${mission.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {mission.id.split('-')[1]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{mission.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
                        <Map size={10} /> {mission.location}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
                        <Users size={10} /> {mission.personnel} Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${mission.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {mission.priority}
                  </div>
                  <MoreVertical size={18} className="text-white/20" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/command-center" className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 group relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all" />
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-xl border border-white/10">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2 leading-none">Command <br /> Center</h3>
              <p className="text-white/60 text-sm font-medium mb-6">Launch tactical operations and real-time coordination.</p>
              <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs">
                Launch Module <ArrowUpRight size={16} />
              </div>
            </Link>

            <Link to="/map" className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 group relative overflow-hidden hover:border-white/10 transition-all">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-xl border border-white/5">
                <Map className="text-white/60" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2 leading-none">Live <br /> Map</h3>
              <p className="text-white/40 text-sm font-medium mb-6">Visualize flood patterns and personnel telemetry.</p>
              <div className="flex items-center gap-2 text-white/40 font-black uppercase tracking-widest text-xs group-hover:text-white transition-colors">
                Open Tactical View <ArrowUpRight size={16} />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Alerts & Updates */}
        <div className="space-y-8">
          <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight">Recent Alerts</h2>
              <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">Live</span>
            </div>
            
            <div className="space-y-6">
              {[
                { time: '2m ago', msg: 'New SOS detected in Sector 7C', icon: Zap, color: 'orange' },
                { time: '15m ago', msg: 'Team Alpha reached Extraction Point B', icon: Map, color: 'cyan' },
                { time: '42m ago', msg: 'Flood levels rising in Coastal Zone', icon: AlertTriangle, color: 'red' },
                { time: '1h ago', msg: 'Drone 04 surveillance active', icon: Activity, color: 'blue' },
              ].map((alert, i) => {
                const colors = colorMap[alert.color] || colorMap.blue;
                return (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-10 h-10 shrink-0 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}>
                      <alert.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{alert.msg}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{alert.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              View Audit Log
            </button>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <BarChart3 className="text-white/10" size={48} />
             </div>
             <h3 className="text-lg font-black uppercase tracking-tight mb-6">Efficiency</h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span>Response Time</span>
                      <span className="text-indigo-400">92%</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span>Resource Load</span>
                      <span className="text-orange-400">68%</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
