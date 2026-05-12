import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Activity, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';
import useSosStore from '../store/useSosStore';

const DISASTER_ICONS = {
  Fire: Flame,
  Flood: Droplets,
  Earthquake: Activity,
  'Gas Leak': Wind,
  Default: AlertTriangle
};

const calculateAIScore = (report) => {
  // AI Logic: Normalize factors to 0-100 scale
  const riskFactor = (report.risk_level || 5) * 4; // 40% weight
  const injuryFactor = (report.injury_severity || 5) * 3; // 30% weight
  const populationFactor = Math.min((report.affected_people || 0) / 10, 10) * 3; // 30% weight, max 100 people for max score

  const totalScore = riskFactor + injuryFactor + populationFactor;
  
  let priority = 'Low';
  if (totalScore > 80) priority = 'Critical';
  else if (totalScore > 60) priority = 'High';
  else if (totalScore > 30) priority = 'Medium';

  return { score: Math.round(totalScore), priority };
};

const TriageCard = ({ report, onUpdateStatus }) => {
  const { score, priority } = useMemo(() => calculateAIScore(report), [report]);
  const Icon = DISASTER_ICONS[report.type] || DISASTER_ICONS.Default;
  
  const priorityColors = {
    Critical: 'text-critical border-critical/50 bg-critical/10 pulse-critical',
    High: 'text-warning border-warning/50 bg-warning/10',
    Medium: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10',
    Low: 'text-safe border-safe/50 bg-safe/10'
  };

  const statusColors = {
    Pending: 'bg-slate-700 text-slate-300',
    'Team Assigned': 'bg-primary/20 text-primary border border-primary/30',
    Resolved: 'bg-safe/20 text-safe border border-safe/30'
  };

  return (
    <div className={`glass-panel p-4 transition-all hover:scale-[1.01] border-l-4 ${
      priority === 'Critical' ? 'border-l-critical' : 
      priority === 'High' ? 'border-l-warning' : 
      priority === 'Medium' ? 'border-l-yellow-400' : 'border-l-safe'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${priorityColors[priority]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-lg">{report.type}</h4>
            <div className="flex items-center text-xs text-slate-400">
              <MapPin className="w-3 h-3 mr-1" />
              {report.location}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${priorityColors[priority]}`}>
            {priority} • AI Score: {score}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-end">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center text-xs text-slate-400">
            <Users className="w-3 h-3 mr-1" />
            Affected: <span className="text-white ml-1 font-medium">{report.affected_people}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Severity: <span className="text-white ml-1 font-medium">{report.injury_severity}/10</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center text-xs text-slate-400">
            <Truck className="w-3 h-3 mr-1" />
            ETA: <span className="text-white ml-1 font-medium">12 mins</span>
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <Activity className="w-3 h-3 mr-1" />
            Risk: <span className="text-white ml-1 font-medium">{report.risk_level}/10</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Required Resources</p>
        <div className="flex flex-wrap gap-1">
          {report.resources?.map((res, idx) => (
            <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
              {res}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className={`text-[10px] px-2 py-1 rounded-md font-medium ${statusColors[report.status]}`}>
          {report.status}
        </div>
        <div className="flex space-x-2">
          {report.status === 'Pending' && (
            <button 
              onClick={() => onUpdateStatus(report.id, 'Team Assigned')}
              className="text-[10px] bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-md flex items-center transition-colors"
            >
              Dispatch Team <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          )}
          {report.status === 'Team Assigned' && (
            <button 
              onClick={() => onUpdateStatus(report.id, 'Resolved')}
              className="text-[10px] bg-safe hover:bg-safe/80 text-white px-3 py-1.5 rounded-md flex items-center transition-colors"
            >
              Mark Resolved <CheckCircle2 className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TriageQueue = () => {
  const { reports, updateReportStatus } = useSosStore();
  const [filterType, setFilterType] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const filteredAndSortedReports = useMemo(() => {
    let result = reports.map(r => ({ ...r, ...calculateAIScore(r) }));

    if (filterType !== 'All') {
      result = result.filter(r => r.type === filterType);
    }

    if (filterPriority !== 'All') {
      result = result.filter(r => r.priority === filterPriority);
    }

    // Sort by priority (Critical > High > Medium > Low) and then by score
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return result.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.score - a.score;
    });
  }, [reports, filterType, filterPriority]);

  const disasterTypes = ['All', ...new Set(reports.map(r => r.type))];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold tracking-tight">Smart Triage Queue</h3>
          <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/30">
            AI POWERED
          </span>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <div className="flex items-center bg-surface/50 border border-white/10 rounded-lg px-2 py-1">
            <Filter className="w-3 h-3 text-slate-400 mr-2" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs outline-none border-none pr-4 cursor-pointer"
            >
              {disasterTypes.map(t => <option key={t} value={t} className="bg-surface text-white">{t}</option>)}
            </select>
          </div>
          <div className="flex items-center bg-surface/50 border border-white/10 rounded-lg px-2 py-1">
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-xs outline-none border-none pr-4 cursor-pointer"
            >
              {priorities.map(p => <option key={p} value={p} className="bg-surface text-white">{p} Priority</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-6">
        {filteredAndSortedReports.length > 0 ? (
          filteredAndSortedReports.map((report) => (
            <TriageCard 
              key={report.id} 
              report={report} 
              onUpdateStatus={updateReportStatus}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 glass-panel border-dashed border-2">
            <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
            <p>No active incidents matching filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriageQueue;
