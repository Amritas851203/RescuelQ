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
      className="absolute top-6 left-6 text-slate-500 hover:text-white flex items-center text-[10px] font-black uppercase tracking-widest transition-all group z-50"
    >
      <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
      Abort Authorization
    </button>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden font-sans p-6 md:p-12">
      
      {/* FULL SCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img 
          src={tacticalBg} 
          alt="Tactical Command" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]" />
      </div>

      {/* TACTICAL HUD OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-1 p-8 hidden xl:block">
        
        {/* Top Bar Stats */}
        <div className="flex justify-between items-start">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-2xl backdrop-blur-md">
                    <AlertTriangle className="text-red-500" size={24} />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">RESCUE<span className="text-red-500">IQ</span></h1>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em] mt-1">Tactical Command System</p>
                 </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md">
                 <Shield size={12} className="text-blue-400" />
                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">PROTOCOL 12-B ACTIVE</span>
              </div>
           </div>

           <div className="flex flex-col items-end gap-3">
              <div className="px-6 py-2 bg-red-600/10 border border-red-500/30 rounded-xl backdrop-blur-md">
                 <span className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">GLOBAL THREAT LEVEL: HIGH</span>
              </div>
              <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg backdrop-blur-md">
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SYSTEMS OPERATIONAL</span>
              </div>
           </div>
        </div>

        {/* Left Side Panels */}
        <div className="absolute top-48 left-8 w-64 space-y-6">
           <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-xl">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Live Incidents</h4>
              <div className="space-y-3">
                 {['#4521 - DELHI - CONTAINED', '#4522 - MUMBAI - ACTIVE', '#4523 - CHENNAI - ALERT'].map((inc, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-[9px] font-bold text-white/60 tracking-wider font-mono">{inc.split(' - ')[0]}</span>
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded ${inc.includes('ACTIVE') ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {inc.split(' - ')[2]}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Weather</h4>
                 <CloudRain size={14} className="text-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-2xl font-black text-white">24°C</div>
                 <div className="text-[9px] text-white/40 uppercase font-bold leading-tight">Heavy Rain<br/>Sector-14</div>
              </div>
           </div>
        </div>

        {/* Cinematic Text (Center Left) */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 max-w-lg space-y-4">
           <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Real-time<br/>
              <span className="text-blue-500">Response.</span><br/>
              Life-saving<br/>
              <span className="text-blue-500">Precision.</span>
           </h2>
           <p className="text-sm text-white/40 font-medium leading-relaxed max-w-sm">
              Join the global network of first responders utilizing AI-driven triage and tactical coordination.
           </p>
        </div>

        {/* Right Side Panels */}
        <div className="absolute top-48 right-8 w-64 space-y-6">
           <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-xl">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Active Rescue Units</h4>
              <div className="space-y-4">
                 {[
                   { name: 'ALPHA-7', status: 'DEPLOYED', color: 'red' },
                   { name: 'BRAVO-3', status: 'ON ROUTE', color: 'blue' },
                   { name: 'CHARLIE-9', status: 'STANDBY', color: 'emerald' }
                 ].map((unit, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <div className="flex justify-between text-[10px] font-black text-white">
                          <span>UNIT {unit.name}</span>
                          <span className={`text-${unit.color}-500`}>{unit.status}</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-${unit.color}-500 w-[70%] opacity-50`} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-xl">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">AI Risk Prediction</h4>
              <div className="flex items-center gap-6">
                 <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset="40" className="text-red-500" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">72%</div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-red-500 uppercase">HIGH RISK</span>
                    <span className="text-[8px] font-bold text-white/30 uppercase leading-tight tracking-widest">Sector Alert<br/>Critical</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Metrics */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">System Status</span>
                 <div className="flex gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75 shadow-[0_0_8px_#10b981]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150 shadow-[0_0_8px_#10b981]" />
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Authorized Units</span>
                 <span className="text-xl font-black text-white leading-none mt-1 italic">4.2k+</span>
              </div>
           </div>
           <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Encryption Protocol AES-256 Activated</p>
        </div>
      </div>

      {/* MAIN AUTH MODAL (CENTERED) */}
      <div className="relative z-10 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel relative overflow-hidden bg-[#0a0f1c]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-8 md:p-14"
        >
          {/* Internal Glow */}
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

              <div className="space-y-3">
                <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
                  {mode === 'login' && 'System Authorization'}
                  {mode === 'signup' && 'Operator Enlistment'}
                  {mode === 'verify' && 'Signal Verification'}
                  {mode === 'forgot' && 'Access Recovery'}
                  {mode === 'reset' && 'Security Uplink'}
                </h2>
                <p className="text-sm text-white/30 font-medium">
                  {mode === 'login' && 'Enter your credentials to access the command center.'}
                  {mode === 'signup' && 'Create your official responder profile in the grid.'}
                  {mode === 'verify' && `Neural code transmitted to ${email}`}
                  {mode === 'forgot' && 'Provide your ID for access restoration.'}
                  {mode === 'reset' && 'Establish a new high-security access cipher.'}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="OPERATOR NAME"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/50 focus:bg-white/5 rounded-2xl py-5 pl-14 pr-5 text-sm text-white placeholder:text-white/10 transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Operational Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="email" 
                      required
                      disabled={mode === 'verify' || mode === 'reset'}
                      placeholder="SECURE_MAIL@OPS.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/50 focus:bg-white/5 rounded-2xl py-5 pl-14 pr-5 text-sm text-white placeholder:text-white/10 transition-all outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">
                        {mode === 'reset' ? 'New Cipher' : 'Security Cipher'}
                      </label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot Cipher?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={mode === 'reset' ? newPassword : password}
                        onChange={(e) => mode === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/50 focus:bg-white/5 rounded-2xl py-5 pl-14 pr-14 text-sm text-white placeholder:text-white/10 transition-all outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center gap-2 px-1">
                    <input type="checkbox" id="stay" className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-[#020617]" />
                    <label htmlFor="stay" className="text-[10px] font-black text-white/20 uppercase tracking-widest">Stay Authorized</label>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all group shadow-2xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.25em] text-sm">
                        {mode === 'login' && 'Begin Session'}
                        {mode === 'signup' && 'Request Enlistment'}
                        {mode === 'verify' && 'Sync Identity'}
                        {mode === 'forgot' && 'Request Recovery'}
                        {mode === 'reset' && 'Commit Cipher'}
                      </span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-8 border-t border-white/5">
                {mode === 'login' ? (
                  <p className="text-xs text-white/20 font-medium">
                    New Recruit? {' '}
                    <button 
                      onClick={() => { clearError?.(); setMode('signup'); }}
                      className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-4 uppercase tracking-widest"
                    >
                      Apply for Access
                    </button>
                  </p>
                ) : (
                  mode !== 'verify' && mode !== 'reset' && (
                    <p className="text-xs text-white/20 font-medium">
                      Already Enlisted? {' '}
                      <button 
                        onClick={() => { clearError?.(); setMode('login'); }}
                        className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-4 uppercase tracking-widest"
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
      </div>
    </div>
  );
};

export default AuthPage;
