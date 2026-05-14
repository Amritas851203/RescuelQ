import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TacticalMap from '../components/CommandCenter/TacticalMap';
import SOSQueue from '../components/CommandCenter/SOSQueue';
import TeamIntel from '../components/CommandCenter/TeamIntel';
import SOSDetailPanel from '../components/CommandCenter/SOSDetailPanel';
<<<<<<< HEAD
import FleetOverview from '../components/CommandCenter/FleetOverview';
import { Shield, BrainCircuit, Activity, Loader2, ArrowLeft, Zap, Target, Search, Maximize2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Terminal, AlertCircle as AlertIcon } from 'lucide-react';
=======
import TacticalStatusBar from '../components/CommandCenter/TacticalStatusBar';
import LiveActivityFeed from '../components/CommandCenter/LiveActivityFeed';
import { Menu, X, BrainCircuit, Activity, ShieldAlert, Target, Scan } from 'lucide-react';
import useSosStore from '../store/useSosStore';
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a

const API_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5999/api';
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5999';

const CommandCenter = () => {
  const { reports: sosReports, fetchReports } = useSosStore();
  const [selectedSos, setSelectedSos] = useState(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState('sos'); // 'sos' or 'fleet'
  const [isTacticalAILive, setIsTacticalAILive] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
=======
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({ teamsCount: 0 });
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL INCIDENTS');
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), message: 'TACTICAL INTERFACE INITIALIZED', type: 'success' },
    { id: 2, time: new Date().toLocaleTimeString(), message: 'NEURAL LINK ESTABLISHED', type: 'success' },
    { id: 3, time: new Date().toLocaleTimeString(), message: 'SCANNING FOR DISTRESS SIGNALS...', type: 'neutral' }
  ]);
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a

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
        const teamRes = await axios.get(`${API_URL}/dispatch/teams`);
        setTeams(teamRes.data);
        setStats({ teamsCount: teamRes.data.length });
        addLog(`SYNCED LIVE INCIDENTS`, 'success');
      } catch (err) {
        console.error('Error fetching command data:', err);
        addLog('DATABASE SYNC FAILED - OFFLINE MODE', 'alert');
      }
    };
    fetchData();

    const socket = io(SOCKET_URL);
    socket.on('NEW_SOS_REPORT', (report) => {
      addLog(`NEW SIGNAL DETECTED: ${report.id}`, 'alert');
    });
    socket.on('team_update', (updatedTeam) => {
      setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
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

<<<<<<< HEAD
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
=======
  const handleAutoAssign = async () => {
    setIsDispatching(true);
    addLog('NEURAL NETWORK OPTIMIZING MISSION...', 'neutral');
    try {
      const res = await axios.post(`${API_URL}/dispatch/auto-assign`);
      if (res.data.assigned) {
        addLog(`AUTO-ASSIGNED ${res.data.teamName} TO ${res.data.sosId}`, 'success');
      }
    } catch (err) {
      console.error('Auto-assign failed:', err);
      addLog('AUTO-ASSIGNMENT OPTIMIZATION FAILED', 'alert');
    } finally {
      setIsDispatching(false);
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a
    }
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

<<<<<<< HEAD
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
=======
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Toggle (Mobile) */}
        <button 
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="absolute top-4 left-4 z-[1001] lg:hidden glass-panel p-2 text-white border-white/10"
        >
          {leftSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* SOS Queue Sidebar */}
        <aside className={`
          fixed lg:relative top-0 left-0 h-full w-[340px] z-[1000] lg:z-20
          transition-transform duration-500 ease-in-out
          ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'}
        `}>
          <SOSQueue 
            sosReports={sosReports} 
            filteredReports={filteredReports}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedSos={selectedSos}
            onSelect={setSelectedSos} 
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a
          />
        </div>

<<<<<<< HEAD
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
=======
        {/* Tactical Map Center */}
        <section className="flex-1 h-full relative min-w-0 bg-[#050811] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <TacticalMap 
              sosReports={filteredReports} 
              teams={teams}
              activeFilter={activeFilter}
              onSelectSos={setSelectedSos}
            />
          </div>

          {/* Floating UI Elements over Map */}
          <div className="absolute top-6 right-6 z-10 hidden xl:flex flex-col gap-4">
             <LiveActivityFeed logs={logs} />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
            <button 
              onClick={handleAutoAssign}
              disabled={isDispatching}
              className="px-8 py-3 glass-panel border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-[0.2em] hover:bg-cyan-500/10 active:scale-95 transition-all flex items-center gap-3 group"
            >
              {isDispatching ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <BrainCircuit size={18} className="group-hover:rotate-12 transition-transform" />
              )}
              Neural Auto-Assign
            </button>
            <button className="px-6 py-3 glass-panel border-white/10 text-white/40 text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2">
              <Scan size={16} /> Area Scan
            </button>
          </div>

          {/* Alert Overlay for Critical */}
          <AnimatePresence>
            {activeFilter === 'CRITICAL' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-50 ring-[20px] ring-inset ring-red-500/10 animate-pulse"
              />
            )}
          </AnimatePresence>
        </section>

        {/* Team Intelligence Sidebar */}
        <aside className={`
          fixed lg:relative top-0 right-0 h-full w-[340px] z-[1000] lg:z-20
          transition-transform duration-500 ease-in-out
          ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:w-0'}
        `}>
          <TeamIntel 
            teams={teams} 
            activeFilter={activeFilter}
            onDispatch={(teamId) => selectedSos && handleDispatch(selectedSos.id, teamId)}
            isDispatching={isDispatching}
          />
        </aside>

        {/* Right Toggle (Mobile) */}
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="absolute top-4 right-4 z-[1001] lg:hidden glass-panel p-2 text-white border-white/10"
        >
          {rightSidebarOpen ? <X size={20} /> : <Activity size={20} />}
        </button>

        {/* Expandable Detail Panel Overlay */}
        <AnimatePresence>
          {selectedSos && (
            <div className="absolute inset-0 z-[1100] flex items-center justify-center p-4 lg:p-8 pointer-events-none">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto" onClick={() => setSelectedSos(null)} />
              <div className="relative w-full max-w-[440px] h-full max-h-[850px] pointer-events-auto">
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a
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
