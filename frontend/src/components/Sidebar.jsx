import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Map, Users, AlertTriangle, Shield, Radio, Home, Settings, LogOut, User } from 'lucide-react';
import clsx from 'clsx';
import useSosStore from '../store/useSosStore';
import useAuthStore from '../store/useAuthStore';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Map, label: 'Live Map', path: '/map' },
  { icon: Activity, label: 'Triage Queue', path: '/triage' },
  { icon: Users, label: 'Team Dispatch', path: '/teams' },
  { icon: Shield, label: 'Shelters', path: '/shelters' },
  { icon: Radio, label: 'Social Scanner', path: '/social' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const addReport = useSosStore((state) => state.addReport);
  const { logout, user } = useAuthStore();

  const handleSignOut = () => {
    if (window.confirm('Terminate current session?')) {
      logout();
      navigate('/login');
    }
  };

  const handleActivateMock = () => {
    const mockReport = {
      id: `SOS-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Flood Response',
      location: { lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1 },
      address: `Sector ${Math.floor(Math.random() * 100)}, Delhi`,
      callerName: 'Mock Operator',
      victimsCount: Math.floor(Math.random() * 5) + 1,
      severity: Math.random() > 0.5 ? 'CRITICAL' : 'INJURED',
      aiTrustScore: 98,
      isMedical: true,
      timeSinceRequest: 'Now',
      aiSummary: 'Mock distress signal for testing tactical dispatch flows.',
      transcript: 'This is a mock signal. Simulation active.',
      recommendedStrategy: 'Rapid land extraction.'
    };
    addReport(mockReport);
  };

  return (
    <aside className="w-64 bg-gray-950 border-r border-white/5 hidden md:flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <AlertTriangle className="w-7 h-7 text-critical transition-transform group-hover:scale-110" />
            <div className="absolute -inset-1 bg-critical/20 blur-md rounded-full animate-pulse" />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-white uppercase italic">
            Rescue<span className="text-critical">IQ</span>
          </span>
        </Link>
      </div>
      
      <div className="px-6 py-6 shrink-0">
        <div className="relative group overflow-hidden rounded-2xl border border-white/5 aspect-square bg-white/5 shadow-2xl">
          <img 
            src={user?.avatar || "/assets/command-bg.png"} 
            alt="Unit Profile" 
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-4 left-4">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Unit Status</p>
            <p className="text-xs font-black text-safe uppercase tracking-widest flex items-center gap-2">
              Optimal
              <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2 no-scrollbar">
        <div className="px-6 mb-4">
          <span className="heading-tactical">Mission Command</span>
        </div>

        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group',
                    isActive
                      ? 'bg-primary/10 text-white shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                  )}
                >
                  <item.icon className={clsx(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary' : 'text-slate-600 group-hover:text-slate-400'
                  )} />
                  <span className="font-medium text-sm tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#3b82f6]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3">
        <button 
          onClick={handleActivateMock}
          className="w-full py-3 rounded-xl border border-critical/30 bg-critical/5 text-critical text-[10px] font-black uppercase tracking-[0.2em] hover:bg-critical/10 active:scale-95 transition-all pulse-critical"
        >
          Activate Mock
        </button>
        
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white truncate">{user?.fullName || 'Operator'}</p>
            <button 
              onClick={handleSignOut}
              className="text-[9px] text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
