import React, { useState, useEffect } from 'react';
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

const AuthPage = () => {
  // Modes: login, signup, verify, forgot, reset
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

  // Handle Resend Timer
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
      if (mode === 'login') {
        await login(email, password);
        navigate('/');
      } else if (mode === 'signup') {
        await signup(fullName, email, password);
        setMode('verify');
        setResendTimer(60);
      } else if (mode === 'verify') {
        await verifyOtp(email, otp);
        navigate('/');
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
      onClick={() => setMode('login')}
      className="absolute top-4 left-4 text-slate-500 hover:text-white flex items-center text-xs transition-colors"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary/30 overflow-hidden">
      {/* Left Side: Cinematic Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/20 via-transparent to-background/60"></div>
        
        <img 
          src="/assets/command-bg.png" 
          alt="Rescue Command Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
        />
        
        <div className="relative z-20 p-16 flex flex-col justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-critical/20 rounded-2xl border border-critical/30 backdrop-blur-xl">
              <AlertTriangle className="w-8 h-8 text-critical" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white italic">
                RESCUE<span className="text-critical">IQ</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">Tactical Command System</p>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-md">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Protocol 12-B Active</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight">
              Real-time response. <br />
              <span className="text-primary">Life-saving precision.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium">
              Join the global network of first responders utilizing AI-driven triage and tactical coordination.
            </p>
          </div>

          <div className="flex items-center space-x-8">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">4.2k+</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Units</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">12ms</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Latency Delay</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-safe">OPTIMAL</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">System Health</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="lg:hidden text-center mb-12">
             <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-critical" />
             </div>
             <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                RESCUE<span className="text-critical">IQ</span>
             </h2>
          </div>

          <div className="glass-panel p-10 space-y-8 border-t-2 border-primary/40 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
            {mode !== 'login' && mode !== 'signup' && renderBackBtn()}
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-3xl font-black tracking-tight text-white">
                {mode === 'login' && 'System Authorization'}
                {mode === 'signup' && 'Operator Enlistment'}
                {mode === 'verify' && 'Identity Verification'}
                {mode === 'forgot' && 'Access Recovery'}
                {mode === 'reset' && 'Security Reset'}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {mode === 'login' && 'Enter your credentials to access the command center.'}
                {mode === 'signup' && 'Create your official responder profile.'}
                {mode === 'verify' && `A 6-digit code was transmitted to ${email}`}
                {mode === 'forgot' && 'Provide your registered email to receive a recovery code.'}
                {mode === 'reset' && 'Create a new high-security access cipher.'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-critical/10 border border-critical/30 rounded-xl text-critical text-sm font-medium flex items-center animate-shake relative z-10 ring-1 ring-critical/20">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block group-focus-within:text-primary transition-colors">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="Operator Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-surface/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block group-focus-within:text-primary transition-colors">Operational Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="name@rescue.iq"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'login' || mode === 'signup') && (
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block group-focus-within:text-primary transition-colors">Security Cipher</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {(mode === 'verify' || mode === 'reset') && (
                  <div className="group text-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Authorization Code</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-surface/40 border border-white/10 rounded-2xl py-5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-700 font-black text-4xl tracking-[0.5em] text-center"
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-center space-x-2">
                      <button 
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={handleResendOtp}
                        className="text-xs font-bold text-primary hover:text-white disabled:text-slate-600 transition-colors flex items-center"
                      >
                        {resendTimer > 0 ? (
                          <>Resend in {resendTimer}s</>
                        ) : (
                          <>Request New Code <ArrowRight className="w-3 h-3 ml-1" /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'reset' && (
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">New Security Cipher</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-surface/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-surface/50 text-primary focus:ring-primary/30" />
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Stay Authorized</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold text-primary hover:text-white transition-colors"
                  >
                    Forgot Cipher?
                  </button>
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-white font-black py-4.5 rounded-2xl flex items-center justify-center space-x-3 transition-all group shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">
                      {mode === 'login' && 'Begin Session'}
                      {mode === 'signup' && 'Request Enlistment'}
                      {mode === 'verify' && 'Complete Verification'}
                      {mode === 'forgot' && 'Send Recovery Code'}
                      {mode === 'reset' && 'Commit Security Change'}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-8 border-t border-white/5 relative z-10">
              {mode === 'login' && (
                <p className="text-sm text-slate-500">
                  New Recruit?{' '}
                  <button 
                    onClick={() => setMode('signup')}
                    className="font-bold text-white hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                  >
                    Apply for Access
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p className="text-sm text-slate-500">
                  Already Enlisted?{' '}
                  <button 
                    onClick={() => setMode('login')}
                    className="font-bold text-white hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                  >
                    Return to Command
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-black">
              Authorized Personnel Only • Encryption Protocol AES-256
            </p>
            <div className="flex justify-center space-x-4">
               <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse delay-75"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
