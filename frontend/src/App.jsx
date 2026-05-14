import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import TriagePage from './pages/TriagePage';
import AuthPage from './pages/LoginPage';
import SocialScanner from './pages/SocialScanner';
import CommandCenter from './pages/CommandCenter';
import Shelters from './pages/Shelters';
import LandingPage from './pages/LandingPage';
import useRealtime from './hooks/useRealtime';
import useAuthStore from './store/useAuthStore';

const ProtectedLayout = ({ children }) => {
  const { user, token, loading } = useAuthStore();

  if (loading) return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20 animate-pulse">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    </div>
  );

  if (!user || !token) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  // Initialize Socket.io connection and listeners
  useRealtime();

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentication */}
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/signup" element={<AuthPage initialMode="signup" />} />
        
        {/* Protected Application Routes */}
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } />
        
        <Route path="/map" element={
          <ProtectedLayout>
            <LiveMap />
          </ProtectedLayout>
        } />
        
        <Route path="/triage" element={
          <ProtectedLayout>
            <TriagePage />
          </ProtectedLayout>
        } />

        <Route path="/social" element={
          <ProtectedLayout>
            <SocialScanner />
          </ProtectedLayout>
        } />

        <Route path="/teams" element={
          <ProtectedLayout>
            <CommandCenter />
          </ProtectedLayout>
        } />

        <Route path="/shelters" element={
          <ProtectedLayout>
            <Shelters />
          </ProtectedLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
