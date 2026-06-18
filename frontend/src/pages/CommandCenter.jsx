import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TacticalMap from '../components/CommandCenter/TacticalMap';
import SOSQueue from '../components/CommandCenter/SOSQueue';
import TeamIntel from '../components/CommandCenter/TeamIntel';
import SOSDetailPanel from '../components/CommandCenter/SOSDetailPanel';
import FleetOverview from '../components/CommandCenter/FleetOverview';
import TacticalStatusBar from '../components/CommandCenter/TacticalStatusBar';
import LiveActivityFeed from '../components/CommandCenter/LiveActivityFeed';
import { 
  Shield, BrainCircuit, Activity, Loader2, ArrowLeft, Zap, Target, Search, 
  Maximize2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Terminal, 
  AlertCircle as AlertIcon, Menu, X, ShieldAlert, Scan 
} from 'lucide-react';
import useSosStore from '../store/useSosStore';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5999/api');
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5999';

const CommandCenter = () => {
  const { reports: sosReports, fetchReports } = useSosStore();
  const [selectedSos, setSelectedSos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState('sos'); // 'sos' or 'fleet'
  const [isTacticalAILive, setIsTacticalAILive] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(window.innerWidth < 1024);
  const [isRightCollapsed, setIsRightCollapsed] = useState(window.innerWidth < 1024);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(window.innerWidth < 1024);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({ teamsCount: 0 });
  const [isDispatching, setIsDispatching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL INCIDENTS');
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), message: 'TACTICAL INTERFACE INITIALIZED', type: 'success' },
    { id: 2, time: new Date().toLocaleTimeString(), message: 'NEURAL LINK ESTABLISHED', type: 'success' },
    { id: 3, time: new Date().toLocaleTimeString(), message: 'SCANNING FOR DISTRESS SIGNALS...', type: 'neutral' }
  ]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [missions, setMissions] = useState([]);

  const addLog = useCallback((message, type = 'neutral') => {
    setLogs(prev => [...prev.slice(-19), {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: message.toUpperCase(),
      type
    }]);
  }, []);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchReports();
        const [teamsRes, missionsRes] = await Promise.all([
          axios.get(`${API_URL}/teams`),
          axios.get(`${API_URL}/missions`)
        ]);
        setTeams(teamsRes.data);
        setMissions(missionsRes.data);
        setStats({ teamsCount: teamsRes.data.length });
        addLog(`SYNCED LIVE INCIDENTS`, 'success');
      } catch (err) {
        console.error('Error fetching command data:', err);
        addLog('DATABASE SYNC FAILED - OFFLINE MODE', 'alert');
      }
    };
    fetchData();

    const socket = io(SOCKET_URL);
    socket.emit('join_room', 'command_center');

    socket.on('NEW_SOS_REPORT', (report) => {
      addLog(`NEW SIGNAL DETECTED: ${report.id}`, 'alert');
      fetchReports();
    });

    socket.on('vehicle_update', (data) => {
      // data: { missionId, teamId, location, status }
      setTeams(prev => prev.map(t => t.id === data.teamId ? { ...t, location: data.location, status: data.status } : t));
      setMissions(prev => prev.map(m => m.id === data.missionId ? { ...m, status: data.status } : m));
    });

    socket.on('mission_assigned', (mission) => {
      setMissions(prev => [...prev, mission]);
      setTeams(prev => prev.map(t => t.id === mission.teamId ? { ...t, status: 'DISPATCHED' } : t));
      addLog(`AI MISSION AUTHORIZED: UNIT ${mission.teamId} DEPLOYED`, 'success');
    });

    return () => socket.disconnect();
  }, [addLog]);

  const handleDispatch = async (sosId, teamId) => {
    setIsDispatching(true);
    addLog(`INITIATING DISPATCH FOR ${sosId}`, 'dispatch');
    try {
      await axios.post(`${API_URL}/dispatch/assign`, { sosId, teamId });
      setSelectedSos(null);
      addLog(`DISPATCH SUCCESSFUL - UNIT EN ROUTE`, 'success');
    } catch (err) {
      console.error('Dispatch failed:', err);
      addLog(`DISPATCH FAILED - SYSTEM REJECTION`, 'alert');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleAutoDispatch = async () => {
    try {
      setIsTacticalAILive(true);
      setIsDispatching(true);
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
    } finally {
      setIsDispatching(false);
    }
  };

  const handleAutoAssign = handleAutoDispatch;

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

  const toggleAutonomous = async () => {
    if (isAutonomousMode) {
      // Aborting: Recall all dispatched teams
      addLog('COMMAND: ABORTING ALL AI OPERATIONS // RECALLING FLEET', 'alert');
      try {
        const activeTeams = teams.filter(t => t.status === 'DISPATCHED' || t.status === 'EN_ROUTE');
        await Promise.all(activeTeams.map(t => axios.post(`${API_URL}/dispatch/recall`, { teamId: t.id })));
        setMissions([]);
        setIsTacticalAILive(false);
        addLog('FLEET RECALLED: AI STAND-BY', 'info');
      } catch (err) {
        addLog('ABORT ERROR: SOME UNITS MAY REMAIN ACTIVE', 'alert');
      }
    } else {
      setIsTacticalAILive(true);
    }
    setIsAutonomousMode(prev => !prev);
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

  const handleScan = () => {
    setIsTacticalAILive(prev => !prev);
    addLog(isTacticalAILive ? 'SCAN_ABORTED: Ceasing tactical sweep.' : 'INITIATING SCAN: Synchronizing multi-spectral sensors...', 'neutral');
  };

  const handleExpand = () => {
    const shouldCollapse = !isLeftCollapsed;
    setIsLeftCollapsed(shouldCollapse);
    setIsRightCollapsed(shouldCollapse);
    setIsFeedCollapsed(shouldCollapse);
    addLog(shouldCollapse ? 'HUD_MINIMIZED: Wide-angle tactical view active.' : 'HUD_RESTORED: Multi-panel telemetry active.', 'neutral');
  };

  // Filtered Data for components
  const filteredReports = useMemo(() => {
    return sosReports.filter(report => {
      const filter = activeFilter.toUpperCase();
      if (filter === 'ALL INCIDENTS') return true;
      if (filter === 'CRITICAL') return report.severity?.toUpperCase() === 'CRITICAL' || report.severity?.toUpperCase() === 'HIGH';
      if (filter === 'MEDICAL') return report.isMedical || report.aiSummary?.toLowerCase().includes('medical');
      if (filter === 'VERIFIED') return (report.aiTrustScore || 0) >= 90;
      if (filter === 'NEAR ME') return true;
      return true;
    });
  }, [sosReports, activeFilter]);

  // Log filter changes
  useEffect(() => {
    addLog(`TACTICAL FILTER APPLIED: ${activeFilter}`, 'neutral');
  }, [activeFilter, addLog]);

  return (
    <div className="h-screen w-full bg-[#020617] flex flex-col overflow-hidden selection:bg-cyan-500/30">
      {/* Background Grid/Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      
      <TacticalStatusBar stats={{ ...stats, sosCount: sosReports.length, activeFilter }} />

      {/* Main Operational Interface */}
      <main className="flex-1 relative overflow-hidden">
        {/* BACKGROUND: Tactical Map (Takes full screen) */}
        <div className="absolute inset-0 z-0">
          <TacticalMap 
            teams={teams}
            missions={missions}
            sosReports={filteredReports}
            selectedTeam={selectedTeam}
            onTeamSelect={setSelectedTeam}
            isAIActive={isTacticalAILive}
            onSelectSos={setSelectedSos}
            activeFilter={activeFilter}
            onScan={handleScan}
            onExpand={handleExpand}
            isHUDHidden={isLeftCollapsed}
          />
        </div>

        {/* HUD OVERLAY: Left Panel (SOS Intelligence) */}
        <motion.aside 
          initial={false}
          animate={{ 
            x: isLeftCollapsed ? 'calc(-100% - 24px)' : 0,
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-6 bottom-6 left-6 w-[90vw] md:w-[400px] z-30 flex flex-col pointer-events-none"
        >
          <div className="pointer-events-auto h-full flex flex-col relative">
            {/* Collapse Button - Left */}
            <button 
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-950 border border-white/10 rounded-r-lg flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-50 shadow-xl backdrop-blur-xl"
            >
              {isLeftCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={isLeftCollapsed ? 'opacity-0 invisible pointer-events-none transition-all' : 'opacity-100 visible h-full flex flex-col transition-all'}>
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
                        filteredReports={filteredReports}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
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
            x: isRightCollapsed ? 'calc(100% + 24px)' : 0,
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-6 bottom-6 right-6 w-[90vw] md:w-[400px] z-30 flex flex-col pointer-events-none"
        >
          <div className="pointer-events-auto h-full flex flex-col relative">
            {/* Collapse Button - Right */}
            <button 
              onClick={() => setIsRightCollapsed(!isRightCollapsed)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-950 border border-white/10 rounded-l-lg flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-50 shadow-xl backdrop-blur-xl"
            >
              {isRightCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            <div className={isRightCollapsed ? 'opacity-0 invisible pointer-events-none transition-all' : 'opacity-100 visible h-full flex flex-col transition-all'}>
              <TeamIntel 
                teams={teams}
                selectedTeam={selectedTeam}
                onDispatch={(teamId) => selectedSos ? handleDispatch(selectedSos.id, teamId) : addLog('ERR: SELECT_TARGET_SOS_FIRST', 'alert')}
                onAutoDispatch={handleAutoDispatch}
                isAutonomous={isAutonomousMode}
                onToggleAutonomous={toggleAutonomous}
                onRecall={handleRecall}
                onHold={handleHold}
                isDispatching={isDispatching}
                activeFilter={activeFilter}
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

        {/* SOS Detail Overlay (Centered) */}
        <AnimatePresence>
          {selectedSos && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
              <div className="pointer-events-auto w-full max-w-2xl h-[80vh]">
                <SOSDetailPanel 
                  sos={selectedSos} 
                  onClose={() => setSelectedSos(null)}
                  teams={teams}
                  onDispatch={handleDispatch}
                  isDispatching={isDispatching}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CommandCenter;
