import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuthStore';

const API_URL = '/api';

const useSosStore = create((set, get) => ({
  reports: [],
  isLoading: false,
  error: null,

  fetchReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No authorization token found');
      
      const response = await axios.get(`${API_URL}/sos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ reports: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, isLoading: false });
    }
  },

  addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
  setReports: (reports) => set({ reports }),
  updateReportStatus: async (id, status) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      
      // Optimistic UI update
      set((state) => ({
        reports: state.reports.map((r) => r.id === id ? { ...r, status } : r)
      }));

      // Persist to backend
      await axios.put(`${API_URL}/sos/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to update SOS status:', err);
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useSosStore;
