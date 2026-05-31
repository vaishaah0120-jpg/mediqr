import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Search, Sun, Moon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serverStatus, setServerStatus] = useState('checking');

  // Keep time updated
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check server connection
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/');
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex">
      {/* Overlay for mobile sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop collapsible, Mobile sliding drawer */}
      <div
        className={`fixed top-0 left-0 z-30 h-screen transition-transform duration-300 md:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Layout Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
          ${isCollapsed ? 'md:pl-20' : 'md:pl-64'}
        `}
      >
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 md:hidden border border-slate-200 dark:border-slate-800"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hospital Management System</span>
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{user?.role} Dashboard</h2>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-4">
            {/* Server Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {serverStatus === 'online' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hidden md:inline">Server Connected</span>
                </>
              ) : serverStatus === 'offline' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-medium hidden md:inline">Server Offline</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium hidden md:inline">Connecting API...</span>
                </>
              )}
            </div>

            {/* Date & Time */}
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formattedTime}</p>
              <p className="text-xs text-slate-400">{formattedDate}</p>
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 relative border border-slate-100 dark:border-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
