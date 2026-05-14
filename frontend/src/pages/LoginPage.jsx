import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  User, 
  Shield, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  ChevronLeft,
  Timer,
  Activity,
  Globe,
  Radio,
  CloudRain,
  Zap,
  Wind
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Import Assets
import tacticalBg from '../assets/tactical_india_command.png';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { login, signup, verifyOtp, forgotPassword, resetPassword, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError?.();
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await signup(fullName, email, password);
        setMode('verify');
        setResendTimer(60);
      } else if (mode === 'verify') {
        await verifyOtp(email, otp);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setMode('reset');
        setResendTimer(60);
      } else if (mode === 'reset') {
        await resetPassword(email, otp, newPassword);
        setMode('login');
        alert('Password reset successful! Please login.');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const renderBackBtn = () => (
    <button 
      onClick={() => { clearError?.(); setMode('login'); }}
      className="absolute top-4 left-4 text-slate-500 hover:text-white flex items-center text-[9px] font-black uppercase tracking-widest transition-all group z-50"
    >
      <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" /> 
      Abort Access
    </button>
  );

  return (
    <div className="relative h-screen w-full flex bg-[#020617] overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* LEFT SECTION: TACTICAL HERO (55% Width) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden border-r border-white/5">
        {/* Background Image - Optimized Scaling */}
        <img 
          src={tacticalBg} 
          alt="Tactical Command" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/40 via-transparent to-[#020617]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />

        {/* TACTICAL HUD ELEMENTS */}
        <div className="relative z-10 w-full h-full p-10 flex flex-col justify-between">
           
           {/* Top Info */}
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-red-600/30 border border-red-500/50 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="text-red-500" size={20} />
                 </div>
                 <div>
                    <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">RESCUE<span className="text-red-500">IQ</span></h1>
                    <p className="text-[8px] text-white/50 font-bold uppercase tracking-[0.4em] mt-1">Tactical Command Hub</p>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="px-4 py-1 bg-red-600/20 border border-red-500/30 rounded-lg backdrop-blur-xl">
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">THREAT: HIGH</span>
                 </div>
                 <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md backdrop-blur-md">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic">SYST: ONLINE</span>
                 </div>
              </div>
           </div>

           {/* Cinematic Text Overlay */}
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-md mb-2">
                 <Shield size={10} className="text-blue-400" />
                 <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Protocol 12-B Active</span>
              </div>
              <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl">
                 Real-time<br/>
                 <span className="text-blue-500">Response.</span><br/>
                 Life-saving<br/>
                 <span className="text-blue-500">Precision.</span>
              </h2>
           </div>

           {/* Bottom Stats Grid */}
           <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
              <div className="flex flex-col">
                 <span className="text-xl font-black text-white tracking-tighter italic">4.2k+</span>
                 <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Active Units</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-xl font-black text-white tracking-tighter italic">12ms</span>
                 <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Net Latency</span>
              </div>
              <div className="flex flex-col">
                 <div className="flex gap-1 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75" />
                 </div>
                 <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Node Health</span>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT SECTION: COMPACT AUTH TERMINAL (45% Width) */}
      <div className="w-full lg:w-[45%] h-full flex flex-col items-center justify-center p-8 md:p-12 relative">
        {/* Subtle Background Pattern for Right Side */}
        <div className="absolute inset-0 bg-[#0a0f1c] pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel relative overflow-hidden bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] p-8 md:p-10"
          >
            {/* Internal Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={mode}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {mode !== 'login' && renderBackBtn()}

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">
                    {mode === 'login' && 'Authorization'}
                    {mode === 'signup' && 'Enlistment'}
                    {mode === 'verify' && 'Verification'}
                    {mode === 'forgot' && 'Recovery'}
                    {mode === 'reset' && 'Uplink'}
                  </h2>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    {mode === 'login' && 'Enter credentials for command access.'}
                    {mode === 'signup' && 'Establish your official network ID.'}
                    {mode === 'verify' && `Neural code sent to grid.`}
                    {mode === 'forgot' && 'Provide access restoration ID.'}
                    {mode === 'reset' && 'Commit new security cipher.'}
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text" required placeholder="OPERATOR NAME" value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/40 rounded-xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-white/10 transition-all outline-none font-bold"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Operational Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="email" required disabled={mode === 'verify' || mode === 'reset'}
                        placeholder="SECURE_ID@OPS.COM" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/40 rounded-xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-white/10 transition-all outline-none disabled:opacity-50 font-bold"
                      />
                    </div>
                  </div>

                  {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                          {mode === 'reset' ? 'New Cipher' : 'Security Cipher'}
                        </label>
                        {mode === 'login' && (
                          <button type="button" onClick={() => setMode('forgot')} className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot?</button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} required
                          placeholder="••••••••" value={mode === 'reset' ? newPassword : password}
                          onChange={(e) => mode === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/40 rounded-xl py-3.5 pl-12 pr-12 text-xs text-white placeholder:text-white/10 transition-all outline-none font-bold"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === 'login' && (
                    <div className="flex items-center gap-2 px-1">
                      <input type="checkbox" id="stay" className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500" />
                      <label htmlFor="stay" className="text-[9px] font-black text-white/20 uppercase tracking-widest">Stay Authorized</label>
                    </div>
                  )}

                  <button 
                    type="submit" disabled={loading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-3 transition-all group shadow-xl shadow-blue-500/20 active:scale-[0.98] mt-4"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="uppercase tracking-[0.2em] text-[10px]">
                          {mode === 'login' && 'Begin Session'}
                          {mode === 'signup' && 'Enlist Now'}
                          {mode === 'verify' && 'Sync ID'}
                          {mode === 'forgot' && 'Restore Access'}
                          {mode === 'reset' && 'Commit Cipher'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-6 border-t border-white/5">
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    {mode === 'login' ? 'New Recruit? ' : 'Already Enlisted? '}
                    <button 
                      onClick={() => { clearError?.(); setMode(mode === 'login' ? 'signup' : 'login'); }}
                      className="text-white hover:text-blue-500 transition-colors underline underline-offset-4 decoration-blue-500/30"
                    >
                      {mode === 'login' ? 'Apply for Access' : 'Return to Hub'}
                    </button>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <p className="mt-8 text-center text-[8px] font-black text-white/10 uppercase tracking-[0.6em]">
            Auth Protocol AES-256 Activated
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
