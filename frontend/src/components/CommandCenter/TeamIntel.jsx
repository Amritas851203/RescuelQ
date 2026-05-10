import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Battery, Droplets, Activity, Wind, 
  Users, Send, RotateCcw, BrainCircuit, Signal,
  Crosshair, Timer, Fuel, ShieldCheck, AlertCircle
} from 'lucide-react';

const TacticalGauge = ({ value, label, color, icon: Icon }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray="175.9"
          initial={{ strokeDashoffset: 175.9 }}
          animate={{ strokeDashoffset: 175.9 - (175.9 * value) / 100 }}
          className={`text-${color}-500 shadow-[0_0_10px_rgba(var(--${color}-rgb),0.5)]`}
        />
      </svg>
      <Icon size={16} className={`absolute text-${color}-400`} />
    </div>
    <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">{label}</span>
    <span className="text-xs font-black text-white">{Math.floor(value)}%</span>
  </div>
);

const TeamIntel = ({ selectedTeam, onDispatch, onAutoDispatch }) => {
  if (!selectedTeam) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-950/80 border-l border-white/5 backdrop-blur-2xl p-8 text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#00f2ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="w-24 h-24 rounded-3xl border-2 border-white/5 flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-3xl border-2 border-cyan-500/20 animate-ping" />
          <BrainCircuit className="text-white/10" size={40} />
        </div>
        
        <h3 className="text-white font-black text-lg uppercase tracking-tighter mb-4">Tactical AI Offline</h3>
        <p className="text-white/30 text-xs font-mono mb-8 max-w-[200px]">
          Select an active rescue unit to initialize intelligence sync and mission telemetry.
        </p>
        
        <div className="grid grid-cols-1 gap-3 w-full">
          <button 
            onClick={onAutoDispatch}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black hover:bg-cyan-500/20 transition-all group"
          >
            <BrainCircuit size={18} className="group-hover:rotate-12 transition-transform" />
            AI AUTO-ASSIGN MISSION
          </button>
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
            <div className="flex items-center gap-2 text-[10px] text-orange-400 font-bold uppercase mb-2">
              <AlertCircle size={14} />
              Operational Alert
            </div>
            <p className="text-[10px] text-white/40 font-mono leading-relaxed">
              Sector 14 high-risk detected. Recommended deployment: 2 units within 15 mins.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950/90 border-l border-white/10 backdrop-blur-3xl overflow-y-auto no-scrollbar">
      {/* Header Section */}
      <div className="p-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Signal size={120} className="text-white" />
        </div>
        
        <div className="flex justify-between items-start mb-8 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                {selectedTeam.type.replace('_', ' ')}
              </span>
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">#{selectedTeam.id}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{selectedTeam.name}</h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Unit {selectedTeam.status}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
            <Activity className="text-cyan-400 mb-1" size={20} />
            <span className="text-[9px] text-white/40 font-bold uppercase">Sync</span>
            <span className="text-[10px] font-mono text-white font-bold">{selectedTeam.lastSync}</span>
          </div>
        </div>

        {/* Tactical Gauges */}
        <div className="grid grid-cols-3 gap-4">
          <TacticalGauge value={selectedTeam.fuel} label="Fuel" color="orange" icon={Fuel} />
          <TacticalGauge value={selectedTeam.battery} label="Battery" color="cyan" icon={Battery} />
          <TacticalGauge value={selectedTeam.oxygen} label="Oxygen" color="blue" icon={Wind} />
        </div>
      </div>

      {/* Intelligence Content */}
      <div className="p-8 space-y-8 flex-1">
        {/* Mission Details */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
            <Crosshair size={14} />
            Mission Intelligence
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Leader</div>
              <div className="text-xs font-bold text-white">{selectedTeam.leader}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Crew Size</div>
              <div className="text-xs font-bold text-white">{selectedTeam.crewCount} Specialized</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Speed</div>
              <div className="text-xs font-bold text-white">{Math.floor(selectedTeam.speed)} KM/H</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Medkits</div>
              <div className="text-xs font-bold text-white">{selectedTeam.medkits} Units</div>
            </div>
          </div>
        </section>

        {/* AI Tactical Recommendation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em]">
              <BrainCircuit size={16} />
              AI Tactical Insights
            </div>
            <div className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[8px] font-black text-purple-400 uppercase tracking-widest">
              Live
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <ShieldCheck size={32} className="text-purple-400" />
            </div>
            <p className="text-xs text-purple-100/80 leading-relaxed font-mono italic">
              "AI recommends Team {selectedTeam.name} for extraction in Sector 14 due to its specialized {selectedTeam.type} equipment and 98% route stability."
            </p>
          </div>
        </section>

        {/* Team Members List */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
            <Users size={14} />
            Unit Roster
          </div>
          <div className="space-y-2">
            {selectedTeam.members.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    0{i+1}
                  </div>
                  <span className="text-xs text-white/70 group-hover:text-white">{member}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Control Footer */}
      <div className="p-8 border-t border-white/10 bg-black/40 space-y-4">
        <button 
          onClick={() => onDispatch(selectedTeam.id)}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-cyan-500 text-black font-black text-sm hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)] group"
        >
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          INITIATE MISSION DISPATCH
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-black text-[10px] hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
            <RotateCcw size={14} />
            Recall
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-black text-[10px] hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
            <Timer size={14} />
            Hold
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamIntel;
