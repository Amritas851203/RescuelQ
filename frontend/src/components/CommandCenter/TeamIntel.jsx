import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Battery, Droplets, Activity, Wind, 
  Users, Send, RotateCcw, BrainCircuit, Signal,
  Crosshair, Timer, Fuel, ShieldCheck, AlertCircle, Loader2
} from 'lucide-react';

const TeamCard = ({ team, onDispatch, isDispatching }) => {
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'DEPLOYED': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'MAINTENANCE': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <motion.div 
      layout
      className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group mb-3"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-tight">{team.name}</h4>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border mt-1 inline-block uppercase tracking-widest ${getStatusColor(team.status)}`}>
              {team.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 mb-0.5">
            <Signal size={10} className="text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400">98%</span>
          </div>
          <p className="text-[8px] text-white/20 uppercase font-bold">Uplink</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Battery size={10} className="text-emerald-400" />
            <span className="text-[9px] text-white/40 uppercase font-black">Power</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-1 flex-1 bg-white/10 rounded-full mr-2">
              <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
            </div>
            <span className="text-[9px] font-mono text-white">85%</span>
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Timer size={10} className="text-cyan-400" />
            <span className="text-[9px] text-white/40 uppercase font-black">ETA</span>
          </div>
          <span className="text-[10px] font-mono text-white">12m 45s</span>
        </div>
      </div>

      <button 
        onClick={() => onDispatch(team.id)}
        disabled={team.status !== 'AVAILABLE' || isDispatching}
        className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
          team.status === 'AVAILABLE' 
            ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white' 
            : 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed'
        }`}
      >
        {isDispatching ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
        {team.status === 'AVAILABLE' ? 'Initiate Dispatch' : 'Awaiting Orders'}
      </button>
    </motion.div>
  );
};

const TeamIntel = ({ teams = [], activeFilter, onDispatch, isDispatching }) => {
  const filteredTeams = useMemo(() => {
    // Show medical teams if filtering by medical
    if (activeFilter === 'MEDICAL') {
      return teams.filter(t => t.name?.toLowerCase().includes('medic') || t.status === 'AVAILABLE');
    }
    return teams;
  }, [teams, activeFilter]);

  const tacticalAdvice = useMemo(() => {
    switch (activeFilter) {
      case 'CRITICAL': return {
        title: 'Priority 1 Engagement',
        advice: 'Deploy heavy extraction units. High risk of structure collapse in red zones.',
        icon: AlertCircle,
        color: 'text-red-400',
        bg: 'bg-red-400/10 border-red-400/20'
      };
      case 'MEDICAL': return {
        title: 'Trauma Protocol Active',
        advice: 'Coordinate with AIIMS and Max facilities. Priority for non-ambulatory transport.',
        icon: Activity,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10 border-emerald-400/20'
      };
      case 'VERIFIED': return {
        title: 'Confirmed Objectives',
        advice: 'Confidence interval > 90%. Full tactical commitment recommended.',
        icon: ShieldCheck,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10 border-cyan-400/20'
      };
      default: return {
        title: 'Strategic Overview',
        advice: 'Synchronizing multi-unit telemetry. Monitor high-risk flood vectors.',
        icon: BrainCircuit,
        color: 'text-primary',
        bg: 'bg-primary/10 border-primary/20'
      };
    }
  }, [activeFilter]);

  return (
    <div className="h-full flex flex-col bg-gray-950/80 border-l border-white/5 backdrop-blur-2xl overflow-hidden relative">
      <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Zap className="text-primary" size={18} />
          </div>
          <div>
             <h2 className="text-sm font-black text-white tracking-tighter uppercase italic">Team Intel</h2>
             <p className="text-[8px] text-white/30 font-black tracking-[0.2em] uppercase">Tactical Assets</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${tacticalAdvice.bg} mb-4 relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <tacticalAdvice.icon size={48} />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <tacticalAdvice.icon className={tacticalAdvice.color} size={14} />
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${tacticalAdvice.color}`}>
              {tacticalAdvice.title}
            </h3>
          </div>
          <p className="text-[11px] text-white/60 font-medium leading-relaxed relative z-10">
            {tacticalAdvice.advice}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active Units ({filteredTeams.length})</span>
          <RotateCcw size={12} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
        </div>
        
        <AnimatePresence mode="popLayout">
          {filteredTeams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onDispatch={onDispatch}
              isDispatching={isDispatching}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="p-5 bg-black/40 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <div className="flex-1">
            <p className="text-[9px] font-black text-white uppercase tracking-widest">Neural Link Syncing</p>
            <div className="h-1 w-full bg-white/5 rounded-full mt-1.5 overflow-hidden">
               <motion.div 
                 initial={{ width: '40%' }}
                 animate={{ width: '85%' }}
                 transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                 className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamIntel;
