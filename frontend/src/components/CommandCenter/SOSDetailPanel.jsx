import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageSquare, Mic, Play, ArrowRight, ShieldAlert, 
  Map as MapIcon, CloudRain, Waves, BrainCircuit, Activity,
  AlertTriangle, Phone, Globe, Volume2
} from 'lucide-react';

const TacticalMetric = ({ label, value, icon: Icon, color = "cyan" }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
    <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase font-bold tracking-widest">
      <Icon size={12} className={`text-${color}-400`} />
      {label}
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

const SOSDetailPanel = ({ sos, onClose, onDispatch }) => {
  if (!sos) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute top-0 right-0 w-[420px] h-full bg-gray-950/95 backdrop-blur-3xl border-l border-white/10 z-[3000] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="text-red-500" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{sos.id}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Live Emergency Session</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {/* AI Tactical Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">
            <BrainCircuit size={16} />
            AI Intelligence Summary
          </div>
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <Activity size={20} className="text-cyan-400 animate-pulse" />
            </div>
            <p className="text-sm text-cyan-50/90 leading-relaxed italic font-mono">
              "{sos.aiSummary}"
            </p>
          </div>
        </section>

        {/* Tactical Metrics Grid */}
        <section className="grid grid-cols-2 gap-3">
          <TacticalMetric label="Estimated Depth" value={sos.waterLevel || '1.2m'} icon={Waves} color="blue" />
          <TacticalMetric label="Route Risk" value={sos.routeRisk || 'HIGH'} icon={AlertTriangle} color="orange" />
          <TacticalMetric label="Weather" value="Heavy Rain" icon={CloudRain} color="blue" />
          <TacticalMetric label="Language" value={sos.language || 'English'} icon={Globe} color="emerald" />
        </section>

        {/* Voice Intelligence */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <Mic size={14} />
              Audio Intelligence
            </div>
            <div className="text-[10px] font-mono text-cyan-400/60 uppercase">Confidence: 94.2%</div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4 h-12">
              <button className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_#00f2ff]">
                <Play size={20} className="text-black ml-1" />
              </button>
              <div className="flex-1 flex items-end gap-0.5 h-full pb-2">
                {[...Array(24)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                    className="flex-1 bg-cyan-500/40 rounded-full"
                  />
                ))}
              </div>
              <Volume2 size={16} className="text-white/20" />
            </div>
            
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-[10px] text-white/30 uppercase font-bold block mb-2 font-mono">Transcript</span>
              <p className="text-xs text-white/70 font-mono leading-relaxed italic">
                "{sos.transcript}"
              </p>
            </div>
          </div>
        </section>

        {/* Extraction Strategy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            <ShieldAlert size={14} />
            Recommended Strategy
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-xs text-emerald-100/80 leading-relaxed uppercase tracking-tight font-bold">
              {sos.recommendedStrategy}
            </p>
          </div>
        </section>
      </div>

      {/* Action Footer */}
      <div className="p-6 border-t border-white/10 bg-black/40 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Nearby Teams: 3</span>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Optimal Path Found</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Phone size={16} />
            DIRECT CALL
          </button>
          <button 
            onClick={() => onDispatch(sos.id)}
            className="flex-[2] h-12 rounded-xl bg-cyan-500 text-black text-xs font-black hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2 group"
          >
            INITIATE RESCUE
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SOSDetailPanel;
