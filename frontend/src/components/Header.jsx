import { Search, Bell, User, Wifi } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-surface/50 border-b border-white/10 flex items-center justify-between px-6 backdrop-blur-md">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SOS ID, coordinates, or location..."
            className="w-full bg-background/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
          <Wifi className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Online</span>
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-critical rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-all">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
