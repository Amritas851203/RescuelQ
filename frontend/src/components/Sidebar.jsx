import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Map, Users, AlertTriangle, Shield, Radio, Home, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import useSosStore from '../store/useSosStore';
import useAuthStore from '../store/useAuthStore';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
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
    logout();
    navigate('/login');
  };

  const handleActivateMock = () => {
    const mockReport = {
      id: Date.now().toString(),
      type: 'Earthquake',
      location: `Sector ${Math.floor(Math.random() * 100)}`,
      affected_people: Math.floor(Math.random() * 1500) + 100,
      injury_severity: 9,
      risk_level: 10,
      resources: ['Medical Teams', 'Search & Rescue', 'Drones'],
      created_at: new Date().toISOString(),
      status: 'Pending',
    };
    addReport(mockReport);
  };

  return (
    <aside className="w-64 bg-surface border-r border-white/10 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="relative mr-3">
          <AlertTriangle className="w-8 h-8 text-critical animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-safe rounded-full border-2 border-surface"></div>
        </div>
        <h1 className="text-xl font-bold tracking-wider neon-text text-white italic">Rescue<span className="text-critical">IQ</span></h1>
      </div>
      
      <div className="px-6 py-6">
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 aspect-square">
          <img 
            src="/assets/operator.png" 
            alt="Operator Gear" 
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Unit Status</p>
            <p className="text-xs font-black text-safe uppercase tracking-widest">Optimal</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-6 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Active Operator</p>
            <p className="text-xs font-medium truncate text-white">{user?.fullName || 'Unauthorized'}</p>
            <p className="text-[9px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={clsx(
                  'flex items-center px-3 py-2 rounded-lg transition-colors',
                  location.pathname === item.path
                    ? 'bg-primary/20 text-primary neon-border'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <div 
          onClick={handleActivateMock}
          className="bg-critical/20 border border-critical/50 rounded-lg p-3 flex items-center justify-between pulse-critical cursor-pointer hover:bg-critical/30 transition-colors group"
        >
          <span className="text-sm font-bold text-critical tracking-widest group-hover:scale-105 transition-transform">ACTIVATE MOCK</span>
          <AlertTriangle className="w-4 h-4 text-critical" />
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
