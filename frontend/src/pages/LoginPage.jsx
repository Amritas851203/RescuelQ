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
  Timer
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Import Assets
import loginBg from '../assets/login_map.png';

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
      {/* BACKGROUND: Tactical Intelligence Map */}
      <div className="absolute inset-0 z-0">
        <img 
          src={loginBg} 
          alt="Tactical Grid" 
          className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
        
        {/* Animated Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-primary/20 shadow-[0_0_15px_rgba(37,99,235,0.3)] z-1"
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* TOP BRANDING */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="p-4 bg-critical/10 rounded-[2rem] border border-critical/20 backdrop-blur-2xl mb-6 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <AlertTriangle className="w-10 h-10 text-critical" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
            RESCUE<span className="text-critical">IQ</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">Tactical Intelligence Layer v4.0</p>
          </div>
        </motion.div>

        {/* MAIN AUTH CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel relative overflow-hidden bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12 group"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all" />
          
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
                  {mode === 'login' && 'Provide secure credentials for command access.'}
                  {mode === 'signup' && 'Establish your tactical profile in the network.'}
                  {mode === 'verify' && `Neural code transmitted to ${email}`}
                  {mode === 'forgot' && 'Enter your ID for access restoration.'}
                  {mode === 'reset' && 'Configure your new high-security cipher.'}
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-critical/10 border border-critical/20 rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-critical shrink-0" />
                  <p className="text-[11px] font-bold text-critical uppercase tracking-wider">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="OPERATOR NAME"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'signup' || mode === 'forgot' || mode === 'verify' || mode === 'reset') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="email" 
                        required
                        disabled={mode === 'verify' || mode === 'reset'}
                        placeholder="SECURE_MAIL@OPS.COM"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'verify' || mode === 'reset') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Code</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="6-DIGIT CODE"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none text-center tracking-[0.5em] font-black"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {mode === 'reset' ? 'New Password' : 'Password'}
                      </label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[10px] font-black text-primary hover:text-primary/70 uppercase tracking-widest transition-colors"
                        >
                          Access Lost?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={mode === 'reset' ? newPassword : password}
                        onChange={(e) => mode === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-slate-600 transition-all outline-none"
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

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary hover:bg-primary/80 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.2em] text-xs">
                        {mode === 'login' && 'Initialize Session'}
                        {mode === 'signup' && 'Finalize Enlistment'}
                        {mode === 'verify' && 'Sync Identity'}
                        {mode === 'forgot' && 'Request Uplink'}
                        {mode === 'reset' && 'Commit Cipher'}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {(mode === 'verify' || mode === 'reset') && (
                <div className="text-center">
                  <button 
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all disabled:opacity-30"
                  >
                    {resendTimer > 0 ? (
                      <div className="flex items-center gap-2">
                        <Timer size={12} />
                        Re-transmission in {resendTimer}s
                      </div>
                    ) : 'Request Signal Re-transmission'}
                  </button>
                </div>
              )}

              <div className="text-center pt-6 border-t border-white/5">
                {mode === 'login' ? (
                  <p className="text-[11px] text-slate-500 font-medium">
                    New Operator? {' '}
                    <button 
                      onClick={() => { clearError(); setMode('signup'); }}
                      className="font-black text-white hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4 uppercase tracking-wider"
                    >
                      Apply for Access
                    </button>
                  </p>
                ) : (
                  mode !== 'verify' && mode !== 'reset' && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      Already Enlisted? {' '}
                      <button 
                        onClick={() => { clearError(); setMode('login'); }}
                        className="font-black text-white hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4 uppercase tracking-wider"
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
            Authorized Access Only • Protocol AES-256 Activated
          </p>
          <div className="flex items-center gap-3">
             <div className="w-1 h-1 rounded-full bg-safe animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             <div className="w-1 h-1 rounded-full bg-safe animate-pulse delay-75 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
             <div className="w-1 h-1 rounded-full bg-safe animate-pulse delay-150 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
