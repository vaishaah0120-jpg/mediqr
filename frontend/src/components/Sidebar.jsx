import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  QrCode,
  Activity,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  // Navigation config based on roles
  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Patients', path: '/dashboard/patients', icon: Users },
          { name: 'Scan QR Code', path: '/dashboard/scan', icon: QrCode },
          { name: 'Hospital Staff', path: '/dashboard/staff', icon: Users },
          { name: 'Audit Logs', path: '/dashboard/audit', icon: Activity },
          { name: 'Settings', path: '/dashboard/settings', icon: Settings },
        ];
      case 'doctor':
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Patients', path: '/dashboard/patients', icon: Users },
          { name: 'Scan QR Code', path: '/dashboard/scan', icon: QrCode },
          { name: 'Patient Queue', path: '/dashboard/queue', icon: ClipboardList },
        ];
      case 'receptionist':
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Patients', path: '/dashboard/patients', icon: Users },
          { name: 'Scan QR Code', path: '/dashboard/scan', icon: QrCode },
          { name: 'Check-in Queue', path: '/dashboard/checkin', icon: QrCode },
          { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-indigo-500" />;
      case 'doctor':
        return <Stethoscope className="w-5 h-5 text-teal-500" />;
      case 'receptionist':
        return <Users className="w-5 h-5 text-sky-500" />;
      default:
        return null;
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-20 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-lg bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                MediQR
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Card info */}
        <div className={`p-4 border-b border-slate-100 dark:border-slate-900 flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shrink-0">
            {user?.name?.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getRoleIcon()}
                <span className="text-xs text-slate-400 capitalize font-medium">{user?.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                  ${isActive
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 shadow-sm shadow-teal-500/5'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/55 hover:text-slate-950 dark:hover:text-slate-100'
                  }
                `}
              >
                <LinkIcon size={20} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                    {link.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-900">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group relative`}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-16 bg-red-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
