import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import CommandCenter from './pages/CommandCenter';
import useRealtime from './hooks/useRealtime';

function App() {
  // Initialize Socket.io connection and listeners
  useRealtime();

  return (
    <Router>
      <Routes>
        {/* Full-screen Tactical Command Center */}
        <Route path="/teams" element={<CommandCenter />} />
        
        {/* Standard Dashboard Layout */}
        <Route path="*" element={
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/map" element={<LiveMap />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
