import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageSquare, Activity, Shield, AlertTriangle, Clock, ChevronDown, User, Radio, Waves, Zap, Globe, Languages } from 'lucide-react';
import useCallStore from '../store/useCallStore';
import { socket } from '../hooks/useRealtime';
import clsx from 'clsx';

const LANGUAGES = [
  { code: 'en-US', name: 'English', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' }
];

const CallOverlay = () => {
  const { 
    isRinging, isConnected, activeCall, acceptCall, rejectCall, endCall, 
    transcripts, addTranscript, isMuted, toggleMute, isSpeakerOn, toggleSpeaker,
    callTimer, incrementTimer
  } = useCallStore();

  const [recognition, setRecognition] = useState(null);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const ringingAudio = useRef(null);
  const alertAudio = useRef(null);
  const transcriptEndRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = false;
      recognizer.lang = selectedLang.code;

      recognizer.onstart = () => setIsListening(true);
      recognizer.onend = () => {
        if (isConnected && !isMuted && !isAiSpeaking) {
          try { recognizer.start(); } catch(e) {}
        } else {
          setIsListening(false);
        }
      };

      recognizer.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log(`[${selectedLang.name}] Responder Speech:`, transcript);
        
        socket.emit('RESPONDER_SPEECH', {
          callSid: activeCall?.call_sid,
          incidentId: activeCall?.incident_id || activeCall?.id,
          text: transcript,
          language: selectedLang.code
        });

        addTranscript({ source: 'Responder', text: transcript, timestamp: new Date().toISOString() });
      };

      setRecognition(recognizer);
      return () => { try { recognizer.stop(); } catch(e) {} };
    }
  }, [activeCall, isConnected, isMuted, isAiSpeaking, selectedLang, addTranscript]);

  // Handle Emergency Alert and Ringing Sound
  useEffect(() => {
    if (isRinging) {
      // 1. Pre-dispatch cinematic voice alert
      const announcementText = selectedLang.code.startsWith('hi') 
        ? 'आपातकालीन चेतावनी। गंभीर आपदा की सूचना मिली है। एआई सामरिक प्रेषण सक्रिय है।'
        : 'Emergency alert detected. Critical disaster incoming. AI tactical dispatch activated.';
      
      const announcement = new SpeechSynthesisUtterance(announcementText);
      announcement.lang = selectedLang.code;
      announcement.rate = 1.0;
      announcement.pitch = 0.8;
      window.speechSynthesis.speak(announcement);

      // 2. Play cinematic emergency radar alert
      const alert = new Audio('https://www.soundjay.com/nature/radar-sweep-01.mp3');
      alert.volume = 0.4;
      alert.play().catch(e => {});
      alertAudio.current = alert;

      // 3. Play ringing sound
      const ringing = new Audio('https://www.soundjay.com/phone/phone-calling-1.mp3');
      ringing.loop = true;
      ringing.volume = 0.5;
      setTimeout(() => ringing.play().catch(e => {}), 2000);
      ringingAudio.current = ringing;
    } else {
      if (ringingAudio.current) ringingAudio.current.pause();
      if (alertAudio.current) alertAudio.current.pause();
      
      if (isConnected) {
        const beep = new Audio('https://www.soundjay.com/button/beep-07.mp3');
        beep.volume = 0.3;
        beep.play().catch(e => {});
      }
    }
    return () => {
      if (ringingAudio.current) ringingAudio.current.pause();
      if (alertAudio.current) alertAudio.current.pause();
    };
  }, [isRinging, isConnected, selectedLang]);

  // Handle Call Timer and Listening State
  useEffect(() => {
    let interval;
    if (isConnected) {
      interval = setInterval(() => incrementTimer(), 1000);
      if (recognition && !isMuted && !isAiSpeaking) {
        try { recognition.start(); } catch(e) {}
      }
    } else {
      if (recognition) {
        try { recognition.stop(); } catch(e) {}
      }
    }
    return () => clearInterval(interval);
  }, [isConnected, recognition, isMuted, isAiSpeaking, incrementTimer]);

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Automatic AI Voice Synthesis (TTS)
  useEffect(() => {
    if (!isConnected || !isSpeakerOn) return;

    const lastTranscript = transcripts[transcripts.length - 1];
    if (lastTranscript?.source === 'AI Agent' && !lastTranscript.spoken) {
      lastTranscript.spoken = true; 
      
      if (recognition) {
        try { recognition.stop(); } catch(e) {}
      }

      const utterance = new SpeechSynthesisUtterance(lastTranscript.text);
      
      // Robust voice selection
      const voices = window.speechSynthesis.getVoices();
      const langCode = selectedLang.code.split('-')[0].toLowerCase();
      
      // 1. Exact match (e.g. hi-IN)
      let voice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === selectedLang.code.toLowerCase());
      
      // 2. Language group match (e.g. any 'hi' voice)
      if (!voice) {
        voice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
      }
      
      // 3. Multilingual voice match (some voices support multiple)
      if (!voice) {
        voice = voices.find(v => v.name.toLowerCase().includes('multilingual'));
      }

      if (voice) {
        console.log(`[TTS] Using Voice: ${voice.name} for ${selectedLang.code}`);
        utterance.voice = voice;
      } else {
        console.warn(`[TTS] No native voice for ${selectedLang.code}. AI text: "${lastTranscript.text.substring(0, 20)}..."`);
      }

      utterance.lang = selectedLang.code;
      utterance.rate = 0.9; // Slightly slower for better pronunciation in diverse languages
      utterance.pitch = 1.0; 

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => {
        setIsAiSpeaking(false);
        setTimeout(() => {
          if (recognition && !isMuted) {
            try { recognition.start(); } catch(e) {}
          }
        }, 500);
      };

      window.speechSynthesis.speak(utterance);
    }
  }, [transcripts, isConnected, isSpeakerOn, recognition, isMuted, selectedLang]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRinging && !isConnected) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-500 font-sans">
      <div className="relative w-full max-w-[340px] bg-[#0a0c10] border border-white/10 rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,0.8)] flex flex-col h-[580px] overflow-hidden">
        
        {/* HUD UI Elements */}
        <div className="absolute top-10 left-8 right-8 flex justify-between items-center opacity-40 z-20">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Neural-Link: 4.2ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Encryption: AES-256</span>
            <Shield className="w-3 h-3 text-safe" />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="p-6 pt-24 text-center relative z-10">
          <div className={clsx(
            "mb-4 flex justify-center scale-75",
            isRinging ? "animate-bounce" : ""
          )}>
            <div className={clsx(
              "w-28 h-28 rounded-[2rem] flex items-center justify-center relative transition-all duration-700",
              activeCall?.priority === 'CRITICAL' ? "bg-critical/20 border-2 border-critical/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]" : "bg-primary/20 border-2 border-primary/40 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
            )}>
              <div className={clsx(
                "absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-40",
                activeCall?.priority === 'CRITICAL' ? "bg-critical animate-pulse" : "bg-primary animate-pulse"
              )}></div>
              <Radio className={clsx("w-12 h-12 relative z-10", activeCall?.priority === 'CRITICAL' ? "text-critical" : "text-primary")} />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-1 flex items-center justify-center gap-3">
            {activeCall?.callerName || 'Tactical HQ'}
          </h2>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] opacity-60">
            {activeCall?.type || 'Emergency Dispatch'} • {activeCall?.location || 'Operational Zone'}
          </p>
          
          {isConnected && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 rounded-full bg-safe/10 border border-safe/20 text-safe text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-safe animate-ping"></span>
                  Link Verified
                </span>
                <span className="text-2xl font-mono text-white font-black tracking-[0.2em]">
                  {formatTime(callTimer)}
                </span>
              </div>
              
              <div className="h-6 flex items-center">
                {isAiSpeaking ? (
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest italic animate-pulse">AI Speaking...</span>
                  </div>
                ) : isListening ? (
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-safe animate-bounce" />
                    <span className="text-[10px] font-black text-safe uppercase tracking-widest italic">Awaiting Response...</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          
          {isRinging && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1 h-4 bg-critical animate-pulse"></div>
                <div className="w-1 h-8 bg-critical animate-pulse delay-75"></div>
                <div className="w-1 h-4 bg-critical animate-pulse delay-150"></div>
              </div>
              <p className="text-critical text-sm font-black animate-pulse uppercase tracking-[0.3em] italic">
                Incoming Emergency Dispatch
              </p>
            </div>
          )}
        </div>

        {/* Live Conversation Stream */}
        <div className="flex-1 px-8 pb-4 overflow-hidden flex flex-col relative z-10">
          <div className={clsx(
            "flex-1 bg-black/60 rounded-[2.5rem] border border-white/5 p-8 overflow-y-auto custom-scrollbar space-y-6 transition-all duration-1000",
            isConnected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 scale-95"
          )}>
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 italic text-center p-4">
                <Waves className="w-12 h-12 mb-4 opacity-20 animate-pulse text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Decrypting Initial Briefing...</p>
              </div>
            ) : (
              transcripts.map((t, i) => (
                <div 
                  key={i} 
                  className={clsx(
                    "p-4 rounded-[1.5rem] text-[11px] font-bold leading-relaxed max-w-[90%] animate-in slide-in-from-bottom-4 duration-500",
                    t.source === 'AI Agent' 
                      ? "bg-primary/10 text-primary border border-primary/20 rounded-tl-none mr-auto shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                      : "bg-white/5 text-slate-300 border border-white/10 rounded-tr-none ml-auto"
                  )}
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30 mb-2 flex items-center gap-2">
                    {t.source === 'AI Agent' ? <Zap className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {t.source}
                  </p>
                  {t.text}
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Real-time Waveform HUD */}
          {isConnected && (
            <div className="h-12 flex items-center justify-center gap-1.5 mt-6 px-8">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i}
                  className={clsx(
                    "w-1 rounded-full transition-all duration-300",
                    isAiSpeaking ? "bg-primary animate-wave shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-safe animate-wave opacity-40"
                  )}
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: isAiSpeaking ? '0.8s' : '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tactical Controls */}
        <div className="p-6 pt-0 pb-10 relative z-10">
          {isRinging ? (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={rejectCall}
                className="group p-4 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex flex-col items-center gap-2 active:scale-95"
              >
                <div className="p-4 rounded-full bg-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform">
                  <PhoneOff className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Reject</span>
              </button>
              
              <button 
                onClick={() => {
                  acceptCall();
                  socket.emit('ACCEPT_CALL', { 
                    callSid: activeCall?.call_sid || activeCall?.id,
                    incidentId: activeCall?.incident_id || activeCall?.id,
                    language: selectedLang.code
                  });
                }}
                className="group p-4 rounded-[1.5rem] bg-safe/10 border border-safe/20 text-safe hover:bg-safe/20 transition-all flex flex-col items-center gap-2 active:scale-95"
              >
                <div className="p-4 rounded-full bg-safe text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-transform animate-pulse">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Establish</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={toggleMute}
                  className={clsx(
                    "p-5 rounded-[1.5rem] border transition-all flex flex-col items-center gap-2",
                    isMuted ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                  )}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Mute</span>
                </button>
                
                <button 
                  onClick={() => setShowLangSelector(!showLangSelector)}
                  className={clsx(
                    "p-5 rounded-[1.5rem] border transition-all flex flex-col items-center gap-2 relative",
                    showLangSelector ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                  )}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">{selectedLang.native}</span>
                  
                  {/* Language Selector Dropup */}
                  {showLangSelector && (
                    <div className="absolute bottom-full left-0 mb-4 w-40 bg-gray-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1 overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLang(lang);
                            setShowLangSelector(false);
                          }}
                          className={clsx(
                            "w-full px-3 py-2 rounded-xl text-left text-[10px] font-bold transition-all",
                            selectedLang.code === lang.code ? "bg-primary text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {lang.native} <span className="opacity-40 text-[8px] ml-1">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </button>
                
                <button className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all flex flex-col items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Stats</span>
                </button>
              </div>
              
              <button 
                onClick={endCall}
                className="w-full py-3.5 rounded-[1.5rem] bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all active:scale-[0.98]"
              >
                <PhoneOff className="w-4 h-4" />
                Terminate Link
              </button>
            </div>
          )}
        </div>

        {/* Home Indicator Overlay */}
        <div className="h-1 w-36 bg-white/10 rounded-full mx-auto mb-2 opacity-30"></div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.3); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CallOverlay;
