import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import useRealtime from './hooks/useRealtime';
import useAuthStore from './store/useAuthStore';
import TacticalLoader from './components/TacticalLoader';
import clsx from 'clsx';

const ProtectedLayout = ({ children, noPadding = false }) => {
  const { user, token, loading: authLoading } = useAuthStore();
  const location = useLocation();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (authLoading) return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20 animate-pulse">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    </div>
  );

  if (!user || !token) return <Navigate to="/login" replace />;

  return (
    <>
      <TacticalLoader isDone={!isSyncing} />
      <div className="flex h-screen overflow-hidden bg-background font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className={clsx(
            "flex-1 overflow-y-auto custom-scrollbar",
            !noPadding && "p-4 md:p-6 lg:p-8"
          )}>
            {children}
          </main>
        </div>
      </div>
    </>
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
          <ProtectedLayout noPadding={true}>
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
          <ProtectedLayout noPadding={true}>
            <CommandCenter />
          </ProtectedLayout>
        } />

        <Route path="/shelters" element={
          <ProtectedLayout>
            <Shelters />
          </ProtectedLayout>
        } />

        <Route path="/settings" element={
          <ProtectedLayout noPadding={true}>
            <Settings />
          </ProtectedLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
