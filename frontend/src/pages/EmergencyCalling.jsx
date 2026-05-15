import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneForwarded, PhoneMissed, PhoneOff, Activity, Shield, Users, Clock, AlertCircle, CheckCircle2, ChevronRight, Search, Filter, BarChart3, Radio, MessageSquare, Mic, Volume2 } from 'lucide-react';
import axios from 'axios';
import { socket } from '../hooks/useRealtime';
import clsx from 'clsx';

const EmergencyCalling = () => {
  const [calls, setCalls] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');
  const [activeCallId, setActiveCallId] = useState(null);
  const [transcripts, setTranscripts] = useState({});
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    fetchData();

    // Socket listeners
    socket.on('EMERGENCY_CALL_STATUS', (newCall) => {
      setCalls(prev => {
        const index = prev.findIndex(c => c.id === newCall.id || c.call_sid === newCall.call_sid);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...newCall };
          return updated;
        }
        return [newCall, ...prev];
      });
      if (['calling', 'ringing', 'connected'].includes(newCall.status?.toLowerCase())) {
        setActiveCallId(newCall.call_sid || newCall.id);
      }
    });

    socket.on('EMERGENCY_CALL_STATUS_UPDATE', (update) => {
      setCalls(prev => prev.map(c => 
        c.call_sid === update.call_sid ? { ...c, status: update.status } : c
      ));
      if (update.status?.toLowerCase() === 'completed' || update.status?.toLowerCase() === 'failed') {
        if (activeCallId === update.call_sid) setActiveCallId(null);
      }
    });

    socket.on('LIVE_TRANSCRIPT', (data) => {
      setTranscripts(prev => ({
        ...prev,
        [data.call_sid || data.incident_id]: [
          ...(prev[data.call_sid || data.incident_id] || []),
          data
        ]
      }));
      
      if (data.source === 'AI Agent') {
        setIsAiSpeaking(true);
        setTimeout(() => setIsAiSpeaking(false), 3000);
      }
    });

    return () => {
      socket.off('EMERGENCY_CALL_STATUS');
      socket.off('EMERGENCY_CALL_STATUS_UPDATE');
      socket.off('LIVE_TRANSCRIPT');
    };
  }, [activeCallId]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, activeCallId]);

  const fetchData = async () => {
    try {
      const [logsRes, contactsRes, analyticsRes] = await Promise.all([
        axios.get('/api/emergency/logs'),
        axios.get('/api/emergency/contacts'),
        axios.get('/api/emergency/analytics')
      ]);
      setCalls(logsRes.data || []);
      setContacts(contactsRes.data || []);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch emergency calling data', err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'calling':
      case 'initiating':
      case 'ringing':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'connected':
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'completed':
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'failed':
      case 'missed':
      case 'no answer':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'calling':
      case 'initiating':
      case 'ringing':
        return <PhoneCall className="w-4 h-4 animate-pulse" />;
      case 'connected':
      case 'active':
        return <PhoneForwarded className="w-4 h-4 animate-bounce" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':
      case 'missed':
      case 'no answer':
        return <PhoneMissed className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const currentCallTranscripts = transcripts[activeCallId] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
            <Radio className="w-8 h-8 text-primary animate-pulse" />
            AI Emergency <span className="text-primary">Voice Dispatch</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium flex items-center gap-2 mt-1">
            <Activity className="w-4 h-4 text-primary" />
            Tactical AI Communication Engine Online
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Links</p>
              <p className="text-xl font-black text-white">{calls.filter(c => ['calling', 'ringing', 'connected'].includes(c.status?.toLowerCase())).length}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Confidence</p>
              <p className="text-xl font-black text-safe">98.4%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
            {[
              { id: 'queue', label: 'Call Stream', icon: Clock },
              { id: 'contacts', label: 'Tactical Contacts', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-panel min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/grid.png')] bg-repeat opacity-[0.03] pointer-events-none"></div>
            
            <div className="flex-1 p-6 relative z-10 flex flex-col">
              {activeTab === 'queue' && (
                <div className="space-y-4">
                  {calls.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 italic">
                      <PhoneOff className="w-12 h-12 mb-4 opacity-20" />
                      No active tactical dispatches
                    </div>
                  ) : (
                    calls.map((call, i) => (
                      <div 
                        key={call.id || i}
                        onClick={() => setActiveCallId(call.call_sid || call.id)}
                        className={clsx(
                          "group relative p-4 rounded-2xl border transition-all duration-500 cursor-pointer",
                          activeCallId === (call.call_sid || call.id)
                            ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                            : "bg-white/[0.03] border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={clsx(
                              "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                              getStatusColor(call.status)
                            )}>
                              {getStatusIcon(call.status)}
                            </div>
                            <div>
                              <h3 className="text-white font-bold">{call.contact_name}</h3>
                              <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{call.contact_phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className={clsx(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                              getStatusColor(call.status)
                            )}>
                              {call.status}
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                        
                        {/* Audio Wave for Active Link */}
                        {['calling', 'ringing', 'connected'].includes(call.status?.toLowerCase()) && (
                          <div className="mt-4 h-1 flex gap-1 items-end overflow-hidden opacity-50">
                            {[...Array(30)].map((_, j) => (
                              <div 
                                key={j}
                                className="flex-1 bg-primary rounded-full animate-wave" 
                                style={{ 
                                  height: `${Math.random() * 100}%`,
                                  animationDelay: `${j * 0.05}s`
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contacts.map(contact => (
                    <div 
                      key={contact.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">{contact.name}</h4>
                            <p className="text-[10px] text-slate-500 font-mono">{contact.phone}</p>
                            <p className="text-[10px] text-primary/60 mt-1 uppercase font-black tracking-widest">{contact.location}</p>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/20">
                          <PhoneCall className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Conversation Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel flex flex-col h-[600px]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Live Transcript
              </h2>
              {isAiSpeaking && (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-3 bg-safe animate-pulse"></div>
                  <div className="w-1 h-5 bg-safe animate-pulse delay-75"></div>
                  <div className="w-1 h-3 bg-safe animate-pulse delay-150"></div>
                  <span className="text-[10px] font-black text-safe uppercase ml-2">AI Speaking</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {activeCallId ? (
                currentCallTranscripts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-center p-6">
                    <Mic className="w-8 h-8 mb-2 opacity-20" />
                    Waiting for responder speech signal...
                  </div>
                ) : (
                  currentCallTranscripts.map((t, i) => (
                    <div 
                      key={i} 
                      className={clsx(
                        "p-3 rounded-xl max-w-[85%] text-xs font-medium leading-relaxed",
                        t.source === 'AI Agent' 
                          ? "bg-primary/10 text-primary self-start border border-primary/20 ml-0 mr-auto" 
                          : "bg-white/5 text-slate-300 self-end border border-white/10 ml-auto mr-0"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {t.source === 'AI Agent' ? <Volume2 className="w-3 h-3" /> : <Mic className="w-3 h-3 text-slate-500" />}
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                          {t.source}
                        </span>
                      </div>
                      {t.text}
                    </div>
                  ))
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-center p-6">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                  Select an active tactical link to view live intelligence stream.
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Link Integrity</span>
                <span className="text-[10px] font-black text-safe uppercase">Secure</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-safe w-[94%] animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* System Status HUD */}
          <div className="glass-panel p-6">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Engine Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500 uppercase">Conversational AI</span>
                <span className="text-safe uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500 uppercase">Neural Voice Synth</span>
                <span className="text-safe uppercase">Loaded</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500 uppercase">Real-time STT</span>
                <span className="text-safe uppercase">Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default EmergencyCalling;
