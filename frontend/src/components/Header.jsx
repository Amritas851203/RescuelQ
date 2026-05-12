import { Search, Bell, User, Wifi, LogOut, ShieldCheck, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleLogout = () => {
    if (window.confirm('Terminate current session and logout?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="h-16 bg-surface/50 border-b border-white/10 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center flex-1">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SOS ID, coordinates, or location..."
            className="w-full bg-background/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-safe/10 border border-safe/30 rounded-full">
          <Wifi className="w-3 h-3 text-safe" />
          <span className="text-[10px] font-bold text-safe uppercase tracking-widest">Network Online</span>
        </div>
        
        <button 
          onClick={() => alert('No new emergency notifications.')}
          className="relative p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-critical rounded-full border-2 border-surface animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-white/10 relative">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-white tracking-tight">{user?.fullName || 'Operator'}</p>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Active Duty</p>
          </div>
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="Operator Profile"
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all group ${isProfileOpen ? 'bg-primary/40 border-primary/50' : 'bg-primary/20 border-primary/30'} border`}
          >
            <User className={`w-5 h-5 transition-all ${isProfileOpen ? 'text-white' : 'text-primary'}`} />
          </button>

          {/* Profile Dropdown Modal */}
          {isProfileOpen && (
            <div className="absolute top-14 right-0 w-72 bg-surface border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
              
              <div className="flex items-center space-x-4 mb-6 pt-2">
                <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{user?.fullName || 'Operator'}</h3>
                  <div className="flex items-center text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
                    Verified Responder
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center p-2 bg-background/50 rounded-lg border border-white/5 text-left">
                  <Mail className="w-4 h-4 text-slate-500 mr-3" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Operational Email</p>
                    <p className="text-xs text-white truncate">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-background/50 rounded-lg border border-white/5 text-left">
                  <Clock className="w-4 h-4 text-slate-500 mr-3" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Shift Status</p>
                    <p className="text-xs text-safe font-bold uppercase">12:45 ACTIVE</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-critical/10 hover:bg-critical/20 border border-critical/30 rounded-xl text-critical text-xs font-bold transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
