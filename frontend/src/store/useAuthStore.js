import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? `${import.meta.env.VITE_API_URL}/auth` : `${import.meta.env.VITE_API_URL}/api/auth`) 
  : '/api/auth';

const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('rescueiq_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('rescueiq_token') || null,
  loading: false,
  error: null,

  signup: async (fullName, email, password, role = 'responder') => {
    set({ loading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await axios.post(`${API_URL}/signup`, { 
        fullName: fullName.trim(), 
        email: cleanEmail, 
        password: password.trim(),
        role
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('Signup Error:', error);
      const message = error.response?.data?.error || error.message || 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  verifyOtp: async (email, code) => {
    set({ loading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await axios.post(`${API_URL}/verify-otp`, { 
        email: cleanEmail, 
        code: code.trim() 
      });
      const { token, user } = response.data;
      
      localStorage.setItem('rescueiq_token', token);
      localStorage.setItem('rescueiq_user', JSON.stringify(user));
      
      set({ token, user, loading: false, error: null });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Verification failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    try {
      const response = await axios.post(`${API_URL}/login`, { 
        email: cleanEmail, 
        password: cleanPassword 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('rescueiq_token', token);
      localStorage.setItem('rescueiq_user', JSON.stringify(user));
      
      set({ token, user, loading: false, error: null });
      return response.data;
    } catch (error) {
      const errData = error.response?.data;
      const message = errData?.error || 'Authentication failed. Please verify credentials.';
      set({ error: message, loading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    const token = get().token || localStorage.getItem('rescueiq_token');
    if (!token) {
      set({ user: null, token: null });
      return false;
    }

    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { user } = response.data;
      localStorage.setItem('rescueiq_user', JSON.stringify(user));
      set({ user });
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn('Session expired or token invalid. Clearing credentials.');
        localStorage.removeItem('rescueiq_token');
        localStorage.removeItem('rescueiq_user');
        set({ user: null, token: null });
      }
      return false;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      await axios.post(`${API_URL}/forgot-password`, { email: cleanEmail });
      set({ loading: false });
    } catch (error) {
      const message = error.response?.data?.error || 'Password reset request failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  resetPassword: async (email, code, newPassword) => {
    set({ loading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      await axios.post(`${API_URL}/reset-password`, { 
        email: cleanEmail, 
        code: code.trim(), 
        newPassword: newPassword.trim() 
      });
      set({ loading: false });
    } catch (error) {
      const message = error.response?.data?.error || 'Password reset failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  logout: async () => {
    const token = get().token || localStorage.getItem('rescueiq_token');
    if (token) {
      try {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        // Log out locally regardless of network response
        console.warn('Backend logout notification skipped:', err.message);
      }
    }
    localStorage.removeItem('rescueiq_token');
    localStorage.removeItem('rescueiq_user');
    set({ user: null, token: null, error: null });
  },

  setUser: (user) => {
    localStorage.setItem('rescueiq_user', JSON.stringify(user));
    set({ user });
  }
}));

export default useAuthStore;
