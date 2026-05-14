import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Users, MapPin, Clock, ShieldAlert, Waves, Droplets, User, MessageSquare, Heart, Baby, ShieldCheck, Zap, Search, Filter } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001'); // Ensure this matches your backend port

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

const SOSQueue = ({ sosReports: initialReports, selectedSos, onSelect }) => {
  const [reports, setReports] = useState(initialReports || []);
  const [activeFilter, setActiveFilter] = useState('All Incidents');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setReports(initialReports || []);
  }, [initialReports]);

  useEffect(() => {
    socket.on('NEW_SOS_REPORT', (newReport) => {
      setReports(prev => [newReport, ...prev]);
    });

    socket.on('UPDATE_SOS_REPORT', (updatedReport) => {
      setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    });

    return () => {
      socket.off('NEW_SOS_REPORT');
      socket.off('UPDATE_SOS_REPORT');
    };
  }, []);

  // Simulated Live Incident Generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const newIncident = {
          id: `sos-${Math.floor(Math.random() * 10000)}`,
          severity: Math.random() > 0.7 ? 'CRITICAL' : Math.random() > 0.4 ? 'INJURED' : 'STRANDED',
          victimsCount: Math.floor(Math.random() * 8) + 1,
          callerName: 'Auto Generated',
          address: 'Grid Sector ' + (Math.floor(Math.random() * 20) + 1),
          aiTrustScore: Math.floor(Math.random() * 30) + 70,
          timeSinceRequest: 'Just Now',
          isMedical: Math.random() > 0.6,
          isVerified: Math.random() > 0.5,
          waterLevel: (Math.random() * 2).toFixed(1) + 'm',
          aiSummary: 'New anomaly detected in local sector. Automated drone dispatch advised.'
        };
        setReports(prev => [newIncident, ...prev.slice(0, 19)]); // Keep last 20
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = 
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.callerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case 'Critical': return r.severity === 'CRITICAL';
        case 'Verified': return r.isVerified === true;
        case 'Medical': return r.isMedical === true;
        default: return true;
      }
    });
  }, [reports, activeFilter, searchQuery]);

  const filters = [
    { name: 'All Incidents', count: reports.length },
    { name: 'Critical', count: reports.filter(r => r.severity === 'CRITICAL').length },
    { name: 'Verified', count: reports.filter(r => r.isVerified).length },
    { name: 'Medical', count: reports.filter(r => r.isMedical).length }
  ];

  return (
    <div className="h-full flex flex-col bg-[#020617]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-transparent pointer-events-none" />
      
      <div className="p-8 border-b border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">SOS Intelligence</h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">Disaster Monitor v2.1</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-red-500/5 px-4 py-2 rounded-2xl border border-red-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">{reports.length} ACTIVE</span>
          </div>
        </div>

        <div className="relative group mb-8">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-cyan-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH_INCIDENT_REGISTRY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-[10px] font-black text-white uppercase tracking-[0.2em] focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {filters.map((f) => (
            <button 
              key={f.name}
              onClick={() => setActiveFilter(f.name)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3 ${
                activeFilter === f.name 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {f.name}
              {f.count > 0 && <span className={`px-2 py-0.5 rounded-lg text-[8px] ${activeFilter === f.name ? 'bg-black/20 text-black' : 'bg-white/10 text-white/40'}`}>{f.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar custom-scrollbar relative z-10">
        <AnimatePresence mode="popLayout">
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
              className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20"
            >
              <ShieldCheck size={64} className="mb-6" />
              <div className="text-xs font-black uppercase tracking-[0.4em]">All Sectors Clear</div>
              <p className="text-[10px] font-bold uppercase mt-2">Monitoring Live Signals...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between text-[11px] text-white/40 uppercase font-black tracking-[0.3em] mb-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-500" /> AI_Incident_Prediction
          </div>
          <span className="text-emerald-400">NOMINAL</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '92%' }}
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default SOSQueue;
