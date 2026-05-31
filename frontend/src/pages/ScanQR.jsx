import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  QrCode,
  Camera,
  Upload,
  Clock,
  User,
  Heart,
  Phone,
  MapPin,
  ClipboardList,
  FileText,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Lock,
  XCircle,
  RefreshCw
} from 'lucide-react';

const ScanQR = () => {
  const { token, user } = useAuth();
  
  // Tabs
  const [activeTab, setActiveTab] = useState('webcam'); // 'webcam' | 'upload'
  
  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  
  // Results & Loading
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [recordError, setRecordError] = useState('');

  // History (persisted in localStorage)
  const [history, setHistory] = useState([]);

  const html5QrCodeRef = useRef(null);
  const API_URL = 'http://localhost:5000/api';

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mediqr_scan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Fetch cameras on webcam tab active
  useEffect(() => {
    if (activeTab === 'webcam') {
      getCameras();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [activeTab]);

  const getCameras = async () => {
    try {
      // Check if global Html5Qrcode is loaded from script tag
      if (!window.Html5Qrcode) {
        setScanError('QR Code library is loading. Please wait...');
        return;
      }

      const devices = await window.Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        setSelectedCameraId(devices[0].id);
        setScanError('');
      } else {
        setScanError('No camera devices found. Ensure permissions are granted.');
      }
    } catch (err) {
      setScanError('Camera access denied or unavailable.');
    }
  };

  const startScanner = async () => {
    if (!selectedCameraId) return;
    setScanError('');
    setIsScanning(true);
    setPatientData(null);
    setRecordError('');

    try {
      const html5QrCode = new window.Html5Qrcode('reader-webcam');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Verbose log filter out
        }
      );
    } catch (err) {
      console.error(err);
      setScanError('Failed to start camera. Verify permission logs.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  // Handle successful decode (we get the patientId)
  const handleScanSuccess = async (qrCodeText) => {
    // Stop webcam immediately
    await stopScanner();
    fetchPatientRecord(qrCodeText);
  };

  // Fetch record from API
  const fetchPatientRecord = async (qrId) => {
    setLoading(true);
    setRecordError('');
    setPatientData(null);
    setMedicalRecords([]);
    setReports([]);

    try {
      const response = await fetch(`${API_URL}/patients/qr/${qrId}/full-record`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const { patient, medicalRecords, reports } = resData;
        setPatientData(patient);
        setMedicalRecords(medicalRecords || []);
        setReports(reports || []);

        // Add to history
        updateHistory(patient);
      } else {
        setRecordError(resData.message || `No records found for QR Code: ${qrId}`);
      }
    } catch (err) {
      setRecordError('Could not contact API server. Verify server status.');
    } finally {
      setLoading(false);
    }
  };

  // Update localStorage scan history
  const updateHistory = (patient) => {
    setHistory((prevHistory) => {
      // Remove duplicate if exists
      const filtered = prevHistory.filter((p) => p.patientId !== patient.patientId);
      const updated = [
        {
          _id: patient._id,
          patientId: patient.patientId,
          fullName: patient.fullName,
          gender: patient.gender,
          scannedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
        ...filtered,
      ].slice(0, 5); // Keep last 5

      localStorage.setItem('mediqr_scan_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Image File Upload decode
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanError('');
    setRecordError('');
    setPatientData(null);
    setLoading(true);

    try {
      if (!window.Html5Qrcode) {
        throw new Error('QR Reader library not loaded.');
      }

      // Create a temporary element to run scanFile
      const html5QrCode = new window.Html5Qrcode('reader-upload-hidden');
      const decodedText = await html5QrCode.scanFile(file, true);
      
      fetchPatientRecord(decodedText);
    } catch (err) {
      console.error(err);
      setRecordError('Could not decode QR code from the uploaded image. Ensure QR code is clear.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPatientData(null);
    setMedicalRecords([]);
    setReports([]);
    setRecordError('');
    if (activeTab === 'webcam') {
      startScanner();
    }
  };

  // Check role authorization to view medical history (Admin and Doctor only)
  const canViewMedical = user?.role === 'admin' || user?.role === 'doctor';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">QR clinical scanner</h1>
        <p className="text-sm text-slate-500 mt-1">Scan digital or physical patient QR wristbands using camera feeds or file logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Scanner and History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scanner Control Card */}
          {!patientData && (
            <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              {/* Tabs */}
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-5">
                <button
                  onClick={() => setActiveTab('webcam')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
                    ${activeTab === 'webcam'
                      ? 'bg-white dark:bg-slate-950 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }
                  `}
                >
                  <Camera size={14} />
                  <span>Webcam feed</span>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
                    ${activeTab === 'upload'
                      ? 'bg-white dark:bg-slate-950 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }
                  `}
                >
                  <Upload size={14} />
                  <span>Upload QR Card</span>
                </button>
              </div>

              {/* Webcam tab UI */}
              {activeTab === 'webcam' && (
                <div className="space-y-4">
                  {/* Select Camera dropdown */}
                  {cameras.length > 1 && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Input Lens</label>
                      <select
                        disabled={isScanning}
                        value={selectedCameraId}
                        onChange={(e) => setSelectedCameraId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      >
                        {cameras.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Scanning stream box */}
                  <div className="relative aspect-square max-w-sm mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center">
                    <div id="reader-webcam" className="w-full h-full"></div>
                    
                    {!isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3 z-10 bg-slate-950/70">
                        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                          <Camera size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-300">Camera Feed Inactive</p>
                          <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Click Start Scanner to stream camera feeds and hold the patient QR wristband in front of the lens.</p>
                        </div>
                      </div>
                    )}

                    {/* Scanning active light */}
                    {isScanning && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 z-20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase">Scanning</span>
                      </div>
                    )}
                  </div>

                  {/* Controls button */}
                  {isScanning ? (
                    <button
                      onClick={stopScanner}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-lg shadow-red-500/10 transition-all cursor-pointer"
                    >
                      Stop Camera Feed
                    </button>
                  ) : (
                    <button
                      disabled={cameras.length === 0}
                      onClick={startScanner}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Camera feed Scanner
                    </button>
                  )}

                  {scanError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex gap-2 text-xs">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <p className="font-semibold leading-relaxed">{scanError}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Upload tab UI */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  {/* Hidden reader element required by html5-qrcode file scanning */}
                  <div id="reader-upload-hidden" className="hidden"></div>

                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors relative cursor-pointer group bg-slate-50/50 dark:bg-slate-900/20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & Drop QR Image</p>
                      <p className="text-[10px] text-slate-400 mt-1">Or click to browse PNG/JPG files from device</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scan History Sidebar */}
          <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4.5 h-4.5 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Scanned Files</h3>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No QR scans logged in this session.</p>
            ) : (
              <div className="space-y-2">
                {history.map((h, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchPatientRecord(h.patientId)}
                    className="w-full flex justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors text-left text-xs cursor-pointer bg-white dark:bg-slate-950"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{h.fullName}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{h.patientId} • Scanned: {h.scannedAt}</p>
                    </div>
                    <span className="text-[10px] text-teal-500 font-bold hover:underline">Reload →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Results Display Panel */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="glass-card dark:glass-card-dark p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center py-20">
              <span className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin inline-block"></span>
              <p className="text-xs text-slate-400 mt-3 font-semibold">Contacting hospital EMR database...</p>
            </div>
          )}

          {recordError && (
            <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-red-500/5 border-l-4 border-l-red-500 flex gap-3.5 items-start">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-500">Record Retrieval Failed</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{recordError}</p>
                <button
                  onClick={handleClear}
                  className="mt-3.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Clear Screen & Scan Again
                </button>
              </div>
            </div>
          )}

          {patientData && (
            <div className="space-y-6 animate-fade-in">
              {/* Demographics Card */}
              <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 border-t-4 border-t-teal-500 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-900 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Scanned Patient Profile</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{patientData.fullName}</h3>
                  </div>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
                  >
                    <RefreshCw size={12} /> Clear & Scan
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center gap-2.5">
                    <User className="w-4 h-4 text-teal-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Demographics</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Age {patientData.age} • {patientData.gender}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Blood Group</span>
                      <span className="font-semibold text-red-500">{patientData.bloodGroup}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center gap-2.5 col-span-2">
                    <Phone className="w-4 h-4 text-sky-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Primary Phone</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{patientData.phone}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center gap-2.5 col-span-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Residential Address</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{patientData.address}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Card info */}
                <div className="bg-teal-50/20 dark:bg-teal-950/10 border border-teal-500/10 p-3.5 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">In Case of Emergency</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{patientData.emergencyContact?.name}</span>
                    <span className="text-slate-400 font-semibold capitalize">{patientData.emergencyContact?.relation}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{patientData.emergencyContact?.phone}</p>
                </div>
              </div>

              {/* Medical Information Card (Clinical History / EMR) */}
              {canViewMedical ? (
                <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
                    <ClipboardList className="w-5 h-5 text-teal-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Clinical EMR Histories</h3>
                  </div>

                  {medicalRecords.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      No clinical visits logged in EMR database.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medicalRecords.map((mr) => (
                        <div key={mr._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                              Visit: {new Date(mr.visitDate).toLocaleDateString()}
                            </span>
                            <span className="text-slate-400 font-medium">Attending: {mr.doctorId?.fullName || 'Duty MD'}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <div>
                              <strong className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Symptoms</strong>
                              <p className="font-medium">"{mr.symptoms}"</p>
                            </div>
                            <div>
                              <strong className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Diagnosis</strong>
                              <p className="font-bold text-teal-600 dark:text-teal-400">"{mr.diagnosis}"</p>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 dark:border-slate-850 pt-2.5">
                            <strong className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Prescribed Drugs & Advice</strong>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-teal-500/5 p-2 rounded border border-teal-500/10 whitespace-pre-wrap leading-relaxed">
                              {mr.prescription}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Laboratory Reports */}
                  <div className="border-t border-slate-100 dark:border-slate-900 pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4.5 h-4.5 text-sky-500" />
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Laboratory reports</h4>
                    </div>

                    {reports.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No diagnostic reports uploaded.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {reports.map((rep) => (
                          <div key={rep._id} className="flex justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 text-xs">
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{rep.reportName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Uploaded: {new Date(rep.uploadedAt).toLocaleDateString()}</p>
                            </div>
                            <button
                              onClick={() => alert(`🔗 Downloading report metadata from resource: ${rep.fileUrl}`)}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-250 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold transition-all cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Redacted / Locked EMR card for Receptionists */
                <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-950/20 flex flex-col items-center justify-center text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Lock size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Medical History Locked</h4>
                    <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                      Clinical EMR folders (Diagnosis, Symptoms, Prescriptions) are encrypted under Role-Based Access Control. Contact the attending physician to retrieve diagnostic logs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!patientData && !loading && !recordError && (
            <div className="h-full glass-card dark:glass-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <QrCode size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Patient Record Console</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Start the webcam scanner or upload a QR PNG file from your computer. The scanner decodes patient keys and loads demographics alongside locked EMR folders.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
