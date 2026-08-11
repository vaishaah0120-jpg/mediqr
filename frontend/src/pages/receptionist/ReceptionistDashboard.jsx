import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, UserPlus, QrCode, ShieldCheck, HeartPulse, Send, Printer, CalendarRange, Clock, AlertCircle } from 'lucide-react';

const ReceptionistDashboard = () => {
  const { token } = useAuth();
  
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientTriage, setPatientTriage] = useState('Routine');
  const [patientReason, setPatientReason] = useState('');
  
  // Simulated generated QR profile
  const [generatedQR, setGeneratedQR] = useState(null);
  
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  // Mock recent registrations
  const [checkins, setCheckins] = useState([
    { name: 'James Carter', age: 34, qrId: 'MEDQR-9021', time: '10 mins ago', triage: 'Urgent' },
    { name: 'Clara Oswald', age: 28, qrId: 'MEDQR-8041', time: '25 mins ago', triage: 'Priority' },
    { name: 'Marcus Aurelius', age: 62, qrId: 'MEDQR-3311', time: '1 hour ago', triage: 'Routine' },
  ]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!patientName || !patientAge || !patientReason) return;
    setFormError('');
    setFormLoading(true);

    const payload = {
      fullName: patientName,
      age: parseInt(patientAge, 10),
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+15559999',
      address: 'Intake Station Room 1',
      emergencyContact: {
        name: 'Emergency ICE Contact',
        phone: '+15559998',
        relation: 'Spouse'
      }
    };

    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      
      if (response.ok && resData.success) {
        const patient = resData.data;
        
        setGeneratedQR({
          name: patient.fullName,
          age: patient.age,
          qrId: patient.patientId,
          qrCode: patient.qrCode,
          triage: patientTriage
        });

        // Append to list
        setCheckins([
          {
            name: patient.fullName,
            age: patient.age,
            qrId: patient.patientId,
            time: 'Just now',
            triage: patientTriage,
          },
          ...checkins,
        ]);

        // Clear form
        setPatientName('');
        setPatientAge('');
        setPatientReason('');
        setPatientTriage('Routine');
      } else {
        setFormError(resData.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error in receptionist registration:', err);
      setFormError('Could not connect to database server.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDownloadQR = (patient) => {
    if (!patient.qrCode) return;
    const link = document.createElement('a');
    link.href = patient.qrCode;
    link.download = `MediQR-${patient.qrId || 'patient'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQR = (patient) => {
    if (!patient.qrCode) return;
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) {
      alert('Pop-up window blocked. Please enable pop-ups to print wristbands.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>MediQR - Print Wristband</title>
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
                background-color: #ffffff;
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
                <h4 class="title">${patient.name}</h4>
                <p class="subtitle">Age: ${patient.age} &bull; Triage: ${patient.triage}</p>
              </div>
              <span class="badge">MediQR Profile</span>
            </div>
            
            <div class="qr-container">
              <img class="qr-image" src="${patient.qrCode}" alt="QR Code" />
            </div>
            
            <div class="footer">
              <div class="footer-label">Scannable Hospital wristband Key</div>
              <div class="footer-value">${patient.qrId}</div>
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Reception check-in desk</h1>
        <p className="text-sm text-slate-500 mt-1">Register new patients, assign triage urgency, and instantly generate digital QR profile cards.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Check-ins (Today)</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">32 Patients</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Intake Speed</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">4.8 minutes</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Doctors Active</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">8 Duty MDs</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center">
            <HeartPulse size={20} />
          </div>
        </div>
      </div>

      {/* Forms & Tables Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Register Intake Form */}
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Patient Intake Form</h3>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex gap-2 text-xs">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <p className="leading-relaxed font-semibold">{formError}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Richard Hendricks"
                  className="w-full bg-slate-950/5 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                  <input
                    type="number"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 29"
                    className="w-full bg-slate-950/5 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Triage Priority</label>
                  <select
                    value={patientTriage}
                    onChange={(e) => setPatientTriage(e.target.value)}
                    className="w-full bg-slate-950/5 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
                  >
                    <option value="Routine">🟢 Routine</option>
                    <option value="Priority">🟡 Priority</option>
                    <option value="Urgent">🔴 Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for check-in</label>
                <input
                  type="text"
                  required
                  value={patientReason}
                  onChange={(e) => setPatientReason(e.target.value)}
                  placeholder="e.g. Sore throat and persistent cough"
                  className="w-full bg-slate-950/5 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-sky-500/5 cursor-pointer flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Register & Generate QR</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Area: Shows generated QR or details instructions */}
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
          {generatedQR ? (
            <div className="w-full text-center space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Generated Profile Card</h4>
                <button
                  onClick={() => setGeneratedQR(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-500"
                >
                  Clear Card
                </button>
              </div>

              {/* QR Medical Card Mockup */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-w-xs mx-auto text-left">
                {/* Accent design elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-black text-white leading-none text-base">{generatedQR.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Age: {generatedQR.age} • Triage: {generatedQR.triage}</p>
                  </div>
                  <span className="text-[10px] font-black text-sky-400 tracking-wider border border-sky-400/20 px-2 py-0.5 rounded bg-sky-950/20 uppercase">
                    MediQR Profile
                  </span>
                </div>

                {/* Real Generated QR Code */}
                <div className="w-40 h-40 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  {generatedQR.qrCode ? (
                    <img
                      src={generatedQR.qrCode}
                      alt={`QR Code for ${generatedQR.name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold">QR Error</div>
                  )}
                </div>
              </div>

              {/* Action utilities */}
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => handlePrintQR(generatedQR)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer size={14} /> Print Wristband
                </button>
                <button
                  onClick={() => handleDownloadQR(generatedQR)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Download PNG
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center mx-auto animate-pulse-soft">
                <QrCode size={32} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-white">QR Code Generator</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Fill in the patient intake details on the left form and click register. The system will create an encrypted database entry and output a custom QR wristband card.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Recent Registrations Logs */}
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Today's Check-ins</h3>
          <div className="space-y-3.5">
            {checkins.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.name}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">QR: {c.qrId} • {c.time}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded
                  ${c.triage === 'Urgent'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/20'
                    : c.triage === 'Priority'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/20'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/20'
                  }
                `}>
                  {c.triage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
