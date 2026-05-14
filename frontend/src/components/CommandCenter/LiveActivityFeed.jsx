import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

const LiveActivityFeed = ({ logs }) => {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[200px] shadow-2xl">
      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyan-400" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest font-mono">Live Operations Feed</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-cyan-500/50 animate-pulse delay-75" />
          <div className="w-1 h-1 rounded-full bg-cyan-500/20 animate-pulse delay-150" />
        </div>
      </div>
      
      <div 
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1 no-scrollbar scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 group"
            >
              <span className="text-white/30 whitespace-nowrap">[{log.time}]</span>
              <ChevronRight size={10} className="mt-0.5 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className={`${
                log.type === 'alert' ? 'text-red-400' : 
                log.type === 'success' ? 'text-emerald-400' : 
                log.type === 'dispatch' ? 'text-cyan-400' : 
                'text-white/70'
              }`}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/10 uppercase tracking-tighter">
            Waiting for operational data...
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivityFeed;
