import { Search, Bell, User, Wifi, LogOut, ShieldCheck, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/map': return 'Live Tactical Map';
      case '/triage': return 'Triage Intelligence';
      case '/teams': return 'Team Dispatch Command';
      case '/shelters': return 'Resource Management';
      case '/social': return 'Social Scanner';
      case '/settings': return 'System Settings';
      default: return 'Command Center';
    }
  };
  
  const handleLogout = () => {
    if (window.confirm('Terminate current session and logout?')) {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <header className="h-16 bg-gray-950/50 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-sm font-display font-bold text-white uppercase tracking-widest hidden xl:block">
          {getPageTitle()}
        </h1>
        
        <div className="relative w-80 group hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Global search intelligence..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-safe/5 border border-safe/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
          <span className="text-[9px] font-bold text-safe uppercase tracking-widest">Neural Link: Active</span>
        </div>
        
        <button className="relative p-2 text-slate-500 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-critical rounded-full" />
        </button>
        
        <div className="relative border-l border-white/5 pl-6 ml-2">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/[0.03] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all">
              <User size={16} className="text-primary" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-bold text-white leading-none">{user?.fullName?.split(' ')[0] || 'Operator'}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">L-4 Cmdr</p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-14 right-0 w-64 glass-panel p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                  {user?.fullName?.charAt(0) || 'O'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">{user?.fullName || 'Operator'}</h3>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-1 mb-4 border-t border-white/5 pt-4">
                <div className="flex items-center gap-3 px-3 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Clock size={14} /> Shift: 08:42 Active
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-safe" /> Verified Session
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-critical/10 hover:bg-critical/20 border border-critical/30 rounded-xl text-critical text-[10px] font-black tracking-widest transition-all group"
              >
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                TERMINATE SESSION
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
