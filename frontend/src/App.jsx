import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Driver from './pages/Driver';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import CommandPalette from './components/CommandPalette';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminPublic from './pages/admin/AdminPublic';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes - no Navbar */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/driver" element={<PageWrapper><Driver /></PageWrapper>} />

        {/* Admin Routes - Navbar included in layout wrapper */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <PageWrapper>
              <div className="flex flex-col h-screen overflow-hidden bg-[#050914]">
                <Navbar />
                <div className="flex-1 relative overflow-hidden">
                  <AdminDashboard />
                </div>
              </div>
            </PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute>
            <PageWrapper>
              <div className="flex flex-col min-h-screen bg-[#050914] overflow-y-auto">
                <Navbar />
                <AdminAnalytics />
              </div>
            </PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/public" element={
          <ProtectedRoute>
            <PageWrapper>
              <div className="flex flex-col min-h-screen bg-[#050914] overflow-y-auto">
                <Navbar />
                <AdminPublic />
              </div>
            </PageWrapper>
          </ProtectedRoute>
        } />

        {/* Collector Routes */}
        <Route path="/collector/dashboard" element={
          <ProtectedRoute>
            <PageWrapper>
              <div className="flex flex-col h-screen overflow-hidden bg-[#050914]">
                <Navbar />
                <div className="flex-1 relative overflow-hidden">
                  <CollectorDashboard />
                </div>
              </div>
            </PageWrapper>
          </ProtectedRoute>
        } />

        {/* Redirect collector sub-pages to dashboard (restricted) */}
        <Route path="/collector/analytics" element={<Navigate to="/collector/dashboard" replace />} />
        <Route path="/collector/public" element={<Navigate to="/collector/dashboard" replace />} />

        {/* Redirect legacy routes */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/analytics" element={<Navigate to="/admin/analytics" replace />} />
        <Route path="/public" element={<Navigate to="/admin/public" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AnimatedRoutes />
          <CommandPalette />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                color: '#F8FAFC',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#050914' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#050914' } },
            }}
          />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
