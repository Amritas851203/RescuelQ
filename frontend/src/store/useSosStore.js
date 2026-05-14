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

  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
  setReports: (reports) => set({ reports }),
  updateReportStatus: (id, status) => set((state) => ({
    reports: state.reports.map((r) => r.id === id ? { ...r, status } : r)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useSosStore;
