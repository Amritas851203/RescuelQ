import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuthStore';

const API_URL = '/api/social';

const useSocialStore = create((set, get) => ({
  alerts: [],
  stats: {
    totalEmergencies: 0,
    highRiskZones: 0,
    verifiedIncidents: 0,
    peopleAffected: 0,
    medicalNeeded: 0,
    rescueTeams: 0,
    evacuationAreas: 0,
    weatherThreat: 'STABLE',
    infrastructureDamage: 'N/A',
    commFailures: 0
  },
  loading: false,
  isProcessing: false,
  error: null,

  setAlerts: (newAlerts) => set({ alerts: newAlerts }),
  setStats: (newStats) => set({ stats: newStats }),

  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(`${API_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      set({ 
        alerts: data.alerts || [], 
        stats: data.stats || get().stats,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Satellite Uplink Failed', 
        loading: false 
      });
    }
  },

  convertToIncident: async (alert) => {
    set({ isProcessing: true });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post(`${API_URL}/convert`, { alert }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success') {
        const { alerts } = get();
        set({ 
          alerts: alerts.filter(a => a.id !== alert.id),
          isProcessing: false
        });
        return true;
      }
    } catch (err) {
      console.error('Promotion failed:', err);
      set({ isProcessing: false });
      return false;
    }
  },

  archiveAlert: async (alertId) => {
    set({ isProcessing: true });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post(`${API_URL}/archive`, { alertId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success') {
        const { alerts } = get();
        set({ 
          alerts: alerts.filter(a => a.id !== alertId),
          isProcessing: false
        });
        return true;
      }
    } catch (err) {
      console.error('Archiving failed:', err);
      set({ isProcessing: false });
      return false;
    }
  }
}));

export default useSocialStore;
