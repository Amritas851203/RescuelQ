import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TacticalMap from '../components/CommandCenter/TacticalMap';
import SOSQueue from '../components/CommandCenter/SOSQueue';
import TeamIntel from '../components/CommandCenter/TeamIntel';
import LiveActivityFeed from '../components/CommandCenter/LiveActivityFeed';
import TacticalStatusBar from '../components/CommandCenter/TacticalStatusBar';
import SOSDetailPanel from '../components/CommandCenter/SOSDetailPanel';
import { Shield, BrainCircuit, Activity, Loader2, ArrowLeft, Zap, Target, Search, Maximize2 } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const CommandCenter = () => {
  const [socket, setSocket] = useState(null);
  const [teams, setTeams] = useState([]);
  const [missions, setMissions] = useState([]);
  const [sosReports, setSosReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSos, setSelectedSos] = useState(null);
  const [loading, setLoading] = useState(true);

  const addLog = useCallback((message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  }, []);

  const stats = useMemo(() => ({
    sosCount: sosReports.length,
    teamsCount: teams.length,
    missionsCount: missions.length,
    criticalCount: sosReports.filter(s => s.severity === 'CRITICAL').length
  }), [sosReports, teams, missions]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      addLog('Neural Link Established // Global Tactical Network Sync', 'success');
      newSocket.emit('join_room', 'command_center');
    });

    newSocket.on('vehicle_update', (update) => {
      setMissions(prev => prev.map(m => 
        m.id === update.missionId ? { ...m, currentLocation: update.location, status: update.status } : m
      ));
      
      setTeams(prev => prev.map(t => 
        t.id === update.teamId ? { ...t, location: update.location, status: update.status } : t
      ));
    });

    newSocket.on('mission_assigned', (mission) => {
      setMissions(prev => [...prev, mission]);
      setTeams(prev => prev.map(t => 
        t.id === mission.teamId ? { ...t, status: 'DISPATCHED' } : t
      ));
      addLog(`TACTICAL: Mission ${mission.id} initiated. Team ${mission.teamId} dispatched to target.`, 'dispatch');
    });

    return () => newSocket.close();
  }, [addLog]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, missionsRes, sosRes] = await Promise.allSettled([
          axios.get(`${API_URL}/teams`),
          axios.get(`${API_URL}/missions`),
          axios.get(`${API_URL}/sos`)
        ]);

        if (teamsRes.status === 'fulfilled') setTeams(teamsRes.value.data);
        if (missionsRes.status === 'fulfilled') setMissions(missionsRes.value.data);
        if (sosRes.status === 'fulfilled') setSosReports(sosRes.value.data);
        
        addLog('Global Tactical Intelligence Synchronized', 'success');
      } catch (error) {
        console.error('Error fetching tactical data:', error);
        addLog('Sync Error: Tactical data stream interrupted', 'alert');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addLog]);

  const handleDispatch = async (sosId) => {
    const teamId = selectedTeam?.id;
    if (!teamId || !sosId) {
      addLog('ERR: Target selection incomplete for dispatch sequence', 'alert');
      return;
    }
    
    try {
      addLog(`Initiating dispatch for Unit ${teamId}...`, 'info');
      await axios.post(`${API_URL}/dispatch/assign`, { teamId, sosId });
      setSelectedSos(null);
    } catch (error) {
      addLog(`DISPATCH CRITICAL ERROR: ${error.response?.data?.message || error.message}`, 'alert');
    }
  };

  const handleAutoDispatch = async () => {
    if (!selectedSos) {
      addLog('AI ERR: Target SOS required for automated optimization', 'alert');
      return;
    }

    try {
      addLog('AI Neural Net: Optimizing extraction route and unit selection...', 'info');
      await axios.post(`${API_URL}/dispatch/auto`, { sosId: selectedSos.id });
      setSelectedSos(null);
    } catch (error) {
      addLog(`AI OPTIMIZATION FAILED: ${error.response?.data?.message || error.message}`, 'alert');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050811] flex flex-col items-center justify-center font-mono">
        <div className="relative mb-12">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full border-t-2 border-r-2 border-cyan-500/50"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-500/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="text-cyan-500 animate-pulse" size={40} />
          </div>
        </div>
        <div className="space-y-4 text-center">
          <div className="text-cyan-400 text-lg font-black tracking-[0.5em] animate-pulse uppercase">RescueIQ Command Center</div>
          <div className="text-white/20 text-xs tracking-widest uppercase font-mono">Neural Link Syncing // 99.2% complete</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#050811] overflow-hidden flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Expanded Tactical Status Bar */}
      <TacticalStatusBar stats={stats} />

      {/* Main Operational Interface */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Enhanced SOS Queue */}
        <aside className="w-[420px] h-full flex flex-col shrink-0 z-20">
          <SOSQueue 
            sosReports={sosReports} 
            selectedSos={selectedSos}
            onSelect={setSelectedSos} 
          />
        </aside>

        {/* Center Panel: Cinematic Map & Floating Intel */}
        <section className="flex-1 flex flex-col relative min-w-0">
          <div className="flex-1 relative">
            <TacticalMap 
              teams={teams}
              missions={missions}
              sosReports={sosReports}
              selectedTeam={selectedTeam}
              onTeamSelect={setSelectedTeam}
            />

            {/* Floating Analytics Widgets */}
            <div className="absolute top-6 left-6 z-[1000] space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Active Coverage</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-2xl font-black text-white leading-none">94.2%</div>
                    <div className="text-[9px] text-white/20 uppercase font-bold mt-1">Satellite Lock</div>
                  </div>
                  <div className="flex-1 h-8 flex items-end gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BrainCircuit className="text-purple-400" size={16} />
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">AI Prediction</span>
                </div>
                <div className="text-xs font-mono text-purple-100/70 italic">
                  "Flood surge expected +0.4m in Sector 14 in approx 12 mins."
                </div>
              </motion.div>
            </div>

            {/* Map Interaction Tools */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-8 shadow-2xl">
                <button className="flex flex-col items-center gap-1 group">
                  <Search size={18} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Scan</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <Target size={18} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Lock</span>
                </button>
                <div className="w-px h-6 bg-white/10" />
                <button className="flex flex-col items-center gap-1 group">
                  <Maximize2 size={18} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Expand</span>
                </button>
              </div>
            </div>
            
            {/* Expandable Detail Panel */}
            <AnimatePresence>
              {selectedSos && (
                <SOSDetailPanel 
                  sos={selectedSos} 
                  onClose={() => setSelectedSos(null)}
                  onDispatch={handleDispatch}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-[1000] max-w-[600px]">
            <LiveActivityFeed logs={logs} />
          </div>
        </section>

        {/* Right Panel: Intelligence Center */}
        <aside className="w-[420px] h-full shrink-0 z-20">
          <TeamIntel 
            selectedTeam={selectedTeam}
            onDispatch={handleDispatch}
            onAutoDispatch={handleAutoDispatch}
          />
        </aside>
      </main>

      {/* Futuristic Tactical Footer */}
      <footer className="h-10 bg-black border-t border-white/5 px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Mainframe Sync: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-cyan-500 animate-pulse" size={14} />
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">AI Node 08: Nominal</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-white/20 font-mono tracking-widest uppercase">
          <span className="text-cyan-500/30">Encrypted Uplink // Secure Protocol 942</span>
          <span>Tactical Command // 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default CommandCenter;
