import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, Menu, X, Phone, Mail, MapPin, Shield, Clock, HeartPulse } from 'lucide-react';

const PublicLayout = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Departments', path: '/departments' },
    { name: 'Appointment', path: '/appointment' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* Top Banner Alert (Hotline & Hours) */}
      <div className="bg-gradient-to-r from-teal-600 to-sky-600 text-white text-xs py-2 px-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone size={12} />
            <span>Emergency 24/7 Hotline: <strong>+1 (800) 555-0199</strong></span>
          </span>
          <span className="hidden md:flex items-center gap-1">
            <Clock size={12} />
            <span>OPD Hours: Mon - Sat 8:00 AM - 8:00 PM</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">QR Wristband Patient System Active</span>
          <QrCode size={12} className="animate-pulse" />
        </div>
      </div>

      {/* Main Responsive Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse size={22} className="stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent tracking-tight">
              MediQR
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `
                  text-sm font-semibold transition-colors duration-200 py-1 border-b-2
                  ${isActive
                    ? 'text-teal-600 border-teal-600 dark:text-teal-400 dark:border-teal-400'
                    : 'text-slate-600 hover:text-teal-600 border-transparent dark:text-slate-350 dark:hover:text-teal-400'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Portal Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-850 px-4 py-4 space-y-3 shadow-xl backdrop-blur-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  block px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${isActive
                    ? 'bg-teal-50 dark:bg-teal-950/45 text-teal-600 dark:text-teal-400 shadow-sm border-l-4 border-teal-500'
                    : 'text-slate-650 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-900">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-sm"
                >
                  Portal Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Hospital Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                  <HeartPulse size={18} />
                </div>
                <span className="font-extrabold text-lg text-white">MediQR Hospital</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-405">
                Integrating smart technologies with medical care. Our unique QR-Wristband system expedites clinical triage and secures healthcare access.
              </p>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-800 max-w-max">
                <Shield size={14} className="text-teal-400" />
                <span>HIPAA Compliant & Secure</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="hover:text-teal-400 transition-colors">About History</Link></li>
                <li><Link to="/services" className="hover:text-teal-400 transition-colors">Our Services</Link></li>
                <li><Link to="/departments" className="hover:text-teal-400 transition-colors">Clinical Divisions</Link></li>
                <li><Link to="/appointment" className="hover:text-teal-400 transition-colors">Book appointment</Link></li>
                <li><Link to="/login" className="hover:text-teal-400 transition-colors">Staff Login portal</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Get in Touch</h4>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span>123 Medical Center Dr, Health Plaza, NY 10001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-teal-400 shrink-0" />
                <span>+1 (800) 555-0100</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-teal-400 shrink-0" />
                <span>support@mediqr-hospital.com</span>
              </p>
            </div>

            {/* Column 4: Opening Hours */}
            <div>
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Operating Hours</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between"><span>Emergency:</span> <span className="text-red-400 font-bold">24/7/365</span></li>
                <li className="flex justify-between"><span>Outpatient Dept:</span> <span>8:00 AM - 8:00 PM</span></li>
                <li className="flex justify-between"><span>Lab Diagnostics:</span> <span>7:00 AM - 10:00 PM</span></li>
                <li className="flex justify-between"><span>Pharmacy:</span> <span>24 Hours Open</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Area */}
          <div className="mt-12 pt-6 border-t border-slate-800 text-center text-[10px] text-slate-550 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} MediQR Smart Hospital System. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <Link to="/login" className="hover:underline text-teal-400">Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
