import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Users, MapPin, Clock, ShieldAlert, Waves, Droplets, User, MessageSquare, Heart, Baby, ShieldCheck, Zap, Search, Filter, X, Target } from 'lucide-react';

const SOSCard = ({ sos, isSelected, onSelect }) => {
  const getSeverityStyles = (severity) => {
    const s = severity?.toUpperCase();
    if (s === 'CRITICAL' || s === 'HIGH') return 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] text-red-500';
    if (s === 'INJURED' || s === 'MEDIUM') return 'border-orange-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)] text-orange-500';
    return 'border-emerald-500/50 text-emerald-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelect(sos)}
      whileHover={{ x: 4 }}
      className={`group relative cursor-pointer mb-3 rounded-xl border bg-black/40 backdrop-blur-md p-4 transition-all hover:bg-white/[0.05] ${isSelected ? 'ring-1 ring-cyan-500 border-transparent shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/5'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${sos.severity?.toUpperCase() === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
          <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">ID: {sos.id?.split('-')[1] || '0000'}</span>
        </div>
        <div className="flex gap-1.5">
          {sos.isMedical && <Heart size={12} className="text-red-400 fill-red-400/20" />}
          {sos.hasChildren && <Baby size={12} className="text-cyan-400" />}
          {sos.aiTrustScore > 90 && <ShieldCheck size={12} className="text-emerald-400" />}
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white uppercase truncate tracking-tight">{sos.callerName || 'Unknown Caller'}</h3>
          <p className="text-[10px] text-white/30 font-medium mt-0.5 truncate italic">{sos.address}</p>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/5 border ${getSeverityStyles(sos.severity)}`}>
          {sos.severity || 'LOW'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-3">
        <div className="flex flex-col">
          <span className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Victims</span>
          <div className="flex items-center gap-1">
            <Users size={10} className="text-white/40" />
            <span className="text-[11px] font-black text-white">{sos.victimsCount || 0}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Depth</span>
          <div className="flex items-center gap-1">
            <Waves size={10} className="text-blue-400" />
            <span className="text-[11px] font-black text-white">{sos.waterLevel || 'N/A'}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Trust</span>
          <div className="flex items-center gap-1">
            <Target size={10} className="text-emerald-400" />
            <span className="text-[11px] font-black text-white">{sos.aiTrustScore || 0}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={10} className="text-white/20" />
          <span className="text-[9px] text-white/40 font-bold uppercase">{sos.timeSinceRequest || '2m ago'}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[8px] text-cyan-400 font-black uppercase tracking-widest">Analyze Intelligence</span>
          <Zap size={10} className="text-cyan-400" />
        </div>
      </div>
    </motion.div>
  );
};

const SOSQueue = ({ sosReports = [], filteredReports = [], activeFilter, onFilterChange, selectedSos, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const counts = useMemo(() => ({
    ALL: sosReports.length,
    CRITICAL: sosReports.filter(r => r.severity?.toUpperCase() === 'CRITICAL' || r.severity?.toUpperCase() === 'HIGH').length,
    VERIFIED: sosReports.filter(r => (r.aiTrustScore || 0) >= 90).length,
    MEDICAL: sosReports.filter(r => r.isMedical || r.aiSummary?.toLowerCase().includes('medical')).length,
    NEAR: sosReports.length
  }), [sosReports]);

  const filters = [
    { id: 'ALL INCIDENTS', label: 'All', count: counts.ALL },
    { id: 'CRITICAL', label: 'Critical', count: counts.CRITICAL },
    { id: 'VERIFIED', label: 'Verified', count: counts.VERIFIED },
    { id: 'MEDICAL', label: 'Medical', count: counts.MEDICAL },
    { id: 'NEAR ME', label: 'Near Me', count: counts.NEAR }
  ];

  return (
    <div className="h-full flex flex-col bg-[#020617]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-transparent pointer-events-none" />
      
      <div className="p-6 border-b border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="text-red-500" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-none">SOS Intelligence</h2>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">Disaster Monitor v2.1</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">{filteredReports.length} ACTIVE</span>
          </div>
        </div>

        <div className="relative group mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-500 transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH_INCIDENT_REGISTRY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-[10px] font-black text-white uppercase tracking-[0.2em] focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-inner"
          />
          {searchTerm && <X size={14} onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white cursor-pointer" />}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filters.map((f) => (
            <button 
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border ${activeFilter === f.id ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'}`}
            >
              {f.label}
              <span className={`text-[8px] px-1.5 py-0.5 rounded-md ${activeFilter === f.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/20'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredReports.length > 0 ? (
            filteredReports.map((sos) => (
              <SOSCard 
                key={sos.id} 
                sos={sos} 
                isSelected={selectedSos?.id === sos.id}
                onSelect={onSelect} 
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center opacity-20 text-center p-8 grayscale"
            >
              <Search size={40} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Intelligence</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent shadow-[0_0_10px_#3b82f6]" />
        <div className="flex items-center justify-between text-[8px] text-white/30 font-black uppercase tracking-widest mb-2.5">
          <span>AI Triage Accuracy</span>
          <span className="text-cyan-400 font-mono tracking-normal text-[10px]">99.2%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '99.2%' }}
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default SOSQueue;
