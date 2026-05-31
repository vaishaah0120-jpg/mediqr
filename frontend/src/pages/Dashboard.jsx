import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import ReceptionistDashboard from './receptionist/ReceptionistDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    default:
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-red-500">Access Error</h2>
          <p className="text-slate-500 mt-2">No dashboard matches your role. Contact administration.</p>
        </div>
      );
  }
};

export default Dashboard;
