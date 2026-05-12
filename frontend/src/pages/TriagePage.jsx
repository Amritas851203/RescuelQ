import React from 'react';
import TriageQueue from '../components/TriageQueue';

const TriagePage = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight neon-text text-white">Advanced Triage Control</h2>
        <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-white/5">
          Priority Protocol: AI-Alpha-9
        </div>
      </div>
      
      <div className="flex-1 glass-panel p-6 overflow-hidden">
        <TriageQueue />
      </div>
    </div>
  );
};

export default TriagePage;
