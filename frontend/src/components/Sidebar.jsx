import { Link, useLocation } from 'react-router-dom';
import { Activity, Map, Users, AlertTriangle, Shield, Radio, Menu, Home, Settings } from 'lucide-react';
import clsx from 'clsx';

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

  return (
    <aside className="w-64 bg-surface border-r border-white/10 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <AlertTriangle className="w-8 h-8 text-critical mr-3 animate-pulse" />
        <h1 className="text-xl font-bold tracking-wider neon-text text-white">RescueIQ</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
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
      <div className="p-4 border-t border-white/10">
        <div className="bg-critical/20 border border-critical/50 rounded-lg p-3 flex items-center justify-between pulse-critical cursor-pointer">
          <span className="text-sm font-bold text-critical tracking-widest">ACTIVATE MOCK</span>
          <AlertTriangle className="w-4 h-4 text-critical" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
