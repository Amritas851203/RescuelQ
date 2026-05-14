import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Ambulance, Ship, Navigation, Clock, MapPin, Gauge } from 'lucide-react';

const FleetOverview = ({ teams, missions }) => {
  return (
    <div className="bg-gray-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 h-full flex flex-col shadow-2xl">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <Navigation className="text-cyan-400" size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Fleet Intelligence</h3>
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em]">Live Asset Overview</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {teams.map(team => {
          const activeMission = missions.find(m => m.teamId === team.id);
          const statusColor = team.status === 'AVAILABLE' ? 'emerald' : team.status === 'RESCUING' ? 'purple' : 'cyan';
          
          return (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Progress Bar for Active Mission */}
              {activeMission && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-500/50 overflow-hidden" style={{ width: '100%' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeMission.progress * 100}%` }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl bg-${statusColor}-500/10 border border-${statusColor}-500/20`}>
                    {team.type === 'ambulance' ? <Ambulance size={16} className={`text-${statusColor}-400`} /> :
                     team.type === 'fire_truck' ? <Truck size={16} className={`text-${statusColor}-400`} /> :
                     team.type === 'rescue_boat' ? <Ship size={16} className={`text-${statusColor}-400`} /> :
                     <Navigation size={16} className={`text-${statusColor}-400 rotate-45`} />}
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-white uppercase tracking-tighter">{team.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${statusColor}-500 animate-pulse`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest text-${statusColor}-400`}>{team.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-white font-black">{Math.floor(team.fuel)}%</div>
                  <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Fuel</div>
                </div>
              </div>

              {activeMission ? (
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-white/20" />
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest truncate">Target: {activeMission.sosId}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Clock size={12} className="text-cyan-400" />
                    <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest">{activeMission.eta || 'Calculating...'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 opacity-30">
                  <Gauge size={12} className="text-white/40" />
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Unit Idle // Base Ops</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Active Fleet</span>
          <span className="text-lg font-black text-white leading-none">{teams.length} UNITS</span>
        </div>
        <div className="flex -space-x-2">
          {teams.slice(0, 3).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-950 bg-white/5 flex items-center justify-center">
              <Navigation size={12} className="text-cyan-400 opacity-40 rotate-45" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;
