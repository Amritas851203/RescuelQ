import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Zap, Globe, Satellite, Bot, ArrowRight, Users, Signal, 
  TrendingUp, ShieldCheck, Heart, Navigation, BrainCircuit, Scan, Share2, Phone, AlertTriangle
} from 'lucide-react';

import './LandingPage.css';

import droneImg from '../assets/3d_drone.png';
import satelliteImg from '../assets/3d_sattelight.png';
import ambulanceImg from '../assets/Ambulance_pic.png';
import robotImg from '../assets/robot_pic.png';
import earthImg from '../assets/3d_earth_pic.png';
import tacticalMapImg from '../assets/Satellite_uplink.png';

const ASSETS = {
  robot: robotImg,
  drone: droneImg,
  vehicle: ambulanceImg,
  satellite: satelliteImg,
  earth: earthImg
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Preloader Logic
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, Math.floor((currentStep / steps) * 100)));
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setLoading(false), 400); // Slight delay after 100%
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
    <div className="landing-body">
      
      {/* ================= PRELOADER ================= */}
      <motion.div 
        className="preloader"
        initial={{ y: 0 }}
        animate={{ y: loading ? 0 : '-100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="preloader-bg"></div>
        <div className="preloader-content">
          <div className="preloader-logo font-space">
            <AlertTriangle size={24} className="text-red-500" />
            Rescue<span>IQ</span>
          </div>
          <div className="preloader-bar-container">
            <div className="preloader-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="preloader-text">Initializing Neural Core... {progress}%</div>
        </div>
      </motion.div>

      {/* ================= NAVBAR ================= */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
             <AlertTriangle size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white uppercase tracking-tighter leading-none font-space">Rescue<span className="text-red-500">IQ</span></span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#map">Live Map</a>
          <a href="#analytics">Analytics</a>
          <a href="#about">About</a>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Systems Online</span>
          </div>
          <button onClick={() => navigate('/login')} className="primary-btn !h-[44px] !px-6 !rounded-xl !text-sm">
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero container" id="home">
        <div className="hero-wrapper">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">
              AI POWERED DISASTER RESPONSE SYSTEM
            </div>
            
            <h1 className="hero-title font-space">
              Intelligent Response.<br/>
              <span>Stronger Tomorrow.</span>
            </h1>
            
            <p className="hero-description">
              RescueIQ combines AI, real-time data, and predictive intelligence to save more lives during disasters. Faster decisions. Smarter operations. Greater impact.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => navigate('/map')}>
                <Globe size={20} />
                Explore Live Map <ArrowRight size={18} />
              </button>
              <button className="secondary-btn" onClick={() => navigate('/login')}>
                <Activity size={20} />
                View System Status
              </button>
            </div>

            <div className="trusted-section">
              <div className="trusted-title">Trusted By Global Agencies</div>
              <div className="trusted-logos">
                <span>NDRF <span style={{fontSize: '12px', fontStyle: 'normal'}}>INDIA</span></span>
                <span>unicef</span>
                <span>WHO</span>
                <span>redcross</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hero-visual"
          >
            <img src={ASSETS.earth} alt="Earth" className="earth" />
            <img src={ASSETS.satellite} alt="Satellite" className="satellite" />
            <img src={ASSETS.drone} alt="Drone" className="drone" />
            <img src={ASSETS.robot} alt="Robot Assistant" className="robot" />
            <img src={ASSETS.vehicle} alt="Rescue Vehicle" className="ambulance" />

            {/* Floating Glass Cards */}
            {/* Card 1: Satellite */}
            <div className="glass-card card-1">
               <div className="glass-icon icon-cyan"><Satellite size={20}/></div>
               <div className="content">
                  <h4>Satellite Link</h4>
                  <p className="status text-cyan">Connected</p>
               </div>
            </div>

            {/* Card 2: Drone */}
            <div className="glass-card card-2">
               <div className="glass-icon icon-cyan"><Signal size={20}/></div>
               <div className="content">
                  <h4>AI Drone Network</h4>
                  <p className="status text-gray">12 Active Drones</p>
                  <p className="sub-text">Scanning Area</p>
               </div>
            </div>

            {/* Card 3: Incidents */}
            <div className="glass-card card-3 warning-card">
               <div className="glass-icon icon-red"><Activity size={20}/></div>
               <div className="content">
                  <h4>Live Incidents</h4>
                  <p className="status text-red">24</p>
                  <p className="sub-text">Active Incidents</p>
               </div>
               <AlertTriangle size={16} className="warning-icon-right"/>
            </div>

            {/* Card 4: Robot */}
            <div className="glass-card card-4">
               <div className="glass-icon icon-cyan"><Bot size={20}/></div>
               <div className="content">
                  <h4>AI Assistant</h4>
                  <p className="status text-gray">RescueIQ AI</p>
                  <p className="sub-text"><span className="text-green mr-1">●</span>Online</p>
               </div>
            </div>

            {/* Card 5: Ambulance */}
            <div className="glass-card card-5">
               <div className="glass-icon icon-blue"><ShieldCheck size={20}/></div>
               <div className="content">
                  <h4>Active Units</h4>
                  <p className="status text-gray text-xl mt-1">38</p>
                  <p className="sub-text text-blue">On Mission</p>
               </div>
            </div>
          </motion.div>

          {/* Scroll to Explore */}
          <div className="scroll-indicator">
            <div className="mouse-icon">
              <div className="mouse-wheel"></div>
            </div>
            SCROLL TO EXPLORE
          </div>
        </div>
      </section>

      {/* ================= STATS PANEL ================= */}
      <section className="container" id="analytics">
        <div className="stats-panel">
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><Zap /></div>
              <div className="stat-info">
                <div className="stat-number font-space">14ms</div>
                <div className="stat-label">AVG. LATENCY</div>
                <div className="stat-subtext">Real-time response speed</div>
              </div>
            </div>
            <div className="stat-graph-container">
               <svg className="stat-graph-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                     <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                   </linearGradient>
                 </defs>
                 {[20, 40, 60, 80, 100, 120, 140, 160, 180].map(x => (
                   <line key={x} x1={x} y1="40" x2={x} y2="0" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="2,2"/>
                 ))}
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1.5, ease: "easeInOut" }}
                   d="M0 30 L 20 22 L 40 28 L 60 15 L 80 20 L 100 5 L 120 25 L 140 10 L 160 30 L 180 15 L 200 22" 
                   fill="none" stroke="#3b82f6" strokeWidth="2" 
                 />
                 <motion.path 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 0.3 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1, delay: 0.8 }}
                   d="M0 30 L 20 22 L 40 28 L 60 15 L 80 20 L 100 5 L 120 25 L 140 10 L 160 30 L 180 15 L 200 22 L 200 40 L 0 40 Z" 
                   fill="url(#blue-grad)" 
                 />
               </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><TrendingUp /></div>
              <div className="stat-info">
                <div className="stat-number font-space">82%</div>
                <div className="stat-label">RESPONSE UPLIFT</div>
                <div className="stat-subtext">AI optimized efficiency</div>
              </div>
            </div>
            <div className="stat-graph-container">
               <svg className="stat-graph-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                     <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                   </linearGradient>
                 </defs>
                 {[20, 40, 60, 80, 100, 120, 140, 160, 180].map(x => (
                   <line key={x} x1={x} y1="40" x2={x} y2="0" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="2,2"/>
                 ))}
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                   d="M0 25 L 20 30 L 40 15 L 60 25 L 80 10 L 100 20 L 120 5 L 140 22 L 160 12 L 180 28 L 200 15" 
                   fill="none" stroke="#10b981" strokeWidth="2" 
                 />
                 <motion.path 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 0.3 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1, delay: 1 }}
                   d="M0 25 L 20 30 L 40 15 L 60 25 L 80 10 L 100 20 L 120 5 L 140 22 L 160 12 L 180 28 L 200 15 L 200 40 L 0 40 Z" 
                   fill="url(#green-grad)" 
                 />
               </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><ShieldCheck /></div>
              <div className="stat-info">
                <div className="stat-number font-space">450+</div>
                <div className="stat-label">ACTIVE AGENCIES</div>
                <div className="stat-subtext">Connected worldwide</div>
              </div>
            </div>
            <div className="stat-graph-container">
               <svg className="stat-graph-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
                     <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                   </linearGradient>
                 </defs>
                 {[20, 40, 60, 80, 100, 120, 140, 160, 180].map(x => (
                   <line key={x} x1={x} y1="40" x2={x} y2="0" stroke="rgba(99,102,241,0.2)" strokeWidth="1" strokeDasharray="2,2"/>
                 ))}
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                   d="M0 20 L 20 25 L 40 10 L 60 28 L 80 15 L 100 25 L 120 8 L 140 20 L 160 5 L 180 22 L 200 18" 
                   fill="none" stroke="#6366f1" strokeWidth="2" 
                 />
                 <motion.path 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 0.3 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1, delay: 1.2 }}
                   d="M0 20 L 20 25 L 40 10 L 60 28 L 80 15 L 100 25 L 120 8 L 140 20 L 160 5 L 180 22 L 200 18 L 200 40 L 0 40 Z" 
                   fill="url(#purple-grad)" 
                 />
               </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><Users /></div>
              <div className="stat-info">
                <div className="stat-number font-space">1.2M</div>
                <div className="stat-label">LIVES IMPACTED</div>
                <div className="stat-subtext">Across all operations</div>
              </div>
            </div>
            <div className="stat-graph-container">
               <svg className="stat-graph-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="red-grad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                     <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                   </linearGradient>
                 </defs>
                 {[20, 40, 60, 80, 100, 120, 140, 160, 180].map(x => (
                   <line key={x} x1={x} y1="40" x2={x} y2="0" stroke="rgba(239,68,68,0.2)" strokeWidth="1" strokeDasharray="2,2"/>
                 ))}
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
                   d="M0 28 L 20 15 L 40 25 L 60 10 L 80 22 L 100 8 L 120 28 L 140 15 L 160 25 L 180 12 L 200 20" 
                   fill="none" stroke="#ef4444" strokeWidth="2" 
                 />
                 <motion.path 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 0.3 }}
                   viewport={{ once: false, margin: "-50px" }}
                   transition={{ duration: 1, delay: 1.4 }}
                   d="M0 28 L 20 15 L 40 25 L 60 10 L 80 22 L 100 8 L 120 28 L 140 15 L 160 25 L 180 12 L 200 20 L 200 40 L 0 40 Z" 
                   fill="url(#red-grad)" 
                 />
               </svg>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features container" id="features">
        <div className="section-header text-center">
          <div className="section-badge">
            <ShieldCheck size={16} />
            Tactical Advantage Protocol
          </div>
          <h2 className="section-title font-space">
            Engineered for the Frontline.
          </h2>
        </div>

        <div className="bento-grid">
           
           <div className="feature-card large">
             <div>
               <div className="feature-icon"><BrainCircuit size={24}/></div>
               <h3 className="feature-title font-space">Neural Triage Engine</h3>
               <p className="feature-desc max-w-md">Sub-10ms classification of multi-channel emergency signals using proprietary AI mesh networks. Processes satellite imagery and ground telemetry simultaneously.</p>
             </div>
             <div className="mt-8 flex items-center gap-4">
               <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030712] bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400">AI</div>
                  ))}
               </div>
               <span className="text-[12px] font-bold text-blue-400 uppercase tracking-widest">Active Neural Nodes: 12,402</span>
             </div>
           </div>

           {[
              { icon: Navigation, title: "Path Optimization", desc: "Real-time routing through structural debris." },
              { icon: Signal, title: "Mesh Comms", desc: "Zero-infrastructure communication layers." },
              { icon: Heart, title: "Biometric Link", desc: "Live telemetry for first-response units." },
              { icon: Globe, title: "Digital Twin", desc: "Sub-meter 3D replica of disaster zones." }
           ].map((f, i) => (
             <div key={i} className="feature-card small">
               <div>
                  <div className="feature-icon"><f.icon size={24}/></div>
                  <h3 className="feature-title font-space">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
               </div>
             </div>
           ))}

        </div>
      </section>

      {/* ================= CINEMATIC MAP PREVIEW ================= */}
      <section className="cinematic-section container" id="map">
        <div className="cinematic-grid">
           
           {/* LEFT VISUAL CONTAINER */}
           <div className="cinematic-visual">
             {/* Base map asset */}
             <img src={tacticalMapImg} alt="Tactical Map" className="tactical-map-asset" />
             
             {/* Ambient Lighting & Overlays */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
             
             {/* HUD Overlays - Status Pills */}
             <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                <div className="status-pill">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="status-pill-text">Satellite Uplink Active</span>
                </div>
                <div className="status-pill">
                   <Scan size={14} className="text-blue-400" />
                   <span className="status-pill-text">Regional Scan Complete</span>
                </div>
             </div>
             
             {/* Radar Sweep Animation overlay */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
               className="absolute w-[150%] h-[150%] rounded-full z-[1] pointer-events-none"
               style={{
                 background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 191, 255, 0.1) 60deg, transparent 60deg)'
               }}
             />
           </div>

           {/* RIGHT CONTENT AREA */}
           <div>
              <div className="cinematic-badge">
                <Globe size={16} />
                Global Spatial Intelligence
              </div>
              
              <h2 className="cinematic-heading font-space">
                Live Tactical Awareness.
              </h2>
              
              <p className="cinematic-desc">
                 Navigate disaster zones with a sub-meter precise Digital Twin. Our global mesh ensures situational awareness even when standard infrastructure is decimated, giving operators unparalleled control.
              </p>
              
              <button className="premium-cta-btn">
                 Explore the Grid <ArrowRight size={18} className="text-cyan-400" />
              </button>
           </div>
           
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 text-center container">
         <h2 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] font-space mb-10">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Survival.</span>
         </h2>
         <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium mb-12">
            Join the global network of agencies and NGOs already utilizing the RescueIQ neural layer to save lives.
         </p>
         <div className="flex justify-center gap-6">
            <button className="primary-btn" onClick={() => navigate('/signup')}>Get Started Now</button>
            <button className="secondary-btn">Contact Ops</button>
         </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer" id="about">
        <div className="container">
          <div className="footer-grid">
             <div className="footer-col">
                <div className="footer-brand font-space">Rescue<span>IQ</span></div>
                <p className="footer-desc">Empowering first responders with high-fidelity AI intelligence and autonomous coordination.</p>
                <div className="flex gap-4 mt-8">
                   <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-blue-600/20 cursor-pointer transition-colors"><Signal size={18}/></div>
                   <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-blue-600/20 cursor-pointer transition-colors"><Globe size={18}/></div>
                   <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-blue-600/20 cursor-pointer transition-colors"><Share2 size={18}/></div>
                </div>
             </div>
             
             <div className="footer-col">
                <h4>Tactical</h4>
                <ul>
                   <li><a href="#">Neural Core</a></li>
                   <li><a href="#">Digital Twin</a></li>
                   <li><a href="#">Satellite Mesh</a></li>
                   <li><a href="#">Drone Link</a></li>
                </ul>
             </div>

             <div className="footer-col">
                <h4>Agency</h4>
                <ul>
                   <li><a href="#">Mission Log</a></li>
                   <li><a href="#">Deployment</a></li>
                   <li><a href="#">Impact</a></li>
                   <li><a href="#">Global Fleet</a></li>
                </ul>
             </div>

             <div className="footer-col">
                <h4>Legal</h4>
                <ul>
                   <li><a href="#">Privacy</a></li>
                   <li><a href="#">Terms</a></li>
                   <li><a href="#">Compliance</a></li>
                   <li><a href="#">ISO-27001</a></li>
                </ul>
             </div>
          </div>
          
          <div className="footer-bottom">
             <div>© 2026 RESCUE_IQ OPERATIONAL_CORE</div>
             <div className="flex gap-8">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"/> PRIMARY NODE: STABLE</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"/> AI CLUSTER: OPTIMIZED</div>
             </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;
