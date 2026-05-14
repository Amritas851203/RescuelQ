import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TacticalMap from '../components/CommandCenter/TacticalMap';
import SOSQueue from '../components/CommandCenter/SOSQueue';
import TeamIntel from '../components/CommandCenter/TeamIntel';
import SOSDetailPanel from '../components/CommandCenter/SOSDetailPanel';
import TacticalStatusBar from '../components/CommandCenter/TacticalStatusBar';
import LiveActivityFeed from '../components/CommandCenter/LiveActivityFeed';
import { Menu, X, BrainCircuit, Activity, ShieldAlert, Target, Scan } from 'lucide-react';
import useSosStore from '../store/useSosStore';

const API_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5999/api';
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5999';

const CommandCenter = () => {
  const { reports: sosReports, fetchReports } = useSosStore();
  const [selectedSos, setSelectedSos] = useState(null);
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
          />
        </aside>

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
