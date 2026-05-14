import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, User, Mail, Lock, ChevronRight, Globe, Building2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 animated-grid opacity-20 pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 text-white/20 hover:text-white transition-all group">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Hub</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.3)] mb-8 transition-transform duration-700 hover:rotate-12">
              <Shield className="text-white" size={36} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-3 premium-gradient-text">Request Tactical Uplink</h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-center leading-relaxed font-medium">Initialize Your Mission Commander Profile</p>
          </div>

          <form className="grid md:grid-cols-2 gap-8" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Commander Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  required
                  className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Agency Type</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                <select className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all text-white/40 appearance-none cursor-pointer">
                  <option>National Emergency</option>
                  <option>Regional Rescue</option>
                  <option>Private Agency</option>
                  <option>NGO Response</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Tactical Uplink Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                <input 
                  type="email" 
                  placeholder="commander@rescueiq.ai"
                  required
                  className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Secure Keyphrase</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                <input 
                  type="password" 
                  placeholder="Minimum 12 characters"
                  required
                  className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <button className="md:col-span-2 w-full h-20 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.05)] hover:shadow-cyan-500/30 group mt-4">
              Initialize Tactical Uplink
              <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] text-white/20 font-black uppercase tracking-[0.2em] leading-relaxed">
            Already have tactical clearance? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Commander Login</Link>
          </p>
        </motion.div>
      </div>

      <div className="p-10 flex justify-center opacity-10">
        <span className="text-[10px] font-black uppercase tracking-[0.6em]">System Registration // Protocol-Delta // Node-842</span>
      </div>
    </div>
  );
};

export default Signup;

