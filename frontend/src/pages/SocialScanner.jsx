import React, { useEffect, useState } from 'react';
import { 
  Radio, Shield, AlertTriangle, TrendingUp, Search, Filter, 
  Map as MapIcon, ExternalLink, CheckCircle2, Clock, Cpu, Zap, 
  Activity, ArrowUpRight, MessageSquare, AlertCircle, Users, 
  Truck, Globe, Waves, Flame, Box, ZapOff, CloudLightning, 
  Info, X, Loader2, Archive, CheckCircle
} from 'lucide-react';
import useSocialStore from '../store/useSocialStore';
import { motion, AnimatePresence } from 'framer-motion';

const SocialScanner = () => {
  const { alerts, stats, loading, isProcessing, error, fetchAlerts, convertToIncident, archiveAlert } = useSocialStore();
  const [filterType, setFilterType] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); 
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleElevate = async () => {
    if (!selectedAlert) return;
    const success = await convertToIncident(selectedAlert);
    if (success) {
      showNotification(`MISSION CREATED: Intelligence elevated to Triage Queue.`);
      setSelectedAlert(null);
    } else {
      showNotification(`UPLINK ERROR: Failed to promote incident.`, 'error');
    }
  };

  const handleArchive = async () => {
    if (!selectedAlert) return;
    if (window.confirm('CONFIRM ARCHIVE: Move this intelligence node to historical archives?')) {
      const success = await archiveAlert(selectedAlert.id);
      if (success) {
        showNotification(`ARCHIVED: Intelligence node moved to secure storage.`);
        setSelectedAlert(null);
      }
    }
  };

  const filteredAlerts = filterType === 'All' 
    ? alerts 
    : alerts.filter(a => a.type === filterType);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#020617] min-h-full font-sans relative">
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[3000] px-6 py-4 rounded-2xl border flex items-center gap-4 backdrop-blur-2xl shadow-2xl ${
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-primary/20 border-primary/50 text-primary'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span className="text-xs font-black uppercase tracking-[0.2em]">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INTELLIGENCE HUD (10 METRICS) --- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Active Emergencies', value: stats.totalEmergencies, icon: Radio, color: 'text-primary' },
          { label: 'High Risk Zones', value: stats.highRiskZones, icon: AlertTriangle, color: 'text-critical' },
          { label: 'Verified Intel', value: stats.verifiedIncidents, icon: Shield, color: 'text-safe' },
          { label: 'Impacted Souls', value: stats.peopleAffected.toLocaleString(), icon: Users, color: 'text-cyan-400' },
          { label: 'Medics Required', value: stats.medicalNeeded, icon: Zap, color: 'text-orange-400' },
          { label: 'Rescue Units', value: stats.rescueTeams, icon: Truck, color: 'text-primary' },
          { label: 'Evacuation Areas', value: stats.evacuationAreas, icon: MapIcon, color: 'text-critical' },
          { label: 'Weather Threat', value: stats.weatherThreat, icon: CloudLightning, color: 'text-orange-500' },
          { label: 'Infra Damage', value: stats.infrastructureDamage, icon: Box, color: 'text-slate-400' },
          { label: 'Comm. Failures', value: stats.commFailures, icon: ZapOff, color: 'text-red-500' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label}
            className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={16} />
              </div>
              <div className="flex items-center text-[8px] font-black text-safe bg-safe/10 px-1.5 py-0.5 rounded-full">
                <TrendingUp size={8} className="mr-1" /> LIVE
              </div>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">{stat.value}</h3>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LIVE FEED --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Globe className="w-6 h-6 text-primary animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Operational Intel Feed</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Uplink Synchronized</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
              <Filter size={12} className="text-slate-500 ml-2" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black text-white focus:outline-none uppercase tracking-widest cursor-pointer pr-4"
              >
                <option value="All">All Intelligence</option>
                <option value="Flood">Floods</option>
                <option value="Fire">Fire Outbreaks</option>
                <option value="Earthquake">Seismic</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-3 custom-scrollbar">
            {loading && alerts.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl animate-pulse space-y-4">
                  <div className="h-4 w-1/3 bg-white/5 rounded-full" />
                  <div className="h-12 w-full bg-white/5 rounded-2xl" />
                  <div className="flex gap-4">
                    <div className="h-3 w-20 bg-white/5 rounded-full" />
                    <div className="h-3 w-20 bg-white/5 rounded-full" />
                  </div>
                </div>
              ))
            ) : filteredAlerts.map((alert) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`group bg-white/[0.02] border p-6 rounded-3xl transition-all cursor-pointer relative overflow-hidden ${
                  selectedAlert?.id === alert.id 
                    ? 'border-primary/50 bg-primary/[0.03] shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                    : 'border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                } ${alert.priority === 'Critical' ? 'border-l-4 border-l-red-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${alert.priority === 'Critical' ? 'text-red-400' : 'text-primary'}`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-black text-white uppercase italic tracking-tight">{alert.source}</span>
                         {alert.isVerified && <CheckCircle2 size={12} className="text-safe" />}
                         <span className="text-[9px] font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase">{alert.platform}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold mt-1 uppercase">
                         <span className="flex items-center gap-1"><Clock size={10} /> {new Date(alert.timestamp).toLocaleTimeString()}</span>
                         <span className="flex items-center gap-1"><MapIcon size={10} /> {alert.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-medium mb-5 break-words">
                  {alert.content}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Impacted</span>
                      <span className="text-xs font-black text-white">{alert.affected?.toLocaleString() || '---'}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Medics</span>
                      <span className="text-xs font-black text-white">{alert.medicsNeeded || '---'}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Confidence</span>
                      <span className="text-xs font-black text-primary">{alert.confidence}%</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Suggested Action</span>
                      <span className="text-[9px] font-black text-safe uppercase tracking-tighter">
                         {alert.riskLevel > 8 ? 'IMMEDIATE DISPATCH' : 'MONITORING'}
                      </span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- AI ANALYSIS PANEL --- */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                <Cpu size={20} className="text-primary" />
              </div>
              <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Analytics</h3>
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Incident Deep-Dive</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedAlert ? (
                <motion.div 
                  key={selectedAlert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 flex-1 flex flex-col"
                >
                  <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Threat Subject</span>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-black rounded uppercase italic">
                        {selectedAlert.type}
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium leading-relaxed italic opacity-90">
                      "{selectedAlert.content}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Risk Potential</p>
                        <span className="text-xs font-black text-red-500">{selectedAlert.riskLevel}/10</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedAlert.riskLevel * 10}%` }}
                          className={`h-full ${selectedAlert.riskLevel > 8 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-primary'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <Info size={14} className="text-primary" />
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Tactical Assessment</h4>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed font-medium">
                          Intelligence confirms {selectedAlert.type} signature at {selectedAlert.location}. 
                          Affected zone contains ~{selectedAlert.affected} civilians. 
                          Predicted escalation risk: {selectedAlert.riskLevel > 8 ? 'EXTREME' : 'MODERATE'}.
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Unit Required</p>
                          <p className="text-xs font-black text-white flex items-center gap-2">
                             <Truck size={12} className="text-primary" /> Alpha Team
                          </p>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Priority</p>
                          <p className={`text-xs font-black flex items-center gap-2 ${selectedAlert.riskLevel > 8 ? 'text-red-500' : 'text-primary'}`}>
                             <Zap size={12} /> {selectedAlert.riskLevel > 8 ? 'OMEGA' : 'STABLE'}
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 space-y-3">
                    <button 
                      disabled={isProcessing}
                      onClick={handleElevate}
                      className="w-full py-4 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.2)] active:scale-95 flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                      Elevate to Triage
                    </button>
                    <button 
                      disabled={isProcessing}
                      onClick={handleArchive}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                      Archive Intelligence
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="relative">
                     <Search className="w-16 h-16 text-slate-800" />
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                       transition={{ repeat: Infinity, duration: 3 }}
                       className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
                     />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Neural Link Idle</h4>
                    <p className="text-[10px] text-slate-600 font-bold max-w-[200px] leading-relaxed">
                      Deep-dive intelligence analysis is currently offline. Select a live alert node to initiate tactical decryption.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialScanner;
