import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, Mail, ShieldCheck, Stethoscope, Users, Check } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor'); // Default to Doctor role tab
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoadingState(true);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

  // Pre-fill helper to make testing easy for the user
  const handleQuickFill = () => {
    if (role === 'admin') {
      setEmail('admin@mediqr.com');
      setPassword('AdminPass123');
    } else if (role === 'doctor') {
      setEmail('doctor@mediqr.com');
      setPassword('DoctorPass123');
    } else if (role === 'receptionist') {
      setEmail('receptionist@mediqr.com');
      setPassword('RecepPass123');
    }
  };

  // Dynamic style selectors based on active role tab
  const getThemeColor = () => {
    switch (role) {
      case 'admin':
        return {
          primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20 text-indigo-600',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900',
          ring: 'focus:border-indigo-500 focus:ring-indigo-500/15',
          border: 'border-indigo-500',
        };
      case 'doctor':
        return {
          primary: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500/20 text-teal-600',
          badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900',
          ring: 'focus:border-teal-500 focus:ring-teal-500/15',
          border: 'border-teal-500',
        };
      case 'receptionist':
        return {
          primary: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500/20 text-sky-600',
          badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900',
          ring: 'focus:border-sky-500 focus:ring-sky-500/15',
          border: 'border-sky-500',
        };
      default:
        return {};
    }
  };

  const theme = getThemeColor();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900 px-4">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1.5s' }}></div>

      {/* Main Card */}
      <div className="w-full max-w-md z-10 glass-panel-dark p-8 rounded-3xl animate-fade-in">
        {/* Brand Logo & Name */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-teal-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mt-4 text-white tracking-tight">MediQR</h1>
          <p className="text-sm text-slate-400 mt-1">QR-Based Hospital Management System</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-1.5 rounded-2xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setRole('doctor'); setErrorMsg(''); }}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-semibold transition-all duration-300
              ${role === 'doctor'
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }
            `}
          >
            <Stethoscope className="w-4 h-4 mb-1" />
            Doctor
          </button>
          <button
            type="button"
            onClick={() => { setRole('receptionist'); setErrorMsg(''); }}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-semibold transition-all duration-300
              ${role === 'receptionist'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }
            `}
          >
            <Users className="w-4 h-4 mb-1" />
            Receptionist
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setErrorMsg(''); }}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-semibold transition-all duration-300
              ${role === 'admin'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }
            `}
          >
            <ShieldCheck className="w-4 h-4 mb-1" />
            Admin
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@mediqr.com"
                className={`w-full bg-slate-950/40 border border-slate-800 text-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 transition-all ${theme.ring}`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
              <span className="text-xs text-slate-500 cursor-not-allowed hover:underline">Forgot?</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-950/40 border border-slate-800 text-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 transition-all ${theme.ring}`}
              />
            </div>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 flex items-start gap-2.5 text-xs">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loadingState}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg
              ${loadingState
                ? 'bg-slate-700 cursor-not-allowed opacity-80'
                : role === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]'
                  : role === 'doctor'
                    ? 'bg-teal-600 hover:bg-teal-500 active:scale-[0.98]'
                    : 'bg-sky-600 hover:bg-sky-500 active:scale-[0.98]'
              }
            `}
          >
            {loadingState ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            )}
          </button>
        </form>

        {/* Seeding credentials help utility */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demo Credentials</span>
            <button
              onClick={handleQuickFill}
              className={`text-xs font-bold flex items-center gap-1 hover:underline transition-colors ${theme.text}`}
              style={{ color: role === 'admin' ? '#818cf8' : role === 'doctor' ? '#2dd4bf' : '#38bdf8' }}
            >
              <Check className="w-3.5 h-3.5" /> Autofill Demo Account
            </button>
          </div>
          <div className="space-y-1 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-xs font-mono text-slate-400">
            {role === 'admin' && (
              <>
                <p>Email: <span className="text-indigo-300">admin@mediqr.com</span></p>
                <p>Pass: <span className="text-slate-300">AdminPass123</span></p>
              </>
            )}
            {role === 'doctor' && (
              <>
                <p>Email: <span className="text-teal-300">doctor@mediqr.com</span></p>
                <p>Pass: <span className="text-slate-300">DoctorPass123</span></p>
              </>
            )}
            {role === 'receptionist' && (
              <>
                <p>Email: <span className="text-sky-300">receptionist@mediqr.com</span></p>
                <p>Pass: <span className="text-slate-300">RecepPass123</span></p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
