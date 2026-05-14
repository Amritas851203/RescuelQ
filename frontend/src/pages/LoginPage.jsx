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
      className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center text-[10px] font-black uppercase tracking-widest transition-all group z-50 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5"
    >
      <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
      Abort Mission
    </button>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-end lg:pr-32 bg-[#020617] overflow-hidden font-sans">
      
      {/* FULL SCREEN BACKGROUND - BOOSTER VISIBILITY */}
      <div className="absolute inset-0 z-0">
        <img 
          src={tacticalBg} 
          alt="Tactical Command" 
          className="w-full h-full object-cover opacity-80 mix-blend-normal scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-[#020617]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]" />
      </div>

      {/* TACTICAL HUD OVERLAYS - ENABLED FOR LAPTOPS */}
      <div className="absolute inset-0 pointer-events-none z-1 p-6 lg:p-10">
        
        {/* Top Branding Section */}
        <div className="flex justify-between items-start">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-red-600/30 border border-red-500/50 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="text-red-500" size={24} />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">RESCUE<span className="text-red-500">IQ</span></h1>
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.4em] mt-1">Tactical Command System</p>
                 </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-500/40 rounded-full backdrop-blur-md">
                 <Shield size={12} className="text-blue-400" />
                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">PROTOCOL 12-B ACTIVE</span>
              </div>
           </div>

           <div className="flex flex-col items-end gap-3">
              <div className="px-6 py-2 bg-red-600/20 border border-red-500/40 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                 <span className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">GLOBAL THREAT LEVEL: HIGH</span>
              </div>
              <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg backdrop-blur-md">
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SYSTEMS OPERATIONAL</span>
              </div>
           </div>
        </div>

        {/* Floating HUD Panels - Visible on Large Screens (Laptops) */}
        <div className="hidden lg:block">
           {/* Left Info */}
           <div className="absolute top-44 left-10 w-64 space-y-6">
              <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl">
                 <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Live Incidents</h4>
                 <div className="space-y-3">
                    {['#4521 - DELHI - CONTAINED', '#4522 - MUMBAI - ACTIVE', '#4523 - CHENNAI - ALERT'].map((inc, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-white/70 tracking-wider font-mono">{inc.split(' - ')[0]}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded ${inc.includes('ACTIVE') ? 'bg-red-500/30 text-red-400' : 'bg-emerald-500/30 text-emerald-400'}`}>
                             {inc.split(' - ')[2]}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Regional Weather</h4>
                    <CloudRain size={14} className="text-blue-400" />
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-white">24°C</div>
                    <div className="text-[9px] text-white/60 uppercase font-bold leading-tight tracking-widest">Heavy Rain Warning<br/>Sector-14</div>
                 </div>
              </div>
           </div>

           {/* Cinematic Messaging (Center Left) */}
           <div className="absolute top-1/2 left-10 -translate-y-1/2 max-w-lg space-y-4">
              <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl">
                 Real-time<br/>
                 <span className="text-blue-500">Response.</span><br/>
                 Life-saving<br/>
                 <span className="text-blue-500">Precision.</span>
              </h2>
              <p className="text-sm text-white/60 font-medium leading-relaxed max-w-xs bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                 Join the global network of first responders utilizing AI-driven triage and tactical coordination.
              </p>
           </div>

           {/* Right Info */}
           <div className="absolute top-44 right-10 w-64 space-y-6">
              <div className="p-5 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl">
                 <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Active Rescue Units</h4>
                 <div className="space-y-4">
                    {[
                      { name: 'ALPHA-7', status: 'DEPLOYED', color: 'red' },
                      { name: 'BRAVO-3', status: 'ON ROUTE', color: 'blue' },
                      { name: 'CHARLIE-9', status: 'STANDBY', color: 'emerald' }
                    ].map((unit, i) => (
                       <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px] font-black text-white/80">
                             <span>UNIT {unit.name}</span>
                             <span className={`text-${unit.color}-400`}>{unit.status}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full bg-${unit.color}-500 w-[70%]`} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl">
                 <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">AI Risk Prediction</h4>
                 <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-white/10" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray="175.9" strokeDashoffset="40" className="text-red-500" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">72%</div>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-red-500 uppercase">HIGH RISK</span>
                       <span className="text-[8px] font-bold text-white/50 uppercase leading-tight tracking-[0.2em]">Sector Delta<br/>Critical State</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Fixed Bottom Indicators */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">System Status</span>
                 <div className="flex gap-2 mt-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75 shadow-[0_0_12px_#10b981]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150 shadow-[0_0_12px_#10b981]" />
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Neural Nodes</span>
                 <span className="text-2xl font-black text-white leading-none mt-1.5 italic tracking-tighter">4.2k+</span>
              </div>
           </div>
           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em] hidden md:block">Authorized Access Protocol AES-256</p>
        </div>
      </div>

      {/* MAIN AUTH TERMINAL (CENTERED) */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel relative overflow-hidden bg-slate-950/90 backdrop-blur-[40px] border border-white/20 rounded-[2.5rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,1)] p-8 md:p-12"
        >
          {/* Internal Cyber Glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {mode !== 'login' && renderBackBtn()}

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-[0.8] mb-2">
                  {mode === 'login' && 'System Authorization'}
                  {mode === 'signup' && 'Operator enlistment'}
                  {mode === 'verify' && 'Signal verification'}
                  {mode === 'forgot' && 'Identity recovery'}
                  {mode === 'reset' && 'Security uplink'}
                </h2>
                <p className="text-sm text-white/50 font-medium">
                  {mode === 'login' && 'Enter your credentials to access the command center.'}
                  {mode === 'signup' && 'Create your official responder profile in the grid.'}
                  {mode === 'verify' && `Neural code transmitted to ${email}`}
                  {mode === 'forgot' && 'Provide your ID for access restoration.'}
                  {mode === 'reset' && 'Establish a new high-security access cipher.'}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-600/20 border border-red-500/40 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-black text-red-500 uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {mode === 'signup' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/60 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                      <input 
                        type="text" 
                        required
                        placeholder="OPERATOR NAME"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] rounded-2xl py-5 pl-16 pr-6 text-sm text-white placeholder:text-white/20 transition-all outline-none font-bold tracking-wide"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-white/60 uppercase tracking-widest ml-1">Operational Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      disabled={mode === 'verify' || mode === 'reset'}
                      placeholder="SECURE_MAIL@OPS.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] rounded-2xl py-5 pl-16 pr-6 text-sm text-white placeholder:text-white/20 transition-all outline-none disabled:opacity-50 font-bold tracking-wide"
                    />
                  </div>
                </div>

                {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black text-white/60 uppercase tracking-widest ml-1">
                        {mode === 'reset' ? 'New Cipher' : 'Security Cipher'}
                      </label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('forgot')} className="text-[11px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot Cipher?</button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={mode === 'reset' ? newPassword : password}
                        onChange={(e) => mode === 'reset' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.08] rounded-2xl py-5 pl-16 pr-16 text-sm text-white placeholder:text-white/20 transition-all outline-none font-bold"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center gap-3 px-1">
                    <input type="checkbox" id="stay" className="w-5 h-5 rounded bg-white/5 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-[#020617]" />
                    <label htmlFor="stay" className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Stay Authorized</label>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-[2rem] flex items-center justify-center gap-5 transition-all group shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] active:scale-[0.97] disabled:opacity-50 mt-6"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.3em] text-sm">
                        {mode === 'login' && 'Begin Session'}
                        {mode === 'signup' && 'Request Enlistment'}
                        {mode === 'verify' && 'Sync Identity'}
                        {mode === 'forgot' && 'Request Recovery'}
                        {mode === 'reset' && 'Commit Cipher'}
                      </span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-10 border-t border-white/5">
                {mode === 'login' ? (
                  <p className="text-xs text-white/30 font-medium">
                    New Recruit? {' '}
                    <button 
                      onClick={() => { clearError?.(); setMode('signup'); }}
                      className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-8 uppercase tracking-[0.2em]"
                    >
                      Apply for Access
                    </button>
                  </p>
                ) : (
                  mode !== 'verify' && mode !== 'reset' && (
                    <p className="text-xs text-white/30 font-medium">
                      Already Enlisted? {' '}
                      <button 
                        onClick={() => { clearError?.(); setMode('login'); }}
                        className="font-black text-white hover:text-blue-500 transition-colors underline decoration-blue-500/30 underline-offset-8 uppercase tracking-[0.2em]"
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
