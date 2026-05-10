import { create } from 'zustand';

const useSosStore = create((set) => ({
  reports: [],
  isLoading: false,
  error: null,
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
  setReports: (reports) => set({ reports }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useSosStore;
