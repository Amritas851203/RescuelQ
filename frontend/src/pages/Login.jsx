import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Lock, ChevronRight, Globe, Terminal } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
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
          className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Terminal size={64} />
          </div>

          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.3)] mb-8 group transition-transform duration-700 hover:rotate-12">
              <Shield className="text-white" size={36} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-3 premium-gradient-text">Commander</h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">Enter Secure Tactical Credentials</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Uplink ID</label>
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

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Security Key</label>
                <a href="#" className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400/60 hover:text-cyan-400 transition-colors">Key Recovery</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  required
                  className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <button className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-cyan-500/30 group">
              Initialize Access
              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-12 flex items-center gap-6">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-white/10 font-black uppercase tracking-[0.4em]">External Node</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="mt-10">
            <button className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-4 text-white/40 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-500">
              <Globe size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Login with GitHub</span>
            </button>
          </div>

          <p className="mt-12 text-center text-[10px] text-white/20 font-black uppercase tracking-[0.2em] leading-relaxed">
            Unauthorized access is strictly prohibited. <br />
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">Request Tactical Uplink</Link>
          </p>
        </motion.div>
      </div>

      <div className="p-10 flex justify-center opacity-10">
        <span className="text-[10px] font-black uppercase tracking-[0.6em]">Secure Terminal // Node-842 // V.4.0.2</span>
      </div>
    </div>
  );
};

export default Login;

