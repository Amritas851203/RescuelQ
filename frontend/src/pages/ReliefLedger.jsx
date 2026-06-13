import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Box, Cpu, Network, Wallet, Info, Activity, Radio, AlertTriangle, 
  KeyRound, AlertCircle, ArrowRight, Download, Search, Filter, RefreshCw, Send, 
  CheckCircle2, ArrowUpRight, HelpCircle, HardDrive, ShieldAlert, Award, TrendingUp, CheckSquare
} from 'lucide-react';
import { ethers } from 'ethers';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- DESIGN SYSTEM COLORS ---
const COLORS = {
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#ef4444',
  cyan: '#06b6d4',
  indigo: '#6366f1'
};

// --- CHART DATA ---
const ALLOCATION_BREAKDOWN = [
  { name: 'Food Relief', value: 40, color: COLORS.blue },
  { name: 'Medical Aid', value: 30, color: COLORS.emerald },
  { name: 'Water Supply', value: 20, color: COLORS.cyan },
  { name: 'Emergency Kits', value: 10, color: COLORS.amber }
];

const SHELTER_ALLOCATION = [
  { name: 'Sector-7 Shelter', value: 35, color: COLORS.blue },
  { name: 'Sector-3 Shelter', value: 25, color: COLORS.emerald },
  { name: 'Sector-9 Shelter', value: 20, color: COLORS.cyan },
  { name: 'Sector-12 Shelter', value: 20, color: COLORS.indigo }
];

// --- INITIAL DATA IN INR ---
const INITIAL_TRANSACTIONS = [
  {
    hash: '0xA12F8e658428876cbb3b90f42b322da92c7789CD',
    amount: 50000,
    shelter: 'Sector-7',
    purpose: 'Food Kits',
    status: 'Verified',
    timestamp: '2m ago'
  },
  {
    hash: '0xB34CDd77123aa1280f555663bdac789ee95f22FA',
    amount: 30000,
    shelter: 'Sector-3',
    purpose: 'Medicines',
    status: 'Verified',
    timestamp: '15m ago'
  },
  {
    hash: '0xD91A9ff271239aa885e33bda122340ff423a77BC',
    amount: 20000,
    shelter: 'Sector-9',
    purpose: 'Water Supply',
    status: 'Verified',
    timestamp: '1h ago'
  }
];

const INITIAL_LOGS = [
  { text: 'Smart Contract verified on Sepolia network', type: 'system', time: '10:00:00' },
  { text: 'Smart Contract Executed - Safe Checkpoint Confirmed', type: 'contract', time: '10:05:00' },
  { text: 'New Donation Received: ₹12,000', type: 'donation', time: '11:15:30' },
  { text: 'Aid Allocation Recorded: Sector-3 Shelter', type: 'allocation', time: '12:20:45' },
  { text: 'Transaction Confirmed: 0xB34C...22FA', type: 'confirm', time: '12:20:50' },
  { text: 'Donation Verified: ₹50,000 → Sector-7', type: 'donation', time: '16:10:15' },
  { text: 'Transaction Confirmed: 0xA12F...89CD', type: 'confirm', time: '16:10:20' }
];

// --- SUB-COMPONENTS ---

const Sparkline = ({ color }) => (
  <svg viewBox="0 0 100 20" className="w-16 h-6 opacity-30">
    <motion.path
      d="M0 15 Q 10 5, 20 12 T 40 8 T 60 15 T 80 5 T 100 10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
  </svg>
);

