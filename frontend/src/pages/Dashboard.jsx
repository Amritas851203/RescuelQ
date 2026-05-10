import { AlertCircle, Users, Shield, Map as MapIcon, TrendingUp, Clock } from 'lucide-react';
import useSosStore from '../store/useSosStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const reports = useSosStore((state) => state.reports);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Mission Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={AlertCircle} 
          label="Active SOS" 
          value={reports.length || "12"} 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Incident Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="reports" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Live Activity Feed</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 border-l-2 border-primary/30 pl-3 py-1">
                <div className="flex-1">
                  <p className="text-sm font-medium">New SOS report from Chembur</p>
                  <p className="text-xs text-slate-400">2 minutes ago • Urgency: 85%</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs text-primary hover:underline self-start">View All Alerts →</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
