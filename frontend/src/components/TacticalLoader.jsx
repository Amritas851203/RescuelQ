import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Loader2, Shield, Activity, Zap, Terminal } from 'lucide-react';

const TacticalLoader = ({ isDone }) => {
  const [bootSequence, setBootSequence] = useState([]);
  const [progress, setProgress] = useState(0);

  const steps = [
    'INITIATING NEURAL LINK...',
    'ESTABLISHING SATELLITE UPLINK [SAT-4]...',
    'SYNCHRONIZING TACTICAL TELEMETRY...',
    'DECRYPTING OPERATIONAL PROTOCOLS...',
    'AI CORE ONLINE // READY FOR DISPATCH'
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setBootSequence(prev => [...prev, steps[currentStep]]);
        setProgress((currentStep + 1) * (100 / steps.length));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: 'circOut' }}
          className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center overflow-hidden"
        >
          {/* Tactical Grid Background */}
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="relative flex flex-col items-center">
            {/* Central AI Core */}
            <div className="relative mb-12">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: 360 
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 10, repeat: Infinity, ease: 'linear' }
                }}
                className="w-32 h-32 rounded-full border-2 border-cyan-500/20 flex items-center justify-center relative"
              >
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/10 animate-ping" />
                <BrainCircuit className="text-cyan-400" size={48} />
              </motion.div>
              
              {/* Radar Sweeps */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-40px] border border-cyan-500/5 rounded-full pointer-events-none"
                style={{ background: 'conic-gradient(from 0deg, rgba(6,182,212,0.1), transparent 90deg)' }}
              />
            </div>

            {/* Boot Messages */}
            <div className="h-24 w-80 mb-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] z-10" />
              <div className="space-y-1 flex flex-col items-center">
                <AnimatePresence>
                  {bootSequence.map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest"
                    >
                      <Terminal size={10} />
                      {text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-64 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">System Sync</span>
                <span className="text-xs font-mono text-cyan-400">{Math.floor(progress)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tactical Decals */}
            <div className="absolute bottom-[-100px] flex gap-12 opacity-20">
               <div className="flex flex-col items-center gap-1">
                 <Shield size={16} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">Sec-Protocol</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <Activity size={16} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">Bio-Metric</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <Zap size={16} />
                 <span className="text-[8px] font-bold tracking-widest uppercase">AI-Uplink</span>
               </div>
            </div>
          </div>

          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TacticalLoader;
