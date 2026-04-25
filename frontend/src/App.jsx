import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Driver from './pages/Driver';
import Public from './pages/Public';
import Analytics from './pages/Analytics';
import CollectorPortal from './pages/CollectorPortal';
import AdminLogs from './pages/AdminLogs';
import AdminRetrain from './pages/AdminRetrain';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/public" element={<Public />} />
        <Route path="/driver" element={<Navigate to="/collector" replace />} />
        <Route path="/collector" element={<CollectorPortal />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen overflow-hidden">
                <Navbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Navbar />
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/logs" 
          element={
            <ProtectedRoute>
              <Navbar />
              <AdminLogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/retrain" 
          element={
            <ProtectedRoute>
              <Navbar />
              <AdminRetrain />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
