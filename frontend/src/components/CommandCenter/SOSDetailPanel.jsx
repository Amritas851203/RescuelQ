import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageSquare, Mic, Play, ArrowRight, ShieldAlert, 
  Map as MapIcon, CloudRain, Waves, BrainCircuit, Activity,
  AlertTriangle, Phone, Globe, Volume2, Loader2
} from 'lucide-react';

const TacticalMetric = ({ label, value, icon: Icon, color = "cyan" }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
    <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase font-bold tracking-widest">
      <Icon size={12} className={`text-${color}-400`} />
      {label}
    </div>
    <span className="text-sm font-bold text-white truncate">{value}</span>
  </div>
);

const SOSDetailPanel = ({ sos, onClose, onDispatch }) => {
  const [isDispatching, setIsDispatching] = useState(false);

  if (!sos) return null;

  const handleDispatch = async () => {
    setIsDispatching(true);
    await onDispatch(sos.id);
    setIsDispatching(false);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="w-full h-full bg-gray-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="text-red-500" size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-white tracking-tighter uppercase truncate">#ID-{sos.id.split('-')[1]}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Live Emergency</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white active:scale-95"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar custom-scrollbar">
        {/* AI Tactical Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] text-cyan-400 font-bold uppercase tracking-[0.2em]">
            <BrainCircuit size={14} />
            AI Intel Summary
          </div>
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
              <Activity size={16} className="text-cyan-400 animate-pulse" />
            </div>
            <p className="text-xs text-cyan-50/90 leading-relaxed italic font-mono">
              "{sos.aiSummary || 'Analyzing terrain and identifying optimal extraction points...'}"
            </p>
          </div>
        </section>

        {/* Tactical View / Image */}
        {sos.type && (sos.type.toLowerCase().includes('flood') || sos.type.toLowerCase().includes('volcano')) && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[9px] text-white/40 font-bold uppercase tracking-widest">
              <MapIcon size={12} />
              Tactical Intel View
            </div>
            <div className="h-40 w-full rounded-xl overflow-hidden border border-white/10 relative group">
              <img 
                src={sos.type.toLowerCase().includes('flood') ? '/src/assets/flood.png' : '/src/assets/volcano.png'} 
                alt="Tactical Intel"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[8px] font-black text-white uppercase tracking-tighter">Live Satellite Feed: {sos.type}</span>
              </div>
            </div>
          </section>
        )}

        {/* Tactical Metrics Grid */}
        <section className="grid grid-cols-2 gap-2">
          <TacticalMetric label="Flood Depth" value={sos.waterLevel || '1.2m'} icon={Waves} color="blue" />
          <TacticalMetric label="Route Risk" value={sos.routeRisk || 'HIGH'} icon={AlertTriangle} color="orange" />
          <TacticalMetric label="Environment" value="Heavy Rain" icon={CloudRain} color="blue" />
          <TacticalMetric label="Language" value={sos.language || 'English'} icon={Globe} color="emerald" />
        </section>

        {/* Voice Intelligence */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] text-white/40 font-bold uppercase tracking-widest">
              <Mic size={12} />
              Voice Intelligence
            </div>
            <div className="text-[9px] font-mono text-cyan-400/60 uppercase">94.2% Conf.</div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 h-8">
              <button className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,242,255,0.4)] active:scale-95 transition-all">
                <Play size={16} className="text-black ml-0.5" />
              </button>
              <div className="flex-1 flex items-center gap-0.5 h-full">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                    className="flex-1 bg-cyan-500/40 rounded-full"
                  />
                ))}
              </div>
              <Volume2 size={14} className="text-white/20" />
            </div>
            
            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
              <span className="text-[8px] text-white/30 uppercase font-bold block mb-1 font-mono">Transcript</span>
              <p className="text-[10px] text-white/70 font-mono leading-relaxed italic">
                "{sos.transcript || 'Processing audio stream...'}"
              </p>
            </div>
          </div>
        </section>

        {/* Extraction Strategy */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
            <ShieldAlert size={12} />
            Rec. Strategy
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
            <p className="text-[10px] text-emerald-100/80 leading-relaxed uppercase tracking-tight font-bold">
              {sos.recommendedStrategy || 'Air extraction advised. Sector 14 landing zone identified.'}
            </p>
          </div>
        </section>
      </div>

      {/* Action Footer */}
      <div className="p-5 border-t border-white/10 bg-black/40 space-y-3 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Nearby Teams: 3</span>
          <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Optimal Path Ready</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold hover:bg-white/10 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2">
            <Phone size={14} />
            DIRECT CALL
          </button>
          <button 
            onClick={handleDispatch}
            disabled={isDispatching}
            className="flex-[2] h-11 rounded-xl bg-cyan-500 text-black text-[10px] font-black hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isDispatching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                INITIATE RESCUE
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SOSDetailPanel;
