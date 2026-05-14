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
  Activity,
  Globe,
  Radio,
  CloudRain
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
      className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center text-[10px] font-black uppercase tracking-widest transition-all group z-50 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5"
    >
      <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
      Abort Access
    </button>
  );

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* FULL SCREEN BACKGROUND: Tactical India Map */}
      <div className="absolute inset-0 z-0">
        <img 
          src={tacticalBg} 
          alt="Tactical Command" 
          className="w-full h-full object-cover opacity-70 mix-blend-screen scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]" />
      </div>

      {/* TACTICAL HUD OVERLAYS (Floating Elements) */}
      <div className="absolute inset-0 pointer-events-none z-1 p-8 hidden lg:block">
        {/* Top Info */}
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600/30 border border-red-500/50 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                 <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">RESCUE<span className="text-red-500">IQ</span></h1>
                 <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.4em] mt-1">Tactical Command System</p>
              </div>
           </div>
           <div className="flex flex-col items-end gap-3">
              <div className="px-6 py-2 bg-red-600/20 border border-red-500/40 rounded-xl backdrop-blur-xl">
                 <span className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">THREAT: HIGH</span>
              </div>
              <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg backdrop-blur-md">
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">SYST: ONLINE</span>
              </div>
           </div>
        </div>

        {/* Cinematic Hero Text (Left) */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 max-w-lg space-y-4">
           <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl">
              Real-time<br/>
              <span className="text-blue-500">Response.</span><br/>
              Life-saving<br/>
              <span className="text-blue-500">Precision.</span>
           </h2>
        </div>

        {/* Bottom HUD Analytics */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
           <div className="flex items-center gap-12">
              <div className="flex flex-col">
                 <span className="text-2xl font-black text-white tracking-tighter italic">4.2k+</span>
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Active Units</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-black text-white tracking-tighter italic">12ms</span>
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Latency Delay</span>
              </div>
              <div className="flex flex-col">
                 <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75 shadow-[0_0_10px_#10b981]" />
                 </div>
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Node Health</span>
              </div>
           </div>
           <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Encryption protocol AES-256 Activated</p>
        </div>
      </div>

      {/* MAIN AUTH TERMINAL (CENTERED & GLASSY) */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel relative overflow-hidden bg-slate-900/40 backdrop-blur-[60px] border border-white/20 rounded-[3rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] p-10 md:p-14"
        >
          {/* Subtle Glow Effect inside terminal */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              {mode !== 'login' && renderBackBtn()}

              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
                  {mode === 'login' && 'Authorization'}
                  {mode === 'signup' && 'Enlistment'}
                  {mode === 'verify' && 'Verification'}
                  {mode === 'forgot' && 'Recovery'}
                  {mode === 'reset' && 'Uplink'}
                </h2>
                <p className="text-xs text-white/40 font-bold tracking-wider uppercase">
                  {mode === 'login' && 'Enter command credentials'}
                  {mode === 'signup' && 'Create operator profile'}
                  {mode === 'verify' && 'Syncing identity signal'}
                  {mode === 'forgot' && 'Restoring neural access'}
                  {mode === 'reset' && 'Commit security cipher'}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-black text-red-500 uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" required placeholder="OPERATOR NAME" value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500/50 rounded-2xl py-4.5 pl-14 pr-5 text-sm text-white placeholder:text-white/10 transition-all outline-none font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Operational Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="email" required disabled={mode === 'verify' || mode === 'reset'}
                      placeholder="SECURE_ID@OPS.COM" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500/50 rounded-2xl py-4.5 pl-14 pr-5 text-sm text-white placeholder:text-white/10 transition-all outline-none disabled:opacity-50 font-bold"
                    />
                  </div>
                </div>

                {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">
                        {mode === 'reset' ? 'New Cipher' : 'Security Cipher'}
                      </label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} required
                        placeholder="••••••••" value={mode === 'reset' ? newPassword : password}
                        onChange={(e) => mode === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500/50 rounded-2xl py-4.5 pl-14 pr-14 text-sm text-white placeholder:text-white/10 transition-all outline-none font-bold"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center gap-3 px-1">
                    <input type="checkbox" id="stay" className="w-5 h-5 rounded bg-white/5 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-[#020617]" />
                    <label htmlFor="stay" className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Stay Authorized</label>
                  </div>
                )}

                <button 
                  type="submit" disabled={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-[2rem] flex items-center justify-center gap-5 transition-all group shadow-2xl shadow-blue-500/20 active:scale-[0.97] disabled:opacity-50 mt-6"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.3em] text-sm">
                        {mode === 'login' && 'Begin Session'}
                        {mode === 'signup' && 'Enlist Now'}
                        {mode === 'verify' && 'Sync Identity'}
                        {mode === 'forgot' && 'Restore Access'}
                        {mode === 'reset' && 'Commit Cipher'}
                      </span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-8 border-t border-white/5">
                <p className="text-xs text-white/20 font-bold uppercase tracking-[0.2em]">
                  {mode === 'login' ? 'New Recruit? ' : 'Already Enlisted? '}
                  <button 
                    onClick={() => { clearError?.(); setMode(mode === 'login' ? 'signup' : 'login'); }}
                    className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-8"
                  >
                    {mode === 'login' ? 'Apply for Access' : 'Return to Hub'}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
