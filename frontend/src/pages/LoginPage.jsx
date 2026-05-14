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
  Radio
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Import Assets
import tacticalBg from '../assets/tactical_india_command.png';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Form State
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
    clearError();
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

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      if (mode === 'verify') await signup(fullName, email, password);
      else await forgotPassword(email);
      setResendTimer(60);
    } catch (err) {
      console.error('Resend error:', err);
    }
  };

  const renderBackBtn = () => (
    <button 
      onClick={() => { clearError(); setMode('login'); }}
      className="absolute top-6 left-6 text-slate-500 hover:text-white flex items-center text-[10px] font-black uppercase tracking-widest transition-all group"
    >
      <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
      Return to Base
    </button>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden font-sans">
      
      {/* FULL SCREEN BACKGROUND: Aditya's Tactical Visuals */}
      <div className="absolute inset-0 z-0">
        <img 
          src={tacticalBg} 
          alt="Tactical India Command" 
          className="w-full h-full object-cover opacity-50 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
      </div>

      {/* HOLOGRAPHIC OVERLAYS (From Aditya's Design) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
        {/* Global Threat Level */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-10 right-10 flex flex-col items-end"
        >
          <div className="px-4 py-1 bg-red-600/20 border border-red-500/40 rounded-lg backdrop-blur-xl">
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Global Threat Level: HIGH</span>
          </div>
          <div className="mt-2 px-3 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded-md">
             <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">SYSTEMS OPERATIONAL</span>
          </div>
        </motion.div>

        {/* Tactical Info Left */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-10 left-10 space-y-4"
        >
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-600/10 rounded-lg border border-red-500/20">
               <AlertTriangle className="text-red-500" size={16} />
             </div>
             <div>
               <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">RESCUE<span className="text-red-500">IQ</span></h1>
               <p className="text-[8px] text-white/20 font-bold uppercase tracking-[0.3em]">Command System Layer</p>
             </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
             <Shield size={10} className="text-blue-400" />
             <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">PROTOCOL 12-B ACTIVE</span>
          </div>
        </motion.div>

        {/* Risk Prediction Card (Bottom Left) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-10 p-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl w-48"
        >
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">AI RISK PREDICTION</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin-slow" />
             <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none">72%</span>
                <span className="text-[8px] font-black text-red-500 uppercase">HIGH RISK</span>
             </div>
          </div>
        </motion.div>

        {/* Active Nodes Count (Bottom Right) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 right-10 flex items-center gap-4 text-right"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active Rescue Nodes</span>
            <span className="text-2xl font-black text-white leading-none mt-1">4.2k+</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
             <Globe className="text-white/20" size={20} />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* MAIN AUTH CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12 group"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {mode !== 'login' && renderBackBtn()}

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                  {mode === 'login' && 'System Authorization'}
                  {mode === 'signup' && 'Operator Enlistment'}
                  {mode === 'verify' && 'Signal Verification'}
                  {mode === 'forgot' && 'Identity Recovery'}
                  {mode === 'reset' && 'Security Uplink'}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {mode === 'login' && 'Enter your credentials to access the command center.'}
                  {mode === 'signup' && 'Establish your tactical profile in the network.'}
                  {mode === 'verify' && `Neural code transmitted to ${email}`}
                  {mode === 'forgot' && 'Enter your registered ID for access restoration.'}
                  {mode === 'reset' && 'Configure your new high-security access cipher.'}
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="OPERATOR NAME"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-blue-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'signup' || mode === 'forgot' || mode === 'verify' || mode === 'reset') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="email" 
                        required
                        disabled={mode === 'verify' || mode === 'reset'}
                        placeholder="SECURE_MAIL@OPS.COM"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-blue-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'verify' || mode === 'reset') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Code</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="6-DIGIT CODE"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-blue-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none text-center tracking-[0.5em] font-black"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {mode === 'reset' ? 'New Cipher' : 'Security Cipher'}
                      </label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                        >
                          Forgot Cipher?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={mode === 'reset' ? newPassword : password}
                        onChange={(e) => mode === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-blue-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-slate-600 transition-all outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center gap-2 px-1">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                    <label htmlFor="remember" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stay Authorized</label>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.2em] text-xs">
                        {mode === 'login' && 'Begin Session'}
                        {mode === 'signup' && 'Request Enlistment'}
                        {mode === 'verify' && 'Sync Identity'}
                        {mode === 'forgot' && 'Request Recovery'}
                        {mode === 'reset' && 'Commit Cipher'}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-6 border-t border-white/5">
                {mode === 'login' ? (
                  <p className="text-[11px] text-slate-500 font-medium">
                    New Recruit? {' '}
                    <button 
                      onClick={() => { clearError?.(); setMode('signup'); }}
                      className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-4 uppercase tracking-wider"
                    >
                      Apply for Access
                    </button>
                  </p>
                ) : (
                  mode !== 'verify' && mode !== 'reset' && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      Already Enlisted? {' '}
                      <button 
                        onClick={() => { clearError?.(); setMode('login'); }}
                        className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-4 uppercase tracking-wider"
                      >
                        Return to Command
                      </button>
                    </p>
                  )
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* FOOTER METRICS */}
        <div className="mt-10 flex flex-col items-center space-y-4">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.5em] font-black">
            Authorized Personnel Only • Encryption AES-256
          </p>
          <div className="flex items-center gap-3">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
