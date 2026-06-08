import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--bg-1)', color: 'var(--t-hi)' }}>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Landing />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/alerts"     element={<Alerts />} />
          <Route path="/analytics"  element={<Analytics />} />
          <Route path="/worker"     element={<WorkerDashboard />} />
          <Route path="*"           element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
