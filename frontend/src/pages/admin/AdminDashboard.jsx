import React from 'react';
import { Users, Shield, Server, Activity, Plus, FileSpreadsheet, Key, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  // Stat Card Config
  const stats = [
    { title: 'Total Staff', count: '14', detail: '8 Doctors, 6 Receptionists', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { title: 'System Security', count: 'Excellent', detail: '2FA enforced, JWT SSL', icon: Shield, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'API Gateway Uptime', count: '99.98%', detail: 'Response latency: 28ms', icon: Server, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30' },
    { title: 'Total Scan Events', count: '1,420', detail: 'QR scan traffic (+12% today)', icon: Activity, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  ];

  // Mock activity logs
  const logs = [
    { id: '1', user: 'Admin Account', action: 'System Database seeded', time: '10 mins ago', type: 'system', status: 'Success' },
    { id: '2', user: 'Dr. Sarah Connor', action: 'Logged in to Consultation Desk', time: '35 mins ago', type: 'login', status: 'Success' },
    { id: '3', user: 'John Doe (Recep)', action: 'Registered Patient QR ID #8841', time: '1 hour ago', type: 'activity', status: 'Success' },
    { id: '4', user: 'Unknown IP', action: 'Failed SSH Login Attempt', time: '4 hours ago', type: 'security', status: 'Blocked' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Admin Command Center</h1>
        <p className="text-sm text-slate-500 mt-1">Manage staff privileges, monitor secure database logs, and review hospital analytics.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-all hover:translate-y-[-2px] hover:shadow-md">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.title}</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{s.count}</h3>
                <p className="text-xs text-slate-500 font-medium">{s.detail}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                <Icon size={24} className={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Controls Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Management Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => alert('New User Form - Staff creation UI placeholder')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400"><Plus size={16} /></span>
                  <span>Register Hospital Doctor</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => alert('New User Form - Staff creation UI placeholder')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400"><Plus size={16} /></span>
                  <span>Register Receptionist</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => alert('Feature incoming - Downloadable Excel spreadsheet logs')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"><FileSpreadsheet size={16} /></span>
                  <span>Export Database Backup</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Audit Notice:</strong> Any action here generates an immutable record in MongoDB. Staff additions trigger a verification token sent via registration protocols.
            </p>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Security & Audit logs</h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900">
              Live Monitor
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase">
                  <th className="py-3 px-2">Initiator</th>
                  <th className="py-3 px-2">Action Description</th>
                  <th className="py-3 px-2">Time</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {logs.map((log) => (
                  <tr key={log.id} className="text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">{log.user}</td>
                    <td className="py-3 px-2">{log.action}</td>
                    <td className="py-3 px-2 text-xs text-slate-400">{log.time}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                        ${log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                        }
                      `}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
