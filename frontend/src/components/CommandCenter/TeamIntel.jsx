import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Battery, Droplets, Activity, Wind, 
  Users, Send, RotateCcw, BrainCircuit, Signal,
  Crosshair, Timer, Fuel, ShieldCheck, AlertCircle, Loader2
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

const TeamIntel = ({ selectedTeam, onDispatch, onAutoDispatch, isAutonomous, onToggleAutonomous, onRecall, onHold }) => {
  const [isAIProcessing, setIsAIProcessing] = React.useState(false);
  const [isActionLoading, setIsActionLoading] = React.useState(null); // 'dispatch', 'recall', 'hold'

  const handleAction = async (action, fn) => {
    setIsActionLoading(action);
    try {
      await fn();
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleAIDispatch = async () => {
    setIsAIProcessing(true);
    try {
      await onAutoDispatch();
    } finally {
      setIsAIProcessing(false);
    }
  };

  if (!selectedTeam) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-950/60 border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 text-center overflow-hidden relative">
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
        
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={handleAIDispatch}
              disabled={isAIProcessing || isAutonomous}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all group ${
                isAIProcessing 
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-400 cursor-wait' 
                : isAutonomous
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-50 cursor-not-allowed'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
              }`}
            >
              {isAIProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  ANALYZING SITUATION...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} className="group-hover:rotate-12 transition-transform" />
                  {isAutonomous ? 'AUTONOMOUS ACTIVE' : 'AI AUTO-ASSIGN MISSIONS'}
                </>
              )}
            </button>

            <button 
              onClick={onToggleAutonomous}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-2xl border transition-all font-black text-[10px] tracking-widest uppercase ${
                isAutonomous 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-500 hover:bg-rose-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Zap size={14} className={isAutonomous ? 'animate-pulse' : ''} />
              {isAutonomous ? 'ABORT AI OPERATIONS' : 'ENABLE AUTONOMOUS MODE'}
            </button>
            
            <button 
              onClick={() => {
                onToggleAutonomous();
                // Add a "Force Reset" logic if needed
              }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-500 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-[0_10px_30px_rgba(244,63,94,0.3)] mt-2"
            >
              <RotateCcw size={18} />
              TERMINATE AI OPERATIONS
            </button>
          </div>
          
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
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950/60 border border-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-y-auto no-scrollbar">
      {/* Header Section */}
      <div className="p-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Signal size={120} className="text-white" />
        </div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="max-w-[70%]">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] shadow-inner">
                {selectedTeam.type.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">ID_{selectedTeam.id}</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight break-words">{selectedTeam.name}</h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex h-3 w-3">
                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${selectedTeam.status === 'AVAILABLE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <div className={`relative rounded-full h-3 w-3 ${selectedTeam.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${selectedTeam.status === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                SYSTEM_{selectedTeam.status}
              </span>
            </div>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center backdrop-blur-md shadow-2xl">
            <Activity className="text-cyan-400 mb-2 animate-pulse" size={24} />
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Telemetry</span>
            <span className="text-[11px] font-mono text-white font-black">{selectedTeam.lastSync}</span>
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
          <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
            {selectedTeam.members.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[11px] font-black text-white/20 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">{member}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Control Footer */}
      <div className="p-8 border-t border-white/10 bg-black/60 backdrop-blur-2xl space-y-4">
        <button 
          onClick={() => handleAction('dispatch', onDispatch)}
          disabled={isActionLoading === 'dispatch' || selectedTeam.status === 'DISPATCHED'}
          className="w-full flex items-center justify-center gap-4 py-5 rounded-[1.5rem] bg-cyan-500 text-black font-black text-sm hover:bg-cyan-400 disabled:bg-white/5 disabled:text-white/20 transition-all shadow-[0_10px_40px_rgba(6,182,212,0.3)] group relative overflow-hidden"
        >
          {isActionLoading === 'dispatch' ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              INITIATE MISSION DISPATCH
            </>
          )}
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAction('recall', () => onRecall(selectedTeam.id))}
            disabled={isActionLoading === 'recall' || selectedTeam.status === 'AVAILABLE'}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black text-[10px] hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 disabled:opacity-30 transition-all uppercase tracking-[0.2em]"
          >
            {isActionLoading === 'recall' ? <Loader2 className="animate-spin" size={14} /> : <RotateCcw size={16} />}
            Recall Unit
          </button>
          <button 
            onClick={() => handleAction('hold', () => onHold(selectedTeam.id))}
            disabled={isActionLoading === 'hold' || selectedTeam.status === 'AVAILABLE'}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black text-[10px] hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 disabled:opacity-30 transition-all uppercase tracking-[0.2em]"
          >
            {isActionLoading === 'hold' ? <Loader2 className="animate-spin" size={14} /> : <Timer size={16} />}
            Stand-By
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamIntel;
