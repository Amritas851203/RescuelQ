import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const useSocialStore = create((set, get) => ({
  alerts: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    active: 0,
    highRisk: 0,
    verified: 0
  },

  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/social/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const alerts = response.data;
      const stats = {
        total: alerts.length,
        active: alerts.filter(a => a.priority === 'Critical' || a.priority === 'High').length,
        highRisk: alerts.filter(a => a.riskLevel >= 9).length,
        verified: alerts.filter(a => a.isVerified).length
      };

      set({ alerts, stats, loading: false });
    } catch (error) {
      console.error('Fetch Alerts Error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch live intelligence data. Check network connectivity.', 
        loading: false 
      });
    }
  },

  convertToIncident: async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/social/convert`, { alertId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally remove the alert from the feed or mark as converted
      set(state => ({
        alerts: state.alerts.filter(a => a.id !== alertId)
      }));
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  }
}));

export default useSocialStore;
