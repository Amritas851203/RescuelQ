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
  Eye, 
  EyeOff,
  ChevronLeft,
  Globe,
  Terminal,
  Activity
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); 
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
    clearError?.();
  }, [mode]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (mode === 'login') {
        await login(cleanEmail, cleanPassword);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await signup(fullName, cleanEmail, cleanPassword);
        setMode('verify');
        setResendTimer(60);
      } else if (mode === 'verify') {
        await verifyOtp(cleanEmail, otp);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        await forgotPassword(cleanEmail);
        setMode('reset');
        setResendTimer(60);
      } else if (mode === 'reset') {
        await resetPassword(cleanEmail, otp, newPassword);
        setMode('login');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const renderBackBtn = () => (
    <button 
      onClick={() => setMode('login')}
      className="flex items-center text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-6 group"
    >
      <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" /> 
      Return to Selection
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center selection:bg-blue-500/30 overflow-hidden font-sans">
      {/* CINEMATIC BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/src/assets/command_center_cinematic_bg.png" 
          alt="Grounded Command Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] grid lg:grid-cols-12 gap-0 h-screen lg:h-auto lg:p-8">
        
        {/* LEFT SIDE: ARCHITECTURAL ATMOSPHERE */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-12">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl">
                <AlertTriangle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
                  Rescue<span className="text-blue-500">IQ</span>
                </h1>
                <p className="text-[9px] text-slate-500 font-bold tracking-[0.4em] uppercase">Tactical Intelligence Hub</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-full backdrop-blur-2xl">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.2em]">System Status: Operational</span>
              </div>
              
              <h2 className="text-6xl font-bold text-white leading-[1.05] tracking-tight">
                Grounded intelligence.<br />
                <span className="text-slate-500 font-medium">Professional coordination.</span>
              </h2>
              
              <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed border-l-2 border-blue-500/20 pl-6 py-2">
                Join the global standard for emergency response. High-fidelity data visualization for decisive field operations.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-12 relative z-10">
             <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Units</p>
                <p className="text-3xl font-bold text-white">4,281</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Feed</p>
                <div className="flex items-center space-x-2">
                  <Activity size={14} className="text-blue-500" />
                  <p className="text-3xl font-bold text-white">Stable</p>
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Encryption</p>
                <p className="text-3xl font-bold text-white">AES-256</p>
             </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH PANEL */}
        <div className="col-span-full lg:col-span-5 flex items-center justify-center p-6 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[440px]"
          >
            {/* Minimalist Return Hub */}
            <button 
              onClick={() => navigate('/')}
              className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group"
            >
              <ChevronLeft size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white">Exit to Main Console</span>
            </button>

            <div className="bg-[#0f172a]/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
              {/* Subtle architectural highlight */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {mode !== 'login' && mode !== 'signup' && renderBackBtn()}
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                      {mode === 'login' && 'System Authorization'}
                      {mode === 'signup' && 'Operator Enlistment'}
                      {mode === 'verify' && 'Identity Verification'}
                      {mode === 'forgot' && 'Access Recovery'}
                      {mode === 'reset' && 'Security Reset'}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {mode === 'login' && 'Enter operational credentials for hub access.'}
                      {mode === 'signup' && 'Create your professional responder profile.'}
                      {mode === 'verify' && 'Authentication code transmitted to your terminal.'}
                      {mode === 'forgot' && 'Provide registered email for recovery protocols.'}
                      {mode === 'reset' && 'Define your new high-security access cipher.'}
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center animate-shake">
                      <AlertCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                      {mode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                              type="text"
                              required
                              placeholder="John Doe"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-white text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Operational Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                              type="email"
                              required
                              placeholder="operator@rescue.iq"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-white text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {(mode === 'login' || mode === 'signup') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Security Cipher</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-white text-sm"
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
                        <div className="flex items-center justify-between px-1">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-0" />
                            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-widest">Keep Active</span>
                          </label>
                          <button 
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
                          >
                            Reset Access
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-blue-500/10"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>
                            {mode === 'login' && 'Authorize Session'}
                            {mode === 'signup' && 'Request Enlistment'}
                            {mode === 'verify' && 'Complete Verification'}
                            {mode === 'forgot' && 'Transmit Recovery'}
                            {mode === 'reset' && 'Commit Security'}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-4 space-y-4">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {mode === 'login' ? (
                          <>New Operative? <button type="button" onClick={() => setMode('signup')} className="text-white hover:text-blue-400 transition-colors ml-1 border-b border-white/20">Apply Here</button></>
                        ) : (
                          <>Already Registered? <button type="button" onClick={() => setMode('login')} className="text-white hover:text-blue-400 transition-colors ml-1 border-b border-white/20">Login to Hub</button></>
                        )}
                      </p>

                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => login('amritasingh38381@gmail.com', 'rescueiq').then(() => navigate('/dashboard'))}
                          className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                        >
                          Fast Developer Access
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 text-center space-y-4">
               <div className="flex items-center justify-center space-x-6 opacity-30">
                  <Globe size={14} className="text-slate-500" />
                  <Shield size={14} className="text-slate-500" />
                  <Terminal size={14} className="text-slate-500" />
               </div>
               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em]">
                 SECURE ARCHITECTURAL NODE • ISO-27001 COMPLIANT
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
