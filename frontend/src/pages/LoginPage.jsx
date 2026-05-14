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

  const renderBackBtn = () => (
    <button 
      onClick={() => setMode('login')}
      className="absolute top-6 left-6 text-slate-500 hover:text-white flex items-center text-xs transition-colors z-50"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back to Command
    </button>
  );

  return (
    <div className="min-h-screen relative flex items-start lg:items-center justify-center p-4 selection:bg-primary/30 overflow-y-auto bg-slate-950 py-12 lg:py-8">
      {/* FULL SCREEN TACTICAL BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/src/assets/tactical_india_command.png" 
          alt="Tactical Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/40 to-slate-950" />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side: Brand & Vibe */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
          <div className="flex items-center space-x-5">
            <div className="p-3 bg-critical/20 rounded-2xl border border-critical/30 backdrop-blur-2xl">
              <AlertTriangle className="w-8 h-8 text-critical" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white italic">
                RESCUE<span className="text-critical">IQ</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">Tactical Command System</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center space-x-3 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-xl">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Protocol 12-B Active</span>
            </div>
            <h2 className="text-5xl xl:text-6xl font-black text-white leading-[1.1]">
              Real-time response. <br />
              <span className="text-primary">Life-saving precision.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed">
              Join the global network of first responders utilizing AI-driven triage and tactical coordination.
            </p>
          </div>

          <div className="flex items-center space-x-10">
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

        {/* Right Side: Auth Forms Container */}
        <div className="w-full flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <div className="glass-panel p-6 md:p-8 backdrop-blur-3xl bg-slate-900/60 border border-white/10 shadow-2xl relative overflow-hidden group space-y-4">
              {mode !== 'login' && renderBackBtn()}
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-white">
                    {mode === 'login' && 'System Authorization'}
                    {mode === 'signup' && 'Operator Enlistment'}
                    {mode === 'verify' && 'Identity Verification'}
                    {mode === 'forgot' && 'Access Recovery'}
                    {mode === 'reset' && 'Security Reset'}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
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
                            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
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
                            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
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
                            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 pl-12 pr-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
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
                      <div className="group">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block group-focus-within:text-primary transition-colors">Verification OTP</label>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium tracking-[0.5em] text-center text-lg"
                          />
                        </div>
                      </div>
                    )}

                    {mode === 'reset' && (
                      <div className="group">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block group-focus-within:text-primary transition-colors">New Security Cipher</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-slate-600 font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-xs text-slate-500 cursor-pointer group">
                        <input type="checkbox" className="mr-2 accent-primary" />
                        <span className="group-hover:text-slate-300 transition-colors">Stay Authorized</span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot Cipher?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl py-3 font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center space-x-3 group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>
                          {mode === 'login' && 'Begin Session'}
                          {mode === 'signup' && 'Request Enlistment'}
                          {mode === 'verify' && 'Authorize Identity'}
                          {mode === 'forgot' && 'Send Recovery Link'}
                          {mode === 'reset' && 'Confirm Security Reset'}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    {mode === 'login' && (
                      <p className="text-sm text-slate-500">
                        New Recruit?{' '}
                        <button 
                          type="button"
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
                          type="button"
                          onClick={() => setMode('login')}
                          className="font-bold text-white hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                        >
                          Return to Command
                        </button>
                      </p>
                    )}
                  </div>
                </form>
              </div>

              <div className="text-center space-y-2 pt-4 border-t border-white/5">
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
      </div>
    </div>
  );
};

export default AuthPage;
