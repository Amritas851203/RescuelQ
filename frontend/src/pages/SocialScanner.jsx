import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Map as MapIcon, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Zap,
  Activity,
  ArrowUpRight,
  MoreVertical,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import useSocialStore from '../store/useSocialStore';
import { motion, AnimatePresence } from 'framer-motion';

const SocialScanner = () => {
  const { alerts, stats, loading, fetchAlerts, convertToIncident } = useSocialStore();
  const [filterType, setFilterType] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const filteredAlerts = filterType === 'All' 
    ? alerts 
    : alerts.filter(a => a.type === filterType);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-critical bg-critical/10 border-critical/30';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-safe bg-safe/10 border-safe/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: stats.total, icon: Radio, color: 'text-primary' },
          { label: 'High Risk Zones', value: stats.highRisk, icon: AlertTriangle, color: 'text-critical' },
          { label: 'Active Incidents', value: stats.active, icon: Zap, color: 'text-orange-500' },
          { label: 'Verified Reports', value: stats.verified, icon: CheckCircle2, color: 'text-safe' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="glass-panel p-5 border-l-4 border-l-primary"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-bold text-safe">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% FROM LAST HOUR</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Live Intelligence Feed</h2>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-surface/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Disaster Types</option>
                <option value="Flood">Flood</option>
                <option value="Fire">Fire</option>
                <option value="Earthquake">Earthquake</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {loading && alerts.length === 0 ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass-panel p-4 animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/5 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-white/5 rounded" />
                        <div className="h-2 w-32 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-white/5 rounded" />
                  </div>
                  <div className="h-12 w-full bg-white/5 rounded-xl" />
                </div>
              ))
            ) : error ? (
              <div className="glass-panel p-12 text-center space-y-4 border-critical/20 bg-critical/5">
                <AlertCircle className="w-12 h-12 text-critical mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Live Feed Interrupted</h3>
                  <p className="text-xs text-slate-500 mt-1">{error}</p>
                </div>
                <button 
                  onClick={fetchAlerts}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase rounded-lg border border-white/10 transition-all"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="glass-panel p-12 text-center opacity-50">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No matching alerts detected in this sector.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredAlerts.map((alert) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={alert.id}
                    className={`glass-panel p-4 border-l-4 transition-all hover:bg-white/5 cursor-pointer ${
                      alert.priority === 'Critical' ? 'border-l-critical shadow-lg shadow-critical/5' : 'border-l-white/10'
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                          {alert.platform === 'Twitter/X' && <span className="text-xl">𝕏</span>}
                          {alert.platform === 'Instagram' && <span className="text-xl">📸</span>}
                          {alert.platform === 'News' && <span className="text-xl">📰</span>}
                          {alert.platform === 'Public Alert' && <span className="text-xl">📢</span>}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-white">{alert.source}</span>
                            {alert.isVerified && <CheckCircle2 className="w-3 h-3 text-safe" />}
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter bg-white/5 px-1.5 rounded">
                              {alert.platform}
                            </span>
                          </div>
                          <div className="flex items-center text-[10px] text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleTimeString()} • {alert.location}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-2">
                      {alert.content}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5">
                          <Cpu className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-bold text-slate-500">AI Confidence:</span>
                          <span className="text-[10px] font-black text-white">{alert.confidence}%</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Shield className="w-3 h-3 text-accent" />
                          <span className="text-[10px] font-bold text-slate-500">Sentiment:</span>
                          <span className={`text-[10px] font-black ${alert.sentiment === 'Urgent' ? 'text-primary' : 'text-orange-400'}`}>
                            {alert.sentiment}
                          </span>
                        </div>
                      </div>
                      <button className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Sidebar Intelligence Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-t-2 border-primary/40 h-full flex flex-col">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-primary" />
              AI Incident Analysis
            </h3>

            {selectedAlert ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 flex-1"
              >
                <div className="p-4 bg-background/50 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Detection Subject</span>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded uppercase">
                      {selectedAlert.type}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium leading-relaxed italic">
                    "{selectedAlert.content}"
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Automated Summary</p>
                    <div className="p-3 bg-white/5 rounded-xl text-xs text-slate-300 leading-relaxed border border-white/5">
                      Social Scanner detected multiple high-urgency keywords in the {selectedAlert.location} area. 
                      Platform data suggests a {selectedAlert.riskLevel}/10 risk level. Source exhibits {selectedAlert.sentiment} patterns.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Risk Score</p>
                      <p className="text-xl font-black text-critical">{selectedAlert.riskLevel}.5</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Verified</p>
                      <p className={`text-xl font-black ${selectedAlert.isVerified ? 'text-safe' : 'text-slate-500'}`}>
                        {selectedAlert.isVerified ? 'YES' : 'NO'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 space-y-3">
                  <button 
                    onClick={() => {
                      if(window.confirm('Promote this social alert to an official SOS incident?')) {
                        convertToIncident(selectedAlert.id);
                        setSelectedAlert(null);
                      }
                    }}
                    className="w-full py-4 bg-primary hover:bg-primary/80 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Promote to Triage</span>
                  </button>
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">
                    Discard Alert
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
                <Search className="w-16 h-16 text-slate-600" />
                <div>
                  <p className="text-xs font-black text-white uppercase mb-1">Intelligence Idle</p>
                  <p className="text-[10px] text-slate-500 font-bold max-w-[200px]">Select a detected alert from the live feed to perform deep AI analysis.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialScanner;
