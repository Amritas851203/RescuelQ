import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Maximize2, 
  Minimize2,
  Terminal,
  ShieldAlert,
  Mic,
  Paperclip,
  Upload,
  Globe,
  Zap,
  Activity,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  FileText,
  Image as ImageIcon,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const QUICK_ACTIONS = [
  { id: 'shelters', label: 'Show nearest shelters', icon: Globe },
  { id: 'deploy', label: 'Deploy rescue team', icon: Zap },
  { id: 'summary', label: 'Summarize live incidents', icon: Activity },
  { id: 'weather', label: 'Check weather alerts', icon: Globe },
  { id: 'sop', label: 'Emergency SOP guide', icon: FileText },
  { id: 'threat', label: 'Analyze threat level', icon: ShieldAlert },
  { id: 'units', label: 'Locate active units', icon: Terminal },
];

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Live systems operational. Awaiting tactical instruction.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isNeuralSyncing, setIsNeuralSyncing] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          alert(`Tactical Audio Error: ${event.error}. Please check microphone permissions.`);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Tactical audio protocols not supported by this browser interface. Try using Chrome or Edge.");
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (err) {
      console.error("Speech Recognition Toggle Error:", err);
      setIsListening(false);
    }
  };

  // Simulate initial neural sync
  useEffect(() => {
    const timer = setTimeout(() => setIsNeuralSyncing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textOverride) => {
    const text = textOverride || input;
    if (!text.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: text.trim(),
      files: attachedFiles.map(f => f.name),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFiles([]);
    setLoading(true);
    setIsVoiceMode(false);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        prompt: text.trim(),
        history: history
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('rescueiq_token')}`
        }
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "TRANSMISSION ERROR: AI Uplink disrupted. Please check system logs or API configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  return (
    <div className="fixed bottom-[28px] right-[28px] z-[9999] font-sans antialiased perspective-2000 pointer-events-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1, translateZ: 30 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 md:w-16 md:h-16 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(37,99,235,0.4)] relative group overflow-hidden border border-white/20 pointer-events-auto preserve-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Bot size={28} className="group-hover:rotate-[12deg] transition-transform duration-500" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#020617] rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className={clsx(
              "glass-3d-panel rounded-[2.5rem] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto origin-bottom-right shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)]",
              isMinimized 
                ? 'h-20 w-80' 
                : 'h-[calc(100vh-100px)] w-[420px] max-w-[95vw] md:w-[420px] sm:w-[95vw]'
            )}
            style={{ maxHeight: isMinimized ? '80px' : '880px' }}
          >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-500 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
              <div className="absolute inset-0 tactical-grid opacity-10" />
            </div>

            {/* --- HEADER SECTION --- */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0 relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Bot size={24} className="text-blue-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0f1e] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white tracking-widest uppercase text-glow-blue">RescueIQ Assistant</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-blue-400/80 font-black uppercase tracking-[0.2em]">
                      {isNeuralSyncing ? 'NEURAL SYNCING...' : 'TACTICAL STATUS: ONLINE'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-all active:scale-90"
                  title="Toggle Audio"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-all active:scale-90"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-slate-400 transition-all active:scale-90"
                  title="Close Uplink"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* --- CHAT CONTENT AREA --- */}
                <div 
                  className={clsx(
                    "flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8 custom-scrollbar relative z-10 transition-opacity duration-300",
                    isDragging ? "opacity-30 scale-[0.98]" : "opacity-100"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                >
                  <AnimatePresence>
                    {isVoiceMode ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="h-full flex flex-col items-center justify-center space-y-8 py-6"
                      >
                        <div className="text-center space-y-2">
                          <h2 className="text-xl font-black text-white tracking-tighter text-glow-blue uppercase">Voice Commander</h2>
                          <p className="text-[9px] text-blue-400/60 uppercase tracking-[0.3em] font-black">Awaiting Tactical Input</p>
                        </div>

                        <div className="relative">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-8 bg-blue-500/10 rounded-full blur-2xl"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleListening}
                            className={clsx(
                              "w-28 h-28 rounded-full flex items-center justify-center border-4 border-white/10 relative z-10 group preserve-3d transition-all duration-500",
                              isListening 
                                ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_60px_rgba(37,99,235,0.6)] scale-110" 
                                : "bg-gradient-to-br from-blue-600/50 to-blue-800/50 shadow-[0_0_40px_rgba(37,99,235,0.2)]"
                            )}
                          >
                            <Mic 
                              size={40} 
                              className={clsx(
                                "text-white transition-all duration-500",
                                isListening ? "scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" : "opacity-60"
                              )} 
                            />
                            {/* Radar Rings */}
                            {isListening && (
                              <>
                                <div className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping" />
                                <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping [animation-delay:0.5s]" />
                              </>
                            )}
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-1.5 h-12">
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={isListening ? { height: [8, Math.random() * 32 + 8, 8] } : { height: 8 }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.04 }}
                              className={clsx(
                                "w-1 rounded-full transition-colors duration-500",
                                isListening ? "bg-gradient-to-t from-blue-600 to-blue-400" : "bg-blue-400/20"
                              )}
                            />
                          ))}
                        </div>

                        <button 
                          onClick={() => setIsVoiceMode(false)}
                          className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all holographic-border"
                        >
                          Cancel Voice Input
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        {messages.map((msg, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: msg.role === 'assistant' ? -20 : 20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            className={clsx("flex w-full", msg.role === 'assistant' ? 'justify-start' : 'justify-end')}
                          >
                            <div className={clsx(
                              "flex gap-4 max-w-[88%]",
                              msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                            )}>
                              <div className={clsx(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 hover:scale-110 preserve-3d",
                                msg.role === 'assistant' 
                                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                                  : 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                              )}>
                                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                              </div>
                              <div className="space-y-2">
                                <div className={clsx(
                                  "p-5 rounded-[1.75rem] text-sm leading-[1.7] relative overflow-hidden break-words",
                                  msg.role === 'assistant' 
                                    ? 'bg-white/[0.03] text-slate-200 border border-white/10 rounded-tl-none backdrop-blur-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' 
                                    : 'bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-tr-none shadow-[0_15px_30px_rgba(37,99,235,0.3)] border border-white/10'
                                )}>
                                  {msg.role === 'assistant' && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 blur-[2px]" />
                                  )}
                                  {msg.isGreeting && <span className="mr-2">👋</span>}
                                  {msg.content}
                                  {msg.files && msg.files.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                                      {msg.files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold">
                                          <FileText size={12} className="text-blue-400" />
                                          {file}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className={clsx(
                                  "text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-2",
                                  msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                                )}>
                                  {msg.timestamp}
                                  {msg.role === 'user' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Quick Action Chips */}
                        {messages.length === 1 && (
                          <div className="flex flex-wrap gap-2.5 pt-4">
                            {QUICK_ACTIONS.map((action) => (
                              <motion.button
                                key={action.id}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSend(action.label)}
                                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2.5 transition-all holographic-border"
                              >
                                <action.icon size={14} className="text-blue-400" />
                                {action.label}
                              </motion.button>
                            ))}
                          </div>
                        )}
                        
                        {loading && (
                          <div className="flex justify-start">
                            <div className="flex gap-4">
                              <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                                <Loader2 size={20} className="animate-spin" />
                              </div>
                              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-[1.75rem] rounded-tl-none flex gap-2 items-center backdrop-blur-xl">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* --- DRAG OVERLAY --- */}
                <AnimatePresence>
                  {isDragging && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-x-8 top-32 bottom-32 border-2 border-dashed border-blue-500/40 bg-blue-500/10 rounded-[2.5rem] flex flex-col items-center justify-center pointer-events-none z-20 backdrop-blur-sm"
                    >
                      <div className="p-8 bg-blue-600 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.5)] mb-6 animate-bounce">
                        <Upload size={40} className="text-white" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] text-glow-blue">Drop Tactical Assets</h3>
                      <p className="text-[10px] text-blue-400 mt-3 font-black uppercase tracking-[0.3em] text-center px-12 leading-relaxed">
                        Upload Intelligence, Reports,<br/>or Operational Imagery
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* --- FOOTER INPUT AREA --- */}
                <div className="p-6 shrink-0 space-y-5 relative z-10 bg-white/[0.02] border-t border-white/5 backdrop-blur-xl">
                  {/* Intelligence Upload Card */}
                  {messages.length < 5 && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer p-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.08] hover:border-blue-500/30 transition-all shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                          <Upload size={20} className="text-slate-400 group-hover:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Upload intelligence files</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1 group-hover:text-slate-400">Documents, Images, PDFs</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-blue-600/20">
                        <ChevronUp size={14} className="text-slate-500 group-hover:text-blue-400" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        onChange={handleFileChange} 
                      />
                    </motion.div>
                  )}

                  {/* Attached Files Preview */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-2">
                      {attachedFiles.map((file, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest"
                        >
                          <FileText size={12} />
                          <span className="max-w-[100px] truncate">{file.name}</span>
                          <button 
                            onClick={() => removeFile(i)}
                            className="ml-1 p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all"
                          >
                            <X size={10} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-4">
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Terminal size={16} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ASK RESCUEIQ AI..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 pl-14 pr-16 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-white text-xs font-bold tracking-wider placeholder:text-slate-600 placeholder:font-black placeholder:uppercase"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                          <Paperclip size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsVoiceMode(true);
                            toggleListening();
                          }}
                          className={clsx(
                            "p-2.5 rounded-full transition-all duration-300",
                            isListening ? "text-blue-400 bg-blue-500/20 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
                          )}
                        >
                          <Mic size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="w-16 h-16 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-600 text-white rounded-[1.5rem] transition-all shadow-[0_15px_30px_rgba(37,99,235,0.3)] flex items-center justify-center shrink-0 group active:scale-90 glow-blue-strong preserve-3d"
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                      )}
                    </button>
                  </form>
                  
                  <div className="flex items-center justify-center gap-3 opacity-40 select-none pb-2">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-blue-500" />
                    <ShieldAlert size={12} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-glow-blue">RescueIQ AI • Tactical Hub v2.1.0-β</span>
                    <div className="w-8 h-px bg-gradient-to-l from-transparent to-blue-500" />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatBot;
