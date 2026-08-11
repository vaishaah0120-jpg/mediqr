import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Search, Filter, CheckCircle, XCircle, Printer, Download, Clock, User, Stethoscope, AlertCircle } from 'lucide-react';

const Appointments = () => {
  const { token } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        // Sort appointments: Scheduled first, then date descending
        const sorted = (resData.data || []).sort((a, b) => {
          if (a.status === 'Scheduled' && b.status !== 'Scheduled') return -1;
          if (a.status !== 'Scheduled' && b.status === 'Scheduled') return 1;
          return new Date(b.appointmentDate) - new Date(a.appointmentDate);
        });
        setAppointments(sorted);
      } else {
        setError(resData.message || 'Failed to retrieve appointments list.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not establish connection to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        // Update local state
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
        );
      } else {
        alert(resData.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleDownloadQR = (patient) => {
    if (!patient?.qrCode) return;
    const link = document.createElement('a');
    link.href = patient.qrCode;
    link.download = `MediQR-${patient.patientId || 'patient'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQR = (patient, triage = 'Routine') => {
    if (!patient?.qrCode) return;
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) {
      alert('Pop-up window blocked. Please allow pop-ups to print patient cards.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>MediQR - Print Card</title>
          <style>
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #ffffff;
            }
            .wristband-card {
              border: 2px dashed #0d9488;
              padding: 24px;
              border-radius: 16px;
              width: 320px;
              text-align: left;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 16px;
            }
            .title {
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
              margin: 0;
            }
            .subtitle {
              font-size: 10px;
              color: #64748b;
              margin-top: 4px;
              font-weight: 600;
            }
            .badge {
              font-size: 9px;
              font-weight: 800;
              background-color: #f0fdfa;
              color: #0d9488;
              border: 1px solid #ccfbf1;
              padding: 2px 6px;
              border-radius: 4px;
              text-transform: uppercase;
            }
            .qr-container {
              width: 160px;
              height: 160px;
              margin: 20px auto;
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 8px;
            }
            .qr-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .footer {
              text-align: center;
              border-top: 1px solid #e2e8f0;
              padding-top: 12px;
              margin-top: 16px;
            }
            .footer-label {
              font-size: 8px;
              font-weight: 600;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            .footer-value {
              font-size: 14px;
              font-weight: 700;
              color: #0d9488;
              margin-top: 2px;
              font-family: monospace;
            }
            @media print {
              body {
                padding: 0;
              }
              .wristband-card {
                border: 2px solid #000000;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="wristband-card">
            <div class="header">
              <div>
                <h4 class="title">${patient.fullName}</h4>
                <p class="subtitle">Age: ${patient.age} &bull; Blood: ${patient.bloodGroup || 'O+'}</p>
              </div>
              <span class="badge">MediQR Profile</span>
            </div>
            
            <div class="qr-container">
              <img class="qr-image" src="${patient.qrCode}" alt="QR Code" />
            </div>
            
            <div class="footer">
              <div class="footer-label">Scannable Hospital Key</div>
              <div class="footer-value">${patient.patientId}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter matching search term and status selector
  const filteredAppointments = appointments.filter((app) => {
    const patientName = app.patientId?.fullName || '';
    const doctorName = app.doctorId?.fullName || '';
    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="w-7 h-7 text-sky-600 dark:text-sky-400" />
          <span>Scheduled Appointments</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor online and public patient bookings, check patients in, print QR code wristbands, or manage scheduling statuses.
        </p>
      </div>

      {/* Search & Filtering Panel */}
      <div className="glass-card dark:glass-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient or doctor name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 placeholder-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-sky-500 transition-all cursor-pointer font-semibold"
          >
            <option value="All">All Appointments</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed / Checked-In</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Grid display / Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Retrieving appointments database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex gap-3 text-sm items-start max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-red-500">Database Connection Error</h4>
            <p className="leading-relaxed mt-1 font-semibold">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="glass-card dark:glass-card-dark p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center py-16">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900/60 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-white">No appointments found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            There are no booking logs that match the current search filters. Try booking an appointment from the public page or adjust your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.map((app) => (
            <div
              key={app._id}
              className={`glass-card dark:glass-card-dark p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between
                ${app.status === 'Completed'
                  ? 'border-emerald-500/10 bg-emerald-500/[0.01]'
                  : app.status === 'Cancelled'
                    ? 'border-red-500/10 bg-red-500/[0.01]'
                    : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm'
                }
              `}
            >
              {/* Header: Date and status badge */}
              <div>
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 dark:border-slate-850 pb-3 mb-3.5">
                  <div className="flex items-center gap-1.5 text-slate-550 dark:text-slate-350">
                    <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-[11px] font-bold">
                      {new Date(app.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide border
                      ${app.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/25'
                        : app.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/25'
                          : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25'
                      }
                    `}
                  >
                    {app.status === 'Completed' ? 'Checked-In' : app.status}
                  </span>
                </div>

                {/* Patient Information */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center text-slate-500 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{app.patientId?.fullName || 'Anonymous Patient'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ID: <span className="font-semibold text-slate-500">{app.patientId?.patientId || 'N/A'}</span> • Age: {app.patientId?.age || 'N/A'} • Blood: {app.patientId?.bloodGroup || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Doctor Information */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center text-slate-500 shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-250 truncate">{app.doctorId?.fullName || 'General MD'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{app.doctorId?.specialization || 'General Practice'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-850/80 flex flex-wrap gap-2 items-center justify-between">
                {/* QR Utility buttons: display only if patient has qrCode */}
                {app.patientId?.qrCode ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handlePrintQR(app.patientId)}
                      title="Print patient card/wristband"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-all cursor-pointer"
                    >
                      <Printer size={13.5} />
                    </button>
                    <button
                      onClick={() => handleDownloadQR(app.patientId)}
                      title="Download QR code image"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-all cursor-pointer"
                    >
                      <Download size={13.5} />
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">No QR Generated</div>
                )}

                {/* Status Action controls */}
                {app.status === 'Scheduled' && (
                  <div className="flex gap-1.5 ml-auto">
                    <button
                      onClick={() => handleUpdateStatus(app._id, 'Cancelled')}
                      className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-red-500/20"
                    >
                      <XCircle size={12} />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-emerald-550/10"
                    >
                      <CheckCircle size={12} />
                      <span>Check-In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
