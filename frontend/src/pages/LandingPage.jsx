import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Zap, Globe, Satellite, Bot, ArrowRight, Users, Signal, 
  TrendingUp, ShieldCheck, Heart, Navigation, BrainCircuit, Scan, Share2, Phone, AlertTriangle,
  Radio, Cpu, MapPin, Database, ZapOff
} from 'lucide-react';

import './LandingPage.css';

// Import Optimized Assets
import droneImg from '../assets/3d_drone.png';
import satelliteImg from '../assets/3d_sattelight.png';
import ambulanceImg from '../assets/Ambulance_pic.png';
import robotImg from '../assets/robot_pic.png';
import earthImg from '../assets/3d_earth_pic.png';
import tacticalMapImg from '../assets/Satellite_uplink.png';
import hubImg from '../assets/3d_hub.png';

const ASSETS = {
  robot: robotImg,
  drone: droneImg,
  vehicle: ambulanceImg,
  satellite: satelliteImg,
  earth: earthImg,
  hub: hubImg
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Neural Preloader Sequence
    const duration = 2500;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, Math.floor((currentStep / steps) * 100)));
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setLoading(false), 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-body selection:bg-red-500/30">
      
      {/* ================= TACTICAL PRELOADER ================= */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="preloader"
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="preloader-bg"></div>
            <div className="preloader-content relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="preloader-logo font-space text-4xl mb-4"
              >
                <AlertTriangle size={40} className="text-red-500" />
                RESCUE<span className="text-red-500">IQ</span>
              </motion.div>
              <div className="preloader-bar-container w-64 h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="preloader-bar h-full bg-red-600 shadow-[0_0_20px_#ef4444]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="preloader-text font-mono text-[10px] tracking-[0.4em] text-white/40 flex flex-col items-center gap-2">
                <span>INITIALIZING NEURAL CORE... {progress}%</span>
                <span className="text-blue-500 font-black italic">PROTOCOL_ANTIGRAVITY_ACTIVE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TACTICAL NAVBAR ================= */}
      <nav className={`navbar ${scrolled ? 'scrolled scale-[0.98] top-6' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
             <AlertTriangle size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white uppercase tracking-tighter leading-none font-space italic">RESCUE<span className="text-red-500">IQ</span></span>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mt-1">Operational Core</span>
          </div>
        </div>

        <div className="hidden lg:flex nav-links">
          <a href="#home" className="text-xs uppercase font-black tracking-widest hover:text-red-500 transition-colors">Tactical_Main</a>
          <a href="#features" className="text-xs uppercase font-black tracking-widest hover:text-red-500 transition-colors">Intelligence</a>
          <a href="#analytics" className="text-xs uppercase font-black tracking-widest hover:text-red-500 transition-colors">Operations</a>
          <a href="#map" className="text-xs uppercase font-black tracking-widest hover:text-red-500 transition-colors">Global_Grid</a>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-3 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Neural Link: Stable</span>
          </div>
          <button onClick={() => navigate('/login')} className="primary-btn !h-[48px] !px-8 !rounded-2xl !text-xs !bg-red-600 hover:!bg-red-500 !shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            LAUNCH COMMAND CENTER
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero container" id="home">
        <div className="hero-wrapper">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hero-content"
          >
            <div className="hero-badge bg-red-500/10 border-red-500/30 text-red-500 font-black tracking-[0.3em] uppercase mb-8">
              AI_POWERED_DISASTER_INTEL_SYSTEM
            </div>
            
            <h1 className="hero-title font-space">
              Intelligent Response.<br/>
              <span className="text-red-500">Stronger Tomorrow.</span>
            </h1>
            
            <p className="hero-description text-white/50 text-xl leading-relaxed max-w-xl mb-12">
              RescueIQ leverages global neural mesh networks and real-time AI to optimize high-stakes disaster response. Faster decisions. Zero latency. Maximum life impact.
            </p>

            <div className="hero-actions flex gap-4">
              <button className="primary-btn !h-16 !px-10 !rounded-2xl !bg-white !text-black hover:!bg-white/90" onClick={() => navigate('/map')}>
                <Globe size={22} />
                EXPLORE LIVE GRID <ArrowRight size={20} />
              </button>
              <button className="secondary-btn !h-16 !px-10 !rounded-2xl !bg-white/5 border-white/10 hover:border-red-500/50" onClick={() => navigate('/login')}>
                <Activity size={22} className="text-red-500" />
                SYSTEM STATUS
              </button>
            </div>

            <div className="trusted-section mt-16">
              <div className="trusted-title text-[10px] text-white/20 font-black tracking-[0.4em] uppercase mb-6">Trusted By Global Response Agencies</div>
              <div className="trusted-logos flex items-center gap-12 opacity-30 grayscale brightness-200">
                <span className="text-2xl font-black italic tracking-tighter">NDRF</span>
                <span className="text-2xl font-black italic tracking-tighter uppercase text-sm">unicef</span>
                <span className="text-2xl font-black italic tracking-tighter uppercase">WHO</span>
                <span className="text-2xl font-black italic tracking-tighter uppercase">RedCross</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="hero-visual relative"
          >
            {/* Immersive Background Hub Effect */}
            <img src={ASSETS.hub} alt="Neural Hub" className="absolute w-[120%] h-[120%] -z-1 opacity-20 animate-pulse-slow" />
            
            <img src={ASSETS.earth} alt="Earth" className="earth w-[480px] drop-shadow-[0_0_100px_rgba(37,99,235,0.3)]" />
            <img src={ASSETS.satellite} alt="Satellite" className="satellite w-40 hover:scale-110 transition-transform" />
            <img src={ASSETS.drone} alt="Drone" className="drone w-44" />
            <img src={ASSETS.robot} alt="Robot Assistant" className="robot w-40" />
            <img src={ASSETS.vehicle} alt="Rescue Vehicle" className="ambulance w-64 drop-shadow-[0_0_50px_rgba(239,68,68,0.3)]" />

            {/* Tactical Holographic Terminals */}
            <div className="glass-card card-1 group">
               <div className="glass-icon bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-all"><Radio size={22}/></div>
               <div className="content">
                  <h4 className="font-black tracking-widest text-[11px]">SATELLITE_UPLINK</h4>
                  <p className="status text-blue-500 font-mono text-[10px]">CONNECTED_STABLE</p>
               </div>
            </div>

            <div className="glass-card card-2 group">
               <div className="glass-icon bg-cyan-500/10 text-cyan-400"><Signal size={22}/></div>
               <div className="content">
                  <h4 className="font-black tracking-widest text-[11px]">NEURAL_DRONE_NET</h4>
                  <p className="status text-cyan-400 font-mono text-[10px]">12_ACTIVE_NODES</p>
                  <p className="sub-text text-[9px] uppercase font-bold tracking-tighter opacity-40 italic">Scanning_Sector_Alpha</p>
               </div>
            </div>

            <div className="glass-card card-3 warning-card !border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
               <div className="glass-icon bg-red-500/20 text-red-500"><AlertTriangle size={22} className="animate-pulse" /></div>
               <div className="content">
                  <h4 className="font-black tracking-widest text-[11px] text-red-500">CRITICAL_INCIDENTS</h4>
                  <p className="status text-red-400 font-mono text-xl leading-none mt-1">24</p>
                  <p className="sub-text text-[9px] uppercase font-bold tracking-tighter opacity-60">High_Priority_Reports</p>
               </div>
               <Activity size={16} className="text-red-500 ml-auto opacity-20" />
            </div>

            <div className="glass-card card-4 group">
               <div className="glass-icon bg-purple-500/10 text-purple-400"><Bot size={22}/></div>
               <div className="content">
                  <h4 className="font-black tracking-widest text-[11px]">AI_OPERATOR_v4</h4>
                  <p className="status text-purple-400 font-mono text-[10px]">READY_FOR_SYNC</p>
                  <p className="sub-text text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1 animate-pulse">● System_Online</p>
               </div>
            </div>

            <div className="glass-card card-5 group">
               <div className="glass-icon bg-emerald-500/10 text-emerald-400"><ShieldCheck size={22}/></div>
               <div className="content">
                  <h4 className="font-black tracking-widest text-[11px]">FLEET_READY</h4>
                  <p className="status text-emerald-400 font-mono text-xl leading-none mt-1">38</p>
                  <p className="sub-text text-[9px] uppercase font-black tracking-widest opacity-40">Deployment_Ready</p>
               </div>
            </div>
          </motion.div>

          <div className="scroll-indicator font-black tracking-[0.5em] text-[10px] opacity-20">
            <div className="mouse-icon border-white/20">
              <div className="mouse-wheel bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
            </div>
            SCROLL_TO_INITIATE_INTEL
          </div>
        </div>
      </section>

      {/* ================= STATS PANEL ================= */}
      <section className="container mt-20" id="analytics">
        <div className="stats-panel bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem]">
          {[
            { icon: Zap, val: '14ms', label: 'NEURAL LATENCY', sub: 'Real-time response delay', color: '#ef4444' },
            { icon: TrendingUp, val: '82%', label: 'OP_EFFICIENCY', sub: 'AI deployment uplift', color: '#10b981' },
            { icon: ShieldCheck, val: '450+', label: 'CONNECTED_AGENCIES', sub: 'Global network nodes', color: '#3b82f6' },
            { icon: Users, val: '1.2M', label: 'LIVES_SECURED', sub: 'Across all active missions', color: '#8b5cf6' }
          ].map((s, i) => (
            <div key={i} className="stat-card px-10">
              <div className="stat-header mb-8">
                <div className="stat-icon p-3 bg-white/5 rounded-xl" style={{ color: s.color }}>
                  <s.icon size={28} />
                </div>
                <div className="stat-info">
                  <div className="stat-number font-space text-4xl font-black">{s.val}</div>
                  <div className="stat-label text-[10px] font-black tracking-widest text-white/30">{s.label}</div>
                  <div className="stat-subtext text-[10px] font-bold text-white/10 italic mt-1">{s.sub}</div>
                </div>
              </div>
              <div className="stat-graph-container h-12 opacity-40">
                {/* SVG Graphs will render here as defined in CSS */}
                <svg className="stat-graph-svg w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    d="M0 30 L 20 22 L 40 28 L 60 15 L 80 20 L 100 5 L 120 25 L 140 10 L 160 30 L 180 15 L 200 22" 
                    fill="none" stroke={s.color} strokeWidth="3" 
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TACTICAL FEATURES ================= */}
      <section className="features container py-32" id="features">
        <div className="section-header text-center mb-24">
          <div className="section-badge bg-red-500/10 border-red-500/30 text-red-500">
            <ShieldCheck size={16} />
            TACTICAL ADVANTAGE PROTOCOL
          </div>
          <h2 className="section-title font-space text-6xl font-black tracking-tighter uppercase leading-none mt-4">
            Engineered for the <span className="text-red-500">Frontline.</span>
          </h2>
        </div>

        <div className="bento-grid grid-cols-12 gap-6">
           
           <div className="feature-card large col-span-8 bg-slate-900/60 border-white/5 backdrop-blur-2xl rounded-[3rem] p-12 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <BrainCircuit size={200} />
             </div>
             <div className="relative z-10">
               <div className="feature-icon bg-red-600/20 text-red-500 p-4 rounded-2xl w-fit mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <BrainCircuit size={32}/>
               </div>
               <h3 className="feature-title font-space text-4xl font-black tracking-tight uppercase mb-6">Neural Triage Engine v4.0</h3>
               <p className="feature-desc text-white/40 text-lg leading-relaxed max-w-xl">
                 Sub-10ms classification of multi-channel emergency signals using proprietary AI mesh networks. Processes satellite imagery, ground telemetry, and social intelligence simultaneously for zero-infrastructure response.
               </p>
             </div>
             <div className="mt-12 flex items-center gap-6 relative z-10">
               <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-red-500/20 flex items-center justify-center text-[10px] font-black text-red-500">NODE</div>
                  ))}
               </div>
               <span className="text-[11px] font-black text-red-500 uppercase tracking-widest animate-pulse italic">ACTIVE_NEURAL_MESH: STABLE</span>
             </div>
           </div>

           {[
              { icon: Navigation, title: "Path Optimizer", desc: "Dynamic routing through structural debris and flood zones.", color: 'blue' },
              { icon: Radio, title: "Satellite Mesh", desc: "Global communication without local infrastructure.", color: 'cyan' },
              { icon: Cpu, title: "Autonomous Ops", desc: "AI-driven fleet management and triage automation.", color: 'purple' },
              { icon: MapPin, title: "Spatial Twin", desc: "Sub-meter 3D replica of live disaster zones.", color: 'emerald' }
           ].map((f, i) => (
              <div key={i} className="feature-card small col-span-4 bg-slate-900/60 border-white/5 backdrop-blur-2xl rounded-[3rem] p-10 hover:border-red-500/30 transition-all group">
                 <div className={`feature-icon bg-${f.color}-500/10 text-${f.color}-400 p-4 rounded-2xl w-fit mb-8 transition-all group-hover:scale-110`}>
                    <f.icon size={28}/>
                 </div>
                 <h3 className="feature-title font-space text-2xl font-black tracking-tight uppercase mb-4">{f.title}</h3>
                 <p className="feature-desc text-white/30 text-sm leading-relaxed">{f.desc}</p>
              </div>
           ))}

        </div>
      </section>

      {/* ================= CINEMATIC MISSION PREVIEW ================= */}
      <section className="cinematic-section py-32 bg-slate-950/40 relative overflow-hidden" id="map">
        <div className="container cinematic-grid grid grid-cols-2 gap-24 items-center">
           
           <div className="cinematic-visual relative group">
              <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(239,68,68,0.1)] bg-[#030712]">
                 <img src={tacticalMapImg} alt="Tactical Grid" className="w-full h-full object-cover grayscale brightness-50 opacity-40 group-hover:scale-105 transition-transform duration-[4000ms]" />
                 
                 <div className="absolute inset-0 pointer-events-none">
                   <motion.div 
                     animate={{ top: ['-10%', '110%'] }}
                     transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                     className="absolute left-0 w-full h-[2px] bg-red-600 shadow-[0_0_20px_#ef4444] z-20"
                   />
                   <div className="absolute inset-0 opacity-[0.05]" 
                        style={{ backgroundImage: 'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                 </div>

                 <div className="absolute top-8 left-8 flex flex-col gap-3 z-10">
                   <div className="px-4 py-2 bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-full flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Global_Surveillance_Active</span>
                   </div>
                 </div>

                 <div className="absolute bottom-8 right-8 z-10 flex flex-col items-end gap-2 text-white/40 font-mono text-[9px] uppercase tracking-[0.3em]">
                    <span>Target_Sync: 99.8%</span>
                    <span className="text-red-500 font-black">Scanning_Sector_India</span>
                 </div>
              </div>
           </div>

           <div>
              <div className="cinematic-badge bg-red-500/10 border-red-500/30 text-red-500 mb-8">
                <Globe size={16} />
                Global Spatial Intelligence
              </div>
              
              <h2 className="cinematic-heading font-space text-6xl font-black tracking-tighter uppercase leading-tight mb-8">
                Live Tactical <br /> Awareness Layer.
              </h2>
              
              <p className="cinematic-desc text-white/40 text-xl leading-relaxed mb-12">
                 Navigate disaster zones with a sub-meter precise Digital Twin. Our global mesh ensures situational awareness even when standard infrastructure is decimated, giving operators unparalleled control over extraction and deployment.
              </p>
              
              <button onClick={() => navigate('/map')} className="primary-btn !h-16 !px-10 !rounded-2xl !bg-red-600 hover:!bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                 EXPLORE THE MISSION GRID <ArrowRight size={22} className="ml-2" />
              </button>
           </div>
           
        </div>
      </section>

      {/* ================= FINAL COMMAND CTA ================= */}
      <section className="py-48 text-center container relative">
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="relative z-10"
         >
           <h2 className="text-7xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] font-space mb-12 text-white italic">
              The Future of <br />
              <span className="text-red-600 drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]">Survival.</span>
           </h2>
           <p className="text-xl text-white/30 max-w-2xl mx-auto font-medium mb-16 tracking-wide">
              Join the elite global network of response agencies already utilizing the RescueIQ neural layer to optimize life-saving missions.
           </p>
           <div className="flex justify-center gap-8">
              <button className="primary-btn !h-20 !px-12 !rounded-[2rem] !text-base !bg-white !text-black" onClick={() => navigate('/signup')}>ENLIST NOW</button>
              <button className="secondary-btn !h-20 !px-12 !rounded-[2rem] !text-base border-white/10 hover:border-white/40 uppercase font-black tracking-widest">Contact Ops</button>
           </div>
         </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer bg-slate-950/80 border-white/5 py-24" id="about">
        <div className="container">
          <div className="footer-grid grid grid-cols-4 gap-24 mb-24">
             <div className="col-span-2">
                <div className="footer-brand font-space text-4xl font-black italic tracking-tighter text-white uppercase mb-8">RESCUE<span className="text-red-600">IQ</span></div>
                <p className="footer-desc text-white/30 text-lg leading-relaxed max-w-md">Empowering frontline responders with high-fidelity AI intelligence, global mesh connectivity, and autonomous mission coordination.</p>
                <div className="flex gap-6 mt-10">
                   {[Signal, Globe, Share2].map((Icon, i) => (
                      <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-all border border-white/5"><Icon size={20}/></div>
                   ))}
                </div>
             </div>
             
             {['Tactical', 'Agency', 'Legal'].map((col, i) => (
               <div key={i} className="footer-col">
                  <h4 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-10">{col}</h4>
                  <ul className="space-y-6">
                     {['Neural Core', 'Mission Log', 'Privacy Layer', 'Satellite Mesh'].map((link, j) => (
                       <li key={j}><a href="#" className="text-white/30 hover:text-red-500 transition-colors uppercase font-black text-[10px] tracking-widest">{link}</a></li>
                     ))}
                  </ul>
               </div>
             ))}
          </div>
          
          <div className="footer-bottom border-white/5 pt-12 flex justify-between items-center text-[10px] font-black tracking-[0.4em] text-white/10 uppercase">
             <div>© 2026 RESCUE_IQ OPERATIONAL_CORE • ALL_SYSTEMS_GO</div>
             <div className="flex gap-12">
                <div className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"/> PRIMARY_NODE: ONLINE</div>
                <div className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"/> AI_CLUSTER: OPTIMIZED</div>
             </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;
