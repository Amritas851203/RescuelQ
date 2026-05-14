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
import FleetOverview from '../components/CommandCenter/FleetOverview';
import { Shield, BrainCircuit, Activity, Loader2, ArrowLeft, Zap, Target, Search, Maximize2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Terminal, AlertCircle as AlertIcon } from 'lucide-react';

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
  const [activeLeftTab, setActiveLeftTab] = useState('sos'); // 'sos' or 'fleet'
  const [isTacticalAILive, setIsTacticalAILive] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);

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
    try {
      setIsTacticalAILive(true);
      if (selectedSos) {
        addLog('AI Neural Net: Optimizing extraction route and unit selection for target...', 'info');
        await axios.post(`${API_URL}/dispatch/auto`, { sosId: selectedSos.id });
        setSelectedSos(null);
      } else {
        if (!isAutonomousMode) addLog('AI GLOBAL_SCAN: Analyzing all unassigned incidents and unit proximity...', 'info');
        const response = await axios.post(`${API_URL}/dispatch/auto`, {});
        if (!isAutonomousMode) addLog(`AI SUCCESS: ${response.data.message}`, 'success');
      }
    } catch (error) {
      if (!isAutonomousMode) addLog(`AI OPTIMIZATION FAILED: ${error.response?.data?.message || error.message}`, 'alert');
    }
  };

  // Autonomous Mode Effect
  useEffect(() => {
    let interval;
    if (isAutonomousMode) {
      setIsTacticalAILive(true);
      addLog('CRITICAL: AI AUTONOMOUS MODE ACTIVATED // DEPLOYMENT AUTHORIZED', 'alert');
      // Auto-dispatch every 15 seconds
      interval = setInterval(() => {
        handleAutoDispatch();
      }, 15000);
    } else {
      if (interval) addLog('INFO: AI AUTONOMOUS MODE DEACTIVATED // MANUAL CONTROL RESTORED', 'info');
    }
    return () => clearInterval(interval);
  }, [isAutonomousMode]);

  const toggleAutonomous = () => {
    setIsAutonomousMode(prev => {
      const newState = !prev;
      if (!newState) setIsTacticalAILive(false);
      return newState;
    });
  };

  const handleRecall = async (teamId) => {
    try {
      addLog(`RECALL_INITIATED: Commanding Unit ${teamId} to return to base...`, 'info');
      await axios.post(`${API_URL}/dispatch/recall`, { teamId });
      addLog(`UNIT_SYNC: Unit ${teamId} is returning. Sector cleared.`, 'success');
    } catch (error) {
      addLog(`RECALL_FAILED: ${error.response?.data?.message || error.message}`, 'alert');
    }
  };

  const handleHold = async (teamId) => {
    try {
      addLog(`HOLD_COMMAND: Signaling Unit ${teamId} to maintain current position...`, 'info');
      await axios.post(`${API_URL}/dispatch/hold`, { teamId });
      addLog(`UNIT_STATUS: Unit ${teamId} is on STAND-BY. Telemetry locked.`, 'warning');
    } catch (error) {
      addLog(`HOLD_FAILED: ${error.response?.data?.message || error.message}`, 'alert');
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
      <main className="flex-1 relative overflow-hidden">
        {/* BACKGROUND: Tactical Map (Takes full screen) */}
        <div className="absolute inset-0 z-0">
          <TacticalMap 
            teams={teams}
            missions={missions}
            sosReports={sosReports}
            selectedTeam={selectedTeam}
            onTeamSelect={setSelectedTeam}
            isAIActive={isTacticalAILive}
          />
        </div>

        {/* HUD OVERLAY: Left Panel (SOS Intelligence) */}
        <motion.aside 
          initial={false}
          animate={{ 
            x: isLeftCollapsed ? -380 : 0,
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-6 bottom-6 left-6 w-[400px] z-30 flex flex-col pointer-events-none"
        >
          <div className="pointer-events-auto h-full flex flex-col relative">
            {/* Collapse Button - Left */}
            <button 
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-950 border border-white/10 rounded-r-lg flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-50 shadow-xl backdrop-blur-xl"
            >
              {isLeftCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={isLeftCollapsed ? 'opacity-0 invisible pointer-events-none transition-all' : 'opacity-100 visible h-full transition-all'}>
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setActiveLeftTab('sos')}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeLeftTab === 'sos' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/5 text-white/30'}`}
                >
                  SOS Intel
                </button>
                <button 
                  onClick={() => setActiveLeftTab('fleet')}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeLeftTab === 'fleet' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-white/30'}`}
                >
                  Fleet Ops
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeLeftTab === 'sos' ? (
                    <motion.div 
                      key="sos"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <SOSQueue 
                        sosReports={sosReports} 
                        selectedSos={selectedSos}
                        onSelect={setSelectedSos} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="fleet"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="h-full"
                    >
                      <FleetOverview teams={teams} missions={missions} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Minimized Tab - Left */}
            <AnimatePresence>
              {isLeftCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setIsLeftCollapsed(false)}
                  className="absolute left-0 top-0 bottom-0 w-12 bg-gray-950/80 border border-white/10 rounded-2xl flex flex-col items-center py-6 gap-8 cursor-pointer hover:bg-gray-900 transition-colors pointer-events-auto shadow-2xl backdrop-blur-xl"
                >
                  <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                    <AlertIcon size={16} />
                  </div>
                  <div className="h-px w-6 bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 [writing-mode:vertical-lr] rotate-180">SOS INTEL</span>
                  <div className="mt-auto p-2 text-cyan-400 animate-pulse">
                    <ChevronRight size={16} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>

        {/* HUD OVERLAY: Right Panel (Team Intelligence) */}
        <motion.aside 
          initial={false}
          animate={{ 
            x: isRightCollapsed ? 380 : 0,
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-6 bottom-6 right-6 w-[400px] z-30 flex flex-col pointer-events-none"
        >
          <div className="pointer-events-auto h-full flex flex-col relative">
            {/* Collapse Button - Right */}
            <button 
              onClick={() => setIsRightCollapsed(!isRightCollapsed)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-950 border border-white/10 rounded-l-lg flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-50 shadow-xl backdrop-blur-xl"
            >
              {isRightCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            <div className={isRightCollapsed ? 'opacity-0 invisible pointer-events-none transition-all' : 'opacity-100 visible h-full transition-all'}>
              <TeamIntel 
                selectedTeam={selectedTeam}
                onDispatch={() => selectedSos ? handleDispatch(selectedSos.id) : addLog('ERR: SELECT_TARGET_SOS_FIRST', 'alert')}
                onAutoDispatch={handleAutoDispatch}
                isAutonomous={isAutonomousMode}
                onToggleAutonomous={toggleAutonomous}
                onRecall={handleRecall}
                onHold={handleHold}
              />
            </div>

            {/* Minimized Tab - Right */}
            <AnimatePresence>
              {isRightCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setIsRightCollapsed(false)}
                  className="absolute right-0 top-0 bottom-0 w-12 bg-gray-950/80 border border-white/10 rounded-2xl flex flex-col items-center py-6 gap-8 cursor-pointer hover:bg-gray-900 transition-colors pointer-events-auto shadow-2xl backdrop-blur-xl"
                >
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
                    <BrainCircuit size={16} />
                  </div>
                  <div className="h-px w-6 bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 [writing-mode:vertical-lr]">AI TACTICAL</span>
                  <div className="mt-auto p-2 text-cyan-400 animate-pulse">
                    <ChevronLeft size={16} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>

        {/* HUD OVERLAY: Bottom Center (Live Activity Feed) */}
        <div className="absolute bottom-6 left-[430px] right-[430px] z-20 flex justify-center pointer-events-none overflow-hidden">
          <motion.div 
            initial={false}
            animate={{ 
              y: isFeedCollapsed ? 220 : 0,
              opacity: isFeedCollapsed ? 0 : 1
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="pointer-events-auto w-full max-w-[800px] relative"
          >
            {/* Collapse Button - Feed */}
            <button 
              onClick={() => setIsFeedCollapsed(true)}
              className="absolute top-3 right-3 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all z-30"
              title="Minimize Feed"
            >
              <ChevronDown size={14} />
            </button>

            <LiveActivityFeed logs={logs} />
          </motion.div>

          {/* Minimized Tab - Feed */}
          <AnimatePresence>
            {isFeedCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                onClick={() => setIsFeedCollapsed(false)}
                className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center gap-3 cursor-pointer hover:bg-gray-900 transition-all shadow-2xl z-30 group"
              >
                <Terminal size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Ops Feed</span>
                <ChevronUp size={14} className="text-cyan-400 animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD OVERLAY: Center Top (Global Analytics) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 pointer-events-none">
           <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-8"
          >
            <div className="flex items-center gap-3 border-r border-white/10 pr-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-[9px] text-white/30 uppercase font-black tracking-widest">Network Coverage</div>
                <div className="text-sm font-black text-white">94.2% ACTIVE</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BrainCircuit className={isAutonomousMode ? 'text-emerald-400' : 'text-purple-400'} size={18} />
              <div>
                <div className="text-[9px] text-white/30 uppercase font-black tracking-widest">AI Status</div>
                <div className="text-sm font-black text-white">{isAutonomousMode ? 'AUTONOMOUS ACTIVE' : 'PREDICTIVE STABLE'}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Interaction Tools (Bottom Dock) */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-8 shadow-2xl scale-90">
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
        
        {/* SOS Detail Overlay (Centered) */}
        <AnimatePresence>
          {selectedSos && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
              <div className="pointer-events-auto">
                <SOSDetailPanel 
                  sos={selectedSos} 
                  onClose={() => setSelectedSos(null)}
                  onDispatch={handleDispatch}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
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
