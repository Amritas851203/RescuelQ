import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Users, MapPin, Clock, ShieldAlert, Waves, Droplets, User, MessageSquare, Heart, Baby, ShieldCheck, Zap } from 'lucide-react';

const SOSCard = ({ sos, isSelected, onSelect }) => {
  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] text-red-500';
      case 'injured': return 'border-orange-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] text-orange-500';
      case 'stranded': return 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] text-yellow-500';
      default: return 'border-emerald-500/50 text-emerald-500';
    }
  };

  return (
    <motion.div
      layout
      onClick={() => onSelect(sos)}
      whileHover={{ x: 4 }}
      className={`group relative cursor-pointer mb-4 rounded-xl border bg-black/40 backdrop-blur-md p-4 transition-all hover:bg-white/5 ${isSelected ? 'ring-2 ring-cyan-500 border-transparent' : 'border-white/5'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-ping ${sos.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
          <span className="text-[10px] font-mono text-white/90">#ID-{sos.id.split('-')[1]}</span>
        </div>
        <div className="flex gap-1">
          {sos.isMedical && <Heart size={12} className="text-red-400" />}
          {sos.hasChildren && <Baby size={12} className="text-cyan-400" />}
          {sos.routeRisk === 'HIGH' && <AlertCircle size={12} className="text-orange-400" />}
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase truncate w-40">{sos.callerName || 'Unknown Caller'}</h3>
          <p className="text-[10px] text-white/40 font-mono mt-0.5">{sos.address}</p>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/5 ${getSeverityStyles(sos.severity)}`}>
          {sos.severity}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-white/30 uppercase font-bold">Victims</span>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-white/60" />
            <span className="text-xs font-bold text-white">{sos.victimsCount}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-white/30 uppercase font-bold">Flood Depth</span>
          <div className="flex items-center gap-1">
            <Waves size={12} className="text-blue-400" />
            <span className="text-xs font-bold text-white">{sos.waterLevel || 'N/A'}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-white/30 uppercase font-bold">AI Trust</span>
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="text-xs font-bold text-white">{sos.aiTrustScore}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-white/30" />
          <span className="text-[10px] text-white/30">{sos.timeSinceRequest || '2m ago'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap size={10} className="text-cyan-400 animate-pulse" />
          <span className="text-[9px] text-cyan-400/70 font-mono uppercase">Optimizing Route...</span>
        </div>
      </div>
    </motion.div>
  );
};

const SOSQueue = ({ sosReports, selectedSos, onSelect }) => {
  return (
    <div className="h-full flex flex-col bg-gray-950/80 border-r border-white/5 backdrop-blur-2xl">
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={20} />
            <h2 className="text-lg font-black text-white tracking-tighter uppercase">SOS Intelligence</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase">{sosReports.length} Active</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/20">
            <MapPin size={14} />
          </div>
          <input 
            type="text" 
            placeholder="Search SOS ID, location, or team..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {['All Incidents', 'Critical', 'Verified', 'Medical', 'Near Me'].map((filter, i) => (
            <button 
              key={filter}
              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${i === 0 ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {sosReports.map((sos) => (
            <SOSCard 
              key={sos.id} 
              sos={sos} 
              isSelected={selectedSos?.id === sos.id}
              onSelect={onSelect} 
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center justify-between text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">
          <span>AI Prediction</span>
          <span className="text-emerald-400">Stable</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SOSQueue;
