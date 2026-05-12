import React, { useEffect } from 'react';
import { AlertCircle, Users, Shield, Map as MapIcon, TrendingUp, Clock } from 'lucide-react';
import useSosStore from '../store/useSosStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TriageQueue from '../components/TriageQueue';

const data = [
  { name: '00:00', reports: 4 },
  { name: '04:00', reports: 7 },
  { name: '08:00', reports: 12 },
  { name: '12:00', reports: 25 },
  { name: '16:00', reports: 18 },
  { name: '20:00', reports: 10 },
  { name: '23:59', reports: 6 },
];

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="glass-panel p-4 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && <span className="text-xs text-green-500 font-medium">{trend}</span>}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { reports, fetchReports } = useSosStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight neon-text">Mission Command Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>System Status: <span className="text-safe">Operational</span> • {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={AlertCircle} 
          label="Active SOS" 
          value={reports.length} 
          color="bg-critical" 
          trend="+2 in last hour"
        />
        <StatCard 
          icon={Users} 
          label="Rescue Teams" 
          value="48" 
          color="bg-primary" 
        />
        <StatCard 
          icon={Shield} 
          label="Safe Shelters" 
          value="156" 
          color="bg-safe" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Est. Victims" 
          value="1,204" 
          color="bg-warning" 
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Emergency Incident Trend
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2 border-dashed">
              <Shield className="w-10 h-10 text-primary opacity-50" />
              <h4 className="font-medium text-slate-300">Resource Allocation</h4>
              <p className="text-xs text-slate-500">Global fleet optimization active</p>
            </div>
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2 border-dashed">
              <MapIcon className="w-10 h-10 text-safe opacity-50" />
              <h4 className="font-medium text-slate-300">Live Map Overlay</h4>
              <p className="text-xs text-slate-500">12 drones currently patrolling</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col min-h-0">
          <TriageQueue />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