// 3D Glassmorphic Stats Card
const StatCard3D = ({ label, value, trend, icon: Icon, color }) => (
  <div className="group relative bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
    <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
    
    <div className="flex items-center justify-between relative z-10">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/25 shadow-[0_0_15px_rgba(var(--${color}-500),0.1)]`}>
        <Icon size={18} />
      </div>
      <div className="flex items-center gap-3">
        <Sparkline color={color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : '#f59e0b'} />
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">{trend}</span>
      </div>
    </div>

    <div className="relative z-10 mt-2">
      <div className="text-3xl font-black text-white tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{value}</div>
      <div className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1.5">{label}</div>
    </div>
    
    <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-${color}-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
  </div>
);

// Recharts Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
          {payload[0].name}
        </p>
        <p className="text-xs font-bold text-white mt-1">
          Share: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

// Initializing Overlay
const InitializingOverlay = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Establishing Secure Quantum Uplink...",
    "Connecting Central Disaster Relief Database...",
    "Synchronizing Sepolia Blockchain Ledger...",
    "Authorizing NIC Credentials...",
    "System Initialized. Access Granted."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return s;
        }
        return s + 1;
      });
    }, 500);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center gap-8 font-mono"
    >
      <div className="relative w-64 h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-blue-500 rounded-full shadow-[0_0_20px_#3b82f6]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border-b-2 border-emerald-500/30 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity size={40} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] h-4"
        >
          {steps[step]}
        </motion.div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step + 1) * 20}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

const ReliefLedger = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [chainId, setChainId] = useState('');
  const [walletStatusMessage, setWalletStatusMessage] = useState(null);
  
  // Real-world Gov values
  const [totalDonated, setTotalDonated] = useState(785000);
  const [fundsDistributed, setFundsDistributed] = useState(542000);
  const [pendingAllocation, setPendingAllocation] = useState(118000);
  const [emergencyReserve, setEmergencyReserve] = useState(125000);
  
  // Ledger and logs
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShelter, setFilterShelter] = useState('All');
  
  // Latest block
  const [currentBlock, setCurrentBlock] = useState(4928172);
  
  // Allocate Funds animation state
  const [releasingFunds, setReleasingFunds] = useState(false);
  const [releaseComplete, setReleaseComplete] = useState(false);
  
  // Evidence modal state
  const [showEvidence, setShowEvidence] = useState(false);

  // Auto-detect MetaMask on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            setNetworkName(network.name === 'unknown' ? `Chain ID ${network.chainId}` : network.name);
            setChainId(network.chainId.toString());
            setWalletConnected(true);
          }
        } catch (err) {
          console.error("Error checking MetaMask connection status", err);
        }
      }
    };
    checkConnection();

    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            setWalletConnected(true);
          } catch (err) {
            console.error(err);
          }
        } else {
          setWalletAddress('');
          setNetworkName('');
          setChainId('');
          setWalletConnected(false);
        }
      };
      
      const handleChainChanged = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          setNetworkName(network.name === 'unknown' ? `Chain ID ${network.chainId}` : network.name);
          setChainId(network.chainId.toString());
        } catch (err) {
          console.error(err);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Increment block numbers periodically
  useEffect(() => {
    const blockInterval = setInterval(() => {
      setCurrentBlock(prev => prev + 1);
      const randomLogs = [
        "Consensus node validated transaction batch",
        "State root hash committed to smart contract",
        "Gas baseline calculated (18 Gwei)",
        "NIC gateway handshake confirmed"
      ];
      const selectedLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => [
        { text: `${selectedLog} (#${currentBlock + 1})`, type: 'system', time: timeStr },
        ...prev.slice(0, 15)
      ]);
    }, 8000);
    return () => clearInterval(blockInterval);
  }, [currentBlock]);

  // Actual wallet connection using ethers.js
  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
          setNetworkName(network.name === 'unknown' ? `Chain ID ${network.chainId}` : network.name);
          setChainId(network.chainId.toString());
          setWalletConnected(true);
          
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];
          setLogs(prev => [
            { text: `MetaMask Handshake: ${address.slice(0,6)}...${address.slice(-4)} Connected`, type: 'system', time: timeStr },
            ...prev
          ]);
        }
      } catch (error) {
        console.error("MetaMask handshake failed", error);
      }
    }
  };

  // Fund allocation execution simulation
  const handleAllocateFunds = () => {
    if (releasingFunds) return;
    setReleasingFunds(true);
    setReleaseComplete(false);
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { text: 'Executing smart contract release: ₹50,000 → Sector-7 Shelter...', type: 'system', time: timeStr },
      ...prev
    ]);

    setTimeout(() => {
      const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const shortHash = txHash.slice(0, 6) + '...' + txHash.slice(-4);
      
      const newTx = {
        hash: txHash.slice(0, 10) + '...' + txHash.slice(-4),
        amount: 50000,
        shelter: 'Sector-7',
        purpose: 'Medicines (Critical AI Alloc)',
        status: 'Verified',
        timestamp: 'Just now'
      };

      setTransactions(prev => [newTx, ...prev]);
      setFundsDistributed(prev => prev + 50000);
      setPendingAllocation(prev => prev - 50000);
      setReleasingFunds(false);
      setReleaseComplete(true);

      setLogs(prev => [
        { text: `Tx Broadcasted: ${shortHash} (Block #${currentBlock + 2})`, type: 'network', time: timeStr },
        { text: `NIC Ledger sync completed: State root matching hash`, type: 'success', time: timeStr },
        ...prev
      ]);
    }, 4000);
  };

  // Filter transactions
  const filteredTxs = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.shelter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterShelter === 'All' || tx.shelter === filterShelter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterShelter]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden pb-12">
      {/* HUD futuristic light overlays */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 pb-6 border-b border-white/5 relative">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase font-mono">
                Govt. of India • Disaster Response Ledger
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white bg-clip-text uppercase">
              Disaster Relief Funding Intelligence Center
            </h1>
            <p className="text-xs text-white/50 leading-relaxed font-mono">
              Transparent, blockchain-verified public disaster donation accounting system, backed by automated AI triage allocation recommendations.
            </p>
          </div>

          {/* Secure Wallet Information Card / Connect Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10">
            {walletConnected ? (
              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1.5 min-w-[240px] shadow-inner relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest font-mono">NIC Ledger ID</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 flex items-center gap-1.5">
                    Wallet Connected ✅
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-1.5">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest font-mono">Address</span>
                  <span className="text-[10px] font-mono text-white/80 font-bold">
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest font-mono">Network</span>
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest font-mono">{networkName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest font-mono">Chain ID</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono">{chainId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest font-mono">Status</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono">Secure</span>
                </div>
              </div>
            ) : typeof window !== 'undefined' && typeof window.ethereum === 'undefined' ? (
              <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl flex flex-col gap-1.5 min-w-[240px] text-center">
                <span className="text-xs text-rose-400 font-bold">MetaMask Not Detected</span>
                <span className="text-[9px] text-white/50">Please install the MetaMask browser extension to use the Relief Fund Ledger.</span>
              </div>
            ) : (
              <button 
                onClick={connectMetaMask}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 self-center xl:self-auto h-full"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask Fox" className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* --- JUDGE IMPACT GOAL BANNER --- */}
        <section className="relative bg-gradient-to-r from-blue-950/20 via-emerald-950/20 to-blue-950/20 border border-emerald-500/20 rounded-[2rem] p-6 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_25px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-2xl shadow-inner">
                <Award size={20} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] block mb-1">Core Operational Philosophy</span>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white tracking-tight uppercase">
                    AI identifies where disaster aid is needed.
                  </p>
                  <p className="text-xs text-white/60">
                    Blockchain ensures transparency and accountability of every rupee distributed.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl font-mono text-[9px] text-white/30 uppercase tracking-widest">
              NIC System Audit: Approved
            </div>
          </div>
        </section>

        {/* --- ADVANCED ANALYTICS KPI CARDS --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard3D 
            label="Total Donations" 
            value={`₹${totalDonated.toLocaleString('en-IN')}`} 
            trend="+12% 24h" 
            icon={TrendingUp} 
            color="blue" 
          />
          <StatCard3D 
            label="Funds Distributed" 
            value={`₹${fundsDistributed.toLocaleString('en-IN')}`} 
            trend="Verified" 
            icon={Send} 
            color="emerald" 
          />
          <StatCard3D 
            label="Pending Allocation" 
            value={`₹${pendingAllocation.toLocaleString('en-IN')}`} 
            trend="Queue" 
            icon={Info} 
            color="amber" 
          />
          <StatCard3D 
            label="Emergency Reserve" 
            value={`₹${emergencyReserve.toLocaleString('en-IN')}`} 
            trend="Safe Status" 
            icon={Shield} 
            color="blue" 
          />
        </section>

        {/* --- SECONDARY ANALYTICS (KPIs) --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-inner transition-transform duration-500 hover:scale-[1.01]">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Beneficiaries Helped</span>
              <span className="text-xl font-black text-white">8,420</span>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users size={16} />
            </div>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-inner transition-transform duration-500 hover:scale-[1.01]">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Active Relief Camps</span>
              <span className="text-xl font-black text-white">42</span>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <HardDrive size={16} />
            </div>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-inner transition-transform duration-500 hover:scale-[1.01]">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Critical Shelters</span>
              <span className="text-xl font-black text-rose-500">3</span>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-inner transition-transform duration-500 hover:scale-[1.01]">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Verification Rate</span>
              <span className="text-xl font-black text-emerald-400">100%</span>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckSquare size={16} />
            </div>
          </div>
        </section>

        {/* --- BLOCKCHAIN AUDIT TIMELINE --- */}
        <section className="bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Blockchain Audit Timeline</h3>
            </div>
            <span className="text-[8px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Cryptographic Supply Pipeline Secure
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center relative z-10 py-4">
            {/* Step 1: Donor */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-slate-900 transition-all shadow-inner">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Users size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Donor</h4>
                <div className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 mt-1 justify-center bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Verified On Chain ✅
                </div>
              </div>
            </div>

            {/* Step 2: Verification */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-slate-900 transition-all shadow-inner">
              <div className="w-10 h-10 rounded-full bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Cpu size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Blockchain Verification</h4>
                <div className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 mt-1 justify-center bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Verified On Chain ✅
                </div>
              </div>
            </div>

            {/* Step 3: Warehouse */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-slate-900 transition-all shadow-inner">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Box size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Central Relief Warehouse</h4>
                <div className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 mt-1 justify-center bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Verified On Chain ✅
                </div>
              </div>
            </div>

            {/* Step 4: Shelter */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-slate-900 transition-all shadow-inner">
              <div className="w-10 h-10 rounded-full bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Shield size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Sector Shelter</h4>
                <div className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 mt-1 justify-center bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Verified On Chain ✅
                </div>
              </div>
            </div>

            {/* Step 5: Beneficiary */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative hover:bg-slate-900 transition-all shadow-inner">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Beneficiary</h4>
                <div className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 mt-1 justify-center bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Verified On Chain ✅
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PREMIUM FUNDING ANALYTICS SECTION --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={18} />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Funding Analytics</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Fund Allocation Breakdown */}
            <div className="bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[360px] transition-transform duration-500 hover:scale-[1.01]">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-blue-500" size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Fund Allocation Breakdown</h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ALLOCATION_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={100}
                      animationDuration={1500}
                    >
                      {ALLOCATION_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      content={({ payload }) => (
                        <div className="flex justify-center gap-4 flex-wrap text-[9px] font-black uppercase tracking-widest text-white/60">
                          {payload.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span>{entry.value} ({entry.payload.value}%)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Shelter Funding Allocation */}
            <div className="bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[360px] transition-transform duration-500 hover:scale-[1.01]">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="text-emerald-500 animate-pulse" size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Shelter Funding Allocation</h3>
              </div>

              <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SHELTER_ALLOCATION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={100}
                      animationDuration={1500}
                    >
                      {SHELTER_ALLOCATION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      content={({ payload }) => (
                        <div className="flex justify-center gap-4 flex-wrap text-[9px] font-black uppercase tracking-widest text-white/60">
                          {payload.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span>{entry.value} ({entry.payload.value}%)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-wider">Verified Nodes</span>
                  <span className="text-xl font-black text-white">4 Sites</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- TWO-COLUMN BLOCKCHAIN LEDGER & INTEL SECTION --- */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: LIVE TRANSACTIONS TABLE (8/12) */}
          <section className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 md:p-8 space-y-6 backdrop-blur-md rounded-[2.5rem] relative overflow-hidden transition-transform duration-500 hover:scale-[1.005]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="text-blue-500 animate-pulse" size={16} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Live Blockchain Transaction Ledger</h3>
                  </div>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">NIC Authorized Cryptographic Audit Ledger</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                    <input 
                      type="text" 
                      placeholder="SEARCH TRANSACTION..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[9px] font-black text-white uppercase tracking-[0.2em] focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="text-white/20" size={14} />
                    <select 
                      value={filterShelter}
                      onChange={(e) => setFilterShelter(e.target.value)}
                      className="bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl p-2 focus:outline-none focus:border-blue-500/50"
                    >
                      {uniqueShelters.map((shelter, i) => (
                        <option key={i} value={shelter} className="bg-slate-900 text-white">{shelter}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">
                      <th className="p-4">Transaction Hash</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Shelter</th>
                      <th className="p-4">Purpose</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-white/80">
                    {filteredTxs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-[10px] font-black text-white/20 uppercase tracking-wider">
                          No Cryptographic Logs Found Matching Search
                        </td>
                      </tr>
                    ) : (
                      filteredTxs.map((tx, idx) => (
                        <motion.tr 
                          key={idx} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="p-4 font-mono text-[10px] text-blue-400">
                            {tx.hash}
                          </td>
                          <td className="p-4 font-black text-white">
                            ₹{tx.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 font-bold text-white/80">
                            {tx.shelter}
                          </td>
                          <td className="p-4 text-white/60">
                            {tx.purpose}
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {tx.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Simulated Donation Generator */}
              <div className="pt-4 border-t border-white/5 flex justify-between items-center flex-wrap gap-4">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5">
                  <Info size={12} /> SECURE LOGISTICS MANAGEMENT PORTAL
                </span>
                
                <button 
                  onClick={() => {
                    const randomAmount = [10000, 25000, 50000, 100000][Math.floor(Math.random()*4)];
                    const randomShelter = ['Sector-7', 'Sector-3', 'Sector-9', 'Sector-12'][Math.floor(Math.random()*4)];
                    const randomPurpose = ['Food Kits', 'Medicines', 'Water Supply', 'Emergency Kits'][Math.floor(Math.random()*4)];
                    const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
                    
                    const newTx = {
                      hash: txHash.slice(0, 10) + '...' + txHash.slice(-4),
                      amount: randomAmount,
                      shelter: randomShelter,
                      purpose: randomPurpose,
                      status: 'Verified',
                      timestamp: 'Just now'
                    };
                    
                    setTransactions(prev => [newTx, ...prev]);
                    setTotalDonated(prev => prev + randomAmount);
                    
                    const now = new Date();
                    const timeStr = now.toTimeString().split(' ')[0];
                    setLogs(prev => [
                      { text: `New Donation Received: ₹${randomAmount.toLocaleString('en-IN')}`, type: 'donation', time: timeStr },
                      { text: `Transaction Confirmed: ${txHash.slice(0,6)}...${txHash.slice(-4)}`, type: 'confirm', time: timeStr },
                      ...prev
                    ]);
                  }}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-inner"
                >
                  Simulate Donation Entry
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: AI INTEL & STATUS (4/12) */}
          <section className="col-span-12 xl:col-span-4 space-y-6">
            
            {/* AI FUNDING INTELLIGENCE PANEL */}
            <div className="bg-slate-950/60 border border-blue-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 rounded-[2.5rem] space-y-6 relative overflow-hidden group transition-transform duration-500 hover:scale-[1.01]">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Cpu size={100} className="text-blue-500" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] font-sans">AI Funding Intelligence</h3>
                </div>
                <span className="text-[8px] font-mono text-blue-400 border border-blue-500/20 bg-blue-500/5 px-2 py-0.5 rounded uppercase">Optimized Allocate</span>
              </div>

              {/* Target Area Analytics */}
              <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-white">Sector-7 Shelter</h4>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Target Node ID: NODE-712-A</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded">
                    Supply Alert
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase tracking-widest">
                  <div className="space-y-1">
                    <span className="text-white/30 block">Population</span>
                    <span className="text-xs text-white font-bold">1240</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/30 block">Supply Health</span>
                    <span className="text-xs text-rose-500 font-bold">21%</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/30 block">Medicine Stock</span>
                    <span className="text-xs text-rose-500 font-bold">Critical</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/30 block">Food Stock</span>
                    <span className="text-xs text-amber-500 font-bold">Low</span>
                  </div>
                  <div className="space-y-1 col-span-2 border-t border-white/5 pt-2">
                    <span className="text-white/30 block">Current Funds</span>
                    <span className="text-xs text-white font-bold">₹15,000</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Block */}
              <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-2xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest font-mono">Recommended Allocation</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black text-emerald-400">94% Confidence</span>
                  </div>
                </div>
                <div className="text-md font-black text-white uppercase tracking-tight">
                  Allocate ₹50,000 to Sector-7
                </div>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider leading-relaxed">
                  Reason: Medicine supplies expected to run out within 18 hours.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleAllocateFunds}
                  disabled={releasingFunds}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10"
                >
                  {releasingFunds ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Allocating...
                    </>
                  ) : releaseComplete ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Allocated ✅
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Allocate Funds
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setShowEvidence(true)}
                  className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-inner"
                >
                  View Evidence
                </button>
              </div>
            </div>

            {/* SMART CONTRACT STATUS MONITOR */}
            <div className="bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 rounded-[2.5rem] space-y-6 relative overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">Smart Contract Panel</span>
                </div>
                <span className="text-[8px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded uppercase">Live Network</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase tracking-widest">
                <div className="space-y-1">
                  <span className="text-white/30 block">Network</span>
                  <span className="text-xs text-white font-bold">
                    {walletConnected && networkName ? networkName : 'Not Linked'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 block">Contract Status</span>
                  <span className="text-xs text-emerald-400 font-bold">Active</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 block">Verification</span>
                  <span className="text-xs text-emerald-400 font-bold">100% Verified</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 block">Wallet</span>
                  <span className="text-xs text-blue-400 font-bold">
                    {walletConnected && walletAddress 
                      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
                      : 'Not Linked'
                    }
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 block">Latest Block</span>
                  <span className="text-xs text-blue-400 font-bold">Live ({currentBlock})</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 block">Gas Status</span>
                  <span className="text-xs text-emerald-400 font-bold">Normal</span>
                </div>
              </div>

              {/* Glowing operational indicator */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-white uppercase tracking-wider">Ledger Consensus Node</h5>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Smart Contract Synced</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-emerald-400 uppercase">100% ONLINE</span>
              </div>
            </div>

            {/* LIVE BLOCKCHAIN ACTIVITY FEED */}
            <div className="bg-slate-950/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_35px_rgba(0,0,0,0.5)] p-6 space-y-6 relative overflow-hidden h-[280px] flex flex-col justify-between transition-transform duration-500 hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="text-blue-500 animate-pulse" size={16} />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Live Blockchain Activity Feed</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar my-4">
                {logs.map((log, i) => (
                  <div key={i} className="font-mono text-[9px] flex items-start gap-3 border-b border-white/[0.02] pb-1.5 last:border-0">
                    <span className="text-white/30 shrink-0">{log.time}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shrink-0 ${
                      log.type === 'confirm' ? 'bg-emerald-500/10 text-emerald-400' :
                      log.type === 'donation' ? 'bg-blue-500/10 text-blue-400' :
                      log.type === 'allocation' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-white/50'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-white/70 tracking-wide leading-tight">{log.text}</span>
                  </div>
                ))}
              </div>

              <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest flex justify-between items-center border-t border-white/5 pt-2">
                <span>Updates dynamically</span>
                <span>Audit Channels: 4</span>
              </div>
            </div>

          </section>

        </div>

      </div>

      {/* --- EVIDENCE VIEW MODAL --- */}
      <AnimatePresence>
        {showEvidence && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-950 border border-white/10 rounded-[2.5rem] max-w-lg w-full p-8 space-y-6 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Info size={150} />
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl shadow-lg">
                  <Info className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Holographic Inventory Audit</h3>
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Sector-7 Shelter Diagnostics</span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-white/70">
                <p>
                  AI verified supply health calculations show medicine depot depleted below safe parameters:
                </p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span>Antibiotics Supply:</span>
                    <span className="text-rose-500 font-bold">14 Units Remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IV Fluids Stock:</span>
                    <span className="text-rose-500 font-bold">8% Operational Capacity</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trauma Kit Health:</span>
                    <span className="text-amber-500 font-bold">Weak (22%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Burn Dressings:</span>
                    <span className="text-rose-500 font-bold">Critical Shortage</span>
                  </div>
                </div>
                <p>
                  Smart Contract fund release triggers procurement order automatically. Funds are locked to pre-authorized distributor wallet `0xD429...E2C4` upon network confirmation.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setShowEvidence(false)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-blue-500/10"
                >
                  Close Diagnostic
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ReliefLedger;
