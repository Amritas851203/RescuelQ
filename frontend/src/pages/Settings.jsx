import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Bell, BrainCircuit, Map, Palette, User, 
  Lock, Fingerprint, Smartphone, AlertTriangle, 
  Wifi, Satellite, Activity, Zap, Cpu, Settings as SettingsIcon,
  ChevronRight, Save, LogOut, CheckCircle2, Clock, Globe, Loader2,
  X, Camera, Mail, Briefcase, Building, Info, Eye, EyeOff, Upload, Terminal
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const SettingsCard = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-[#0a1020]/72 backdrop-blur-[18px] border border-white/5 rounded-[2rem] p-8 shadow-2xl group hover:border-cyan-500/20 transition-all duration-500"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </motion.div>
);

const SettingToggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between group/toggle">
    <div className="flex-1">
      <div className="text-sm font-bold text-white group-hover/toggle:text-cyan-400 transition-colors uppercase tracking-widest">{label}</div>
      <div className="text-[10px] text-white/30 font-mono mt-1">{description}</div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: checked ? 26 : 4 }}
        className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-md"
      />
    </button>
  </div>
);

const SettingSlider = ({ label, value, min = 0, max = 100, step = 1, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <div className="text-xs font-black text-white/60 uppercase tracking-widest">{label}</div>
      <div className="text-xs font-mono text-cyan-400">{value}%</div>
    </div>
    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        className="absolute h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        initial={{ width: 0 }}
        animate={{ width: `${(value - min) / (max - min) * 100}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

const DiagnosticPill = ({ label, value, status = 'stable' }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
    <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">{label}</span>
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono text-white font-bold">{value}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'stable' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'} animate-pulse`} />
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#0a1020]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 relative z-10 max-h-[70vh] overflow-y-auto no-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Settings = () => {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Operator',
    email: user?.email || '',
    username: user?.username || 'operator_01',
    title: user?.title || 'Master Admin',
    organization: user?.organization || 'RescueIQ AI Command',
    bio: user?.bio || 'Neural Link established. Monitoring global distress signals.'
  });

  const [settings, setSettings] = useState({
    twoFactor: true,
    biometric: false,
    emergencyOverride: false,
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    criticalOnly: false,
    predictionSensitivity: 85,
    autoDispatch: 72,
    smartTriage: 90,
    satelliteSync: true,
    threatDetection: true,
    gpsUpdates: 95,
    droneVisibility: true,
    heatmapOverlays: true,
    uiIntensity: 65,
    animations: 80,
    compactMode: false
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    setIsEditModalOpen(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, avatar: reader.result };
        setUser(updatedUser);
        setFileLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarUpload} 
        className="hidden" 
        accept="image/*"
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <main className="max-w-[1600px] mx-auto px-8 py-16 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <SettingsIcon size={18} className="text-cyan-400 animate-spin-slow" />
              </div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Control Panel</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-2">System Settings</h1>
            <p className="text-white/40 font-mono text-sm max-w-xl leading-relaxed">
              Manage operational preferences, security protocols, notifications, and AI system controls for the RescueIQ tactical environment.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">All Systems Stable</span>
            </div>
            <div className="text-[10px] font-mono text-white/20 uppercase">Last Sync: 12ms Ago</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Settings Grid */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Account Settings */}
              <SettingsCard title="Account Profile" icon={User} delay={0.1}>
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5">
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 rounded-2xl border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all shadow-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
                      {fileLoading ? (
                        <Loader2 size={24} className="text-cyan-400 animate-spin" />
                      ) : (
                        <img 
                          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'Operator'}`} 
                          alt="Operator"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera size={16} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white uppercase tracking-tight">{user?.fullName || 'Operator'}</div>
                    <div className="text-xs font-mono text-white/30">{user?.email}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                        {user?.title || 'Master Admin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </SettingsCard>

              {/* Security & Access */}
              <SettingsCard title="Security & Protocols" icon={Lock} delay={0.2}>
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 mb-4">
                  <Shield size={20} className="text-rose-400" />
                  <div>
                    <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Security Level</div>
                    <div className="text-xs font-black text-white">MAXIMUM PROTECTION ACTIVE</div>
                  </div>
                </div>
                <SettingToggle 
                  label="Two Factor Auth" 
                  description="Required for all administrative actions"
                  checked={settings.twoFactor}
                  onChange={(v) => updateSetting('twoFactor', v)}
                />
                <SettingToggle 
                  label="Biometric Login" 
                  description="FaceID or Fingerprint authentication"
                  checked={settings.biometric}
                  onChange={(v) => updateSetting('biometric', v)}
                />
                <SettingToggle 
                  label="Emergency Override" 
                  description="Allow manual bypass of AI safety protocols"
                  checked={settings.emergencyOverride}
                  onChange={(v) => updateSetting('emergencyOverride', v)}
                />
              </SettingsCard>

              {/* Alert & Notifications */}
              <SettingsCard title="Alert Matrix" icon={Bell} delay={0.3}>
                <SettingToggle 
                  label="Email Intel" 
                  description="Detailed situation reports"
                  checked={settings.emailAlerts}
                  onChange={(v) => updateSetting('emailAlerts', v)}
                />
                <SettingToggle 
                  label="SMS Direct" 
                  description="Critical alerts to mobile device"
                  checked={settings.smsAlerts}
                  onChange={(v) => updateSetting('smsAlerts', v)}
                />
                <SettingToggle 
                  label="Push Relay" 
                  description="Real-time dashboard notifications"
                  checked={settings.pushNotifications}
                  onChange={(v) => updateSetting('pushNotifications', v)}
                />
                <SettingToggle 
                  label="Critical-Only Mode" 
                  description="Silence all but life-threatening alerts"
                  checked={settings.criticalOnly}
                  onChange={(v) => updateSetting('criticalOnly', v)}
                />
              </SettingsCard>

              {/* AI System Preferences */}
              <SettingsCard title="AI Core Engine" icon={BrainCircuit} delay={0.4}>
                <SettingSlider 
                  label="Prediction Sensitivity" 
                  value={settings.predictionSensitivity}
                  onChange={(v) => updateSetting('predictionSensitivity', v)}
                />
                <SettingSlider 
                  label="Auto-Dispatch Assistance" 
                  value={settings.autoDispatch}
                  onChange={(v) => updateSetting('autoDispatch', v)}
                />
                <SettingSlider 
                  label="Smart Triage Priority" 
                  value={settings.smartTriage}
                  onChange={(v) => updateSetting('smartTriage', v)}
                />
                <div className="pt-4 space-y-4">
                  <SettingToggle 
                    label="Satellite Sync" 
                    description="Real-time orbital telemetry data"
                    checked={settings.satelliteSync}
                    onChange={(v) => updateSetting('satelliteSync', v)}
                  />
                  <SettingToggle 
                    label="Threat Detection" 
                    description="AI-powered hazard identification"
                    checked={settings.threatDetection}
                    onChange={(v) => updateSetting('threatDetection', v)}
                  />
                </div>
              </SettingsCard>

              {/* Map & Live Tracking */}
              <SettingsCard title="Tactical Map" icon={Map} delay={0.5}>
                <SettingSlider 
                  label="GPS Sync Frequency" 
                  value={settings.gpsUpdates}
                  onChange={(v) => updateSetting('gpsUpdates', v)}
                />
                <SettingToggle 
                  label="Drone Visibility" 
                  description="Show UAV paths on tactical map"
                  checked={settings.droneVisibility}
                  onChange={(v) => updateSetting('droneVisibility', v)}
                />
                <SettingToggle 
                  label="Heatmap Overlays" 
                  description="Visualize disaster intensity zones"
                  checked={settings.heatmapOverlays}
                  onChange={(v) => updateSetting('heatmapOverlays', v)}
                />
              </SettingsCard>

              {/* Appearance & UI */}
              <SettingsCard title="Interface OS" icon={Palette} delay={0.6}>
                <div className="flex gap-4">
                  {['CYAN', 'PURPLE', 'ROSE'].map(theme => (
                    <button key={theme} className={`flex-1 py-4 rounded-2xl border ${theme === 'CYAN' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40'} text-[10px] font-black uppercase tracking-widest`}>
                      {theme}
                    </button>
                  ))}
                </div>
                <SettingSlider 
                  label="UI Intensity" 
                  value={settings.uiIntensity}
                  onChange={(v) => updateSetting('uiIntensity', v)}
                />
                <SettingSlider 
                  label="Motion Dynamics" 
                  value={settings.animations}
                  onChange={(v) => updateSetting('animations', v)}
                />
                <SettingToggle 
                  label="Compact Mode" 
                  description="Reduce spacing for high-density HUD"
                  checked={settings.compactMode}
                  onChange={(v) => updateSetting('compactMode', v)}
                />
              </SettingsCard>
            </div>
          </div>

          {/* Sidebar Diagnostics */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#0a1020]/72 backdrop-blur-[18px] border border-white/10 rounded-[2rem] p-8 sticky top-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Diagnostics</h3>
              </div>

              <div className="space-y-4">
                <DiagnosticPill label="System Health" value="OPTIMIZED" />
                <DiagnosticPill label="Network Latency" value="12ms" />
                <DiagnosticPill label="AI Core Load" value="24.8%" />
                <DiagnosticPill label="Connected Devices" value="43 Active" />
                <DiagnosticPill label="Sync Status" value="ENCRYPTED" />
              </div>

              <div className="mt-12 space-y-4">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 text-center">Hardware Relay</div>
                <div className="flex justify-center gap-6">
                   <div className="flex flex-col items-center gap-2">
                     <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Wifi size={20} />
                     </div>
                     <span className="text-[8px] font-bold text-white/30 uppercase">Uplink</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                     <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Globe size={20} />
                     </div>
                     <span className="text-[8px] font-bold text-white/30 uppercase">Global</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                     <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <Cpu size={20} />
                     </div>
                     <span className="text-[8px] font-bold text-white/30 uppercase">Neural</span>
                   </div>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center">
                <button className="flex items-center justify-center gap-3 w-full text-rose-500 font-black text-xs uppercase tracking-[0.2em] hover:text-rose-400 transition-colors">
                  <LogOut size={16} />
                  Terminate Session
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Global Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-[100] pointer-events-auto"
        >
          <button className="group flex items-center gap-4 bg-cyan-500 text-black px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all">
            <Save size={20} className="group-hover:rotate-12 transition-transform" />
            Commit Changes
          </button>
        </motion.div>
      </main>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Tactical Profile"
      >
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <Terminal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Rank / Title</label>
              <div className="relative group">
                <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Organization</label>
              <div className="relative group">
                <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Personnel Bio / Status</label>
            <div className="relative group">
              <Info size={16} className="absolute left-4 top-6 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows="3"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:bg-white/10 transition-all resize-none no-scrollbar"
              />
            </div>
          </div>

          <div 
            className="p-6 rounded-[1.5rem] border-2 border-dashed border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all cursor-pointer flex flex-col items-center gap-2 group/upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} className="text-white/20 group-hover/upload:text-cyan-400 group-hover/upload:scale-110 transition-all" />
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Update Identification Image</div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 rounded-[1.5rem] bg-cyan-500 text-black font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-all"
          >
            Commit Tactical Updates
          </button>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        title="Security Override: Password"
      >
        <div className="space-y-8">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
             <AlertTriangle className="text-amber-500 shrink-0" size={20} />
             <p className="text-[10px] text-amber-500/80 font-mono leading-relaxed">
               Updating your security credentials will terminate all other active tactical sessions for this operator ID.
             </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">New Security Credential</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-1 mt-3 px-1">
                 {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-cyan-500' : 'bg-white/10'}`} />)}
              </div>
              <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest ml-1">Strength: Tactical Grade</div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirm New Credential</label>
              <div className="relative group">
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button className="w-full py-5 rounded-[1.5rem] bg-rose-500 text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(244,63,94,0.3)] hover:bg-rose-400 transition-all">
            Authorize Key Exchange
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
