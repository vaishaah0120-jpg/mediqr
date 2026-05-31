import React, { useState } from 'react';
import { Users, FileText, QrCode, Clock, Stethoscope, Heart, Plus, FileSpreadsheet, Check } from 'lucide-react';

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [consultationsCompleted, setConsultationsCompleted] = useState(12);

  // Mock patient queue
  const [patients, setPatients] = useState([
    { id: '1', name: 'James Carter', age: 34, qrId: 'MEDQR-9021', status: 'Waiting', triage: 'Urgent', reason: 'Severe Chest pain, mild fever' },
    { id: '2', name: 'Clara Oswald', age: 28, qrId: 'MEDQR-8041', status: 'Waiting', triage: 'Priority', reason: 'Asthma inhaler refill verification' },
    { id: '3', name: 'Marcus Aurelius', age: 62, qrId: 'MEDQR-3311', status: 'Waiting', triage: 'Routine', reason: 'Bi-weekly blood pressure checkup' },
  ]);

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setPrescriptionText('');
  };

  const handleSimulateScan = () => {
    // Simulating QR code reading
    const scanId = prompt('Enter Patient QR Code to scan (e.g. MEDQR-9021):', 'MEDQR-9021');
    if (!scanId) return;

    const matchedPatient = patients.find((p) => p.qrId === scanId);
    if (matchedPatient) {
      setSelectedPatient(matchedPatient);
      setPrescriptionText('');
      alert(`✅ Patient QR verified: ${matchedPatient.name}. Initializing EMR Consultation.`);
    } else {
      alert('❌ Invalid or Unregistered Patient QR Code.');
    }
  };

  const handleSubmitPrescription = (e) => {
    e.preventDefault();
    if (!prescriptionText.trim()) return;

    // Simulate completion
    alert(`Prescription submitted successfully for ${selectedPatient.name}. EMR updated.`);
    setPatients(patients.filter((p) => p.id !== selectedPatient.id));
    setSelectedPatient(null);
    setPrescriptionText('');
    setConsultationsCompleted((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Doctor Consultation Desk</h1>
          <p className="text-sm text-slate-500 mt-1">Review active patient queue and scan QR codes to access Electronic Medical Records (EMR).</p>
        </div>
        <button
          onClick={handleSimulateScan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-teal-500/10 cursor-pointer self-start sm:self-center"
        >
          <QrCode size={18} />
          <span>Simulate QR Scan</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue Size</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{patients.length} Patients</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Today</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{consultationsCompleted}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
            <Check size={20} />
          </div>
        </div>
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Wait Time</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">~12 minutes</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
        <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white truncate">Cardiology Clinic</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-500 flex items-center justify-center">
            <Stethoscope size={20} />
          </div>
        </div>
      </div>

      {/* Main interaction layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Patient Queue Table */}
        <div className="lg:col-span-3 glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Patient Queue</h3>
          <div className="overflow-x-auto">
            {patients.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold">Queue is empty</p>
                <p className="text-xs">No pending patients checked in.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase">
                    <th className="py-3 px-2">Patient</th>
                    <th className="py-3 px-2">QR Code ID</th>
                    <th className="py-3 px-2">Triage</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {patients.map((p) => (
                    <tr key={p.id} className={`text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${selectedPatient?.id === p.id ? 'bg-teal-50/30 dark:bg-teal-950/10' : ''}`}>
                      <td className="py-3.5 px-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
                        <div className="text-xs text-slate-400">Age: {p.age} • Reason: {p.reason}</div>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-xs text-slate-400">{p.qrId}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold
                          ${p.triage === 'Urgent'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            : p.triage === 'Priority'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }
                        `}>
                          {p.triage}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => handleStartConsultation(p)}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-xs font-bold transition-all cursor-pointer"
                        >
                          Consult
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Active consultation workspace */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-teal-500 space-y-5 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Active consultation</span>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">{selectedPatient.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">EMR ID: {selectedPatient.qrId} • Age: {selectedPatient.age}</p>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chief complaint / Intake note</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  "{selectedPatient.reason}"
                </p>
              </div>

              {/* Consultation Intake Form */}
              <form onSubmit={handleSubmitPrescription} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prescription & Diagnostic notes</label>
                  <textarea
                    required
                    rows={4}
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder="Enter prescribed medications, dosing intervals, and follow-up advice..."
                    className="w-full bg-slate-950/40 border border-slate-800/80 text-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder-slate-500 leading-relaxed transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-teal-500/5 cursor-pointer"
                >
                  Authorize E-Prescription & Clear Queue
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full glass-card dark:glass-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center animate-pulse-soft">
                <Heart size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Workspace Idle</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                  No patient selected. Choose a patient from the waiting queue table or scan a QR ID to start writing prescriptions.
                </p>
              </div>
              <button
                onClick={handleSimulateScan}
                className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 text-xs font-bold border border-teal-100 dark:border-teal-900/60 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-all cursor-pointer"
              >
                Scan Patient QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
