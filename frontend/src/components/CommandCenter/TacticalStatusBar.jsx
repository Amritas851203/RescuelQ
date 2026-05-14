import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, AlertCircle, Activity, Clock, Wind, Wifi, BrainCircuit, Waves, ArrowLeft } from 'lucide-react';

const StatusItem = ({ label, value, subValue, color, icon: Icon, pulse = false }) => (
  <div className="flex items-center gap-3 px-4 border-r border-white/5 last:border-none">
    <div className={`p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20 relative`}>
      {pulse && <div className={`absolute inset-0 rounded-lg bg-${color}-500/20 animate-ping`} />}
      <Icon size={16} className={`text-${color}-400 relative`} />
    </div>
    <div className="flex flex-col">
      <span className="heading-tactical leading-none mb-1">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-black text-white leading-none">{value}</span>
        {subValue && <span className={`text-[10px] font-mono text-${color}-400/70`}>{subValue}</span>}
      </div>
    </div>
  </div>
);

const TacticalStatusBar = ({ stats }) => {
  return (
    <div className="h-16 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center px-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 pr-6 border-r border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-1 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_#00f2ff] group-hover:scale-105 transition-transform">
            <Shield className="text-white" size={18} />
          </div>
          <div className="ml-3">
            <h1 className="text-white font-black text-lg tracking-tighter leading-none group-hover:text-cyan-400 transition-colors">RESCUE IQ</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Global Uplink Ready</span>
            </div>
          </div>
        </Link>
      </div>

      <Link to="/" className="flex items-center gap-2 px-4 h-full border-r border-white/5 text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-all group shrink-0">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
      </Link>

      <div className="flex items-center flex-1">
        <StatusItem 
          label="Active SOS" 
          value={stats.sosCount || 0} 
          subValue="LIVE" 
          color="red" 
          icon={AlertCircle} 
          pulse={true} 
        />
        <StatusItem 
          label="Units Online" 
          value={stats.teamsCount || 0} 
          subValue="4 DEPLOYED" 
          color="cyan" 
          icon={Users} 
        />
        <StatusItem 
          label="Critical Zones" 
          value="12" 
          subValue="SECTOR 7" 
          color="orange" 
          icon={Activity} 
        />
        <StatusItem 
          label="Flood Index" 
          value="8.4" 
          subValue="+0.2/HR" 
          color="blue" 
          icon={Waves} 
        />
        <StatusItem 
          label="Avg ETA" 
          value="12.4" 
          subValue="MINS" 
          color="emerald" 
          icon={Clock} 
        />
        <StatusItem 
          label="AI Processing" 
          value="99.2%" 
          subValue="OPTIMIZED" 
          color="purple" 
          icon={BrainCircuit} 
        />
        <StatusItem 
          label="Comm Signal" 
          value="SAT-4" 
          subValue="98%" 
          color="cyan" 
          icon={Wifi} 
        />
      </div>

      <div className="flex items-center gap-4 pl-6 border-l border-white/10 shrink-0">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-white/40 font-bold uppercase">System Threat</span>
          <span className="text-xs font-black text-red-500 tracking-widest">LEVEL 4 // CRITICAL</span>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-red-500/20 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-20" />
          <AlertCircle className="text-red-500" size={20} />
        </div>
      </div>
    </div>
  );
};

export default TacticalStatusBar;
