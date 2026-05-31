import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import ScanQR from './pages/ScanQR';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Layout Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* The index route renders the unified dashboard view based on user role */}
            <Route index element={<Dashboard />} />
            
            {/* Patients Directory Page */}
            <Route path="patients" element={<Patients />} />
            
            {/* QR Scanner & Retrieval Page */}
            <Route path="scan" element={<ScanQR />} />
            
            {/* Sub-route placeholders to support sidebar links navigation */}
            <Route
              path="*"
              element={
                <div className="glass-card dark:glass-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Hospital Module Active</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                    This section represents the interactive module interface. In the next phase, full QR scanner database syncing and audit trail engines will be linked here.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              }
            />
          </Route>

          {/* Fallback Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
