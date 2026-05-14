import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('rescueiq_user')) || null,
  token: localStorage.getItem('rescueiq_token') || null,
  loading: false,
  error: null,

  signup: async (fullName, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { fullName, email, password });
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('Signup Detail Error:', error);
      const message = error.response?.data?.error || error.message || 'Signup failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  verifyOtp: async (email, code) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { email, code });
      const { token, user } = response.data;
      localStorage.setItem('rescueiq_token', token);
      localStorage.setItem('rescueiq_user', JSON.stringify(user));
      set({ token, user, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Verification failed', loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('rescueiq_token', token);
      localStorage.setItem('rescueiq_user', JSON.stringify(user));
      set({ token, user, loading: false });
      return response.data;
    } catch (error) {
      const err = error.response?.data;
      set({ error: err?.error || 'Login failed', loading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Request failed', loading: false });
      throw error;
    }
  },

  resetPassword: async (email, code, newPassword) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/reset-password`, { email, code, newPassword });
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Reset failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('rescueiq_token');
    localStorage.removeItem('rescueiq_user');
    set({ user: null, token: null });
  },
  setUser: (user) => {
    localStorage.setItem('rescueiq_user', JSON.stringify(user));
    set({ user });
  }
}));

export default useAuthStore;
