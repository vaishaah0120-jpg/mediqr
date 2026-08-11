import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Phone,
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  HeartPulse
} from 'lucide-react';

const Appointment = () => {
  // Stepper state: 1 (Demographics), 2 (Emergency), 3 (Doctor & Time), 4 (Success)
  const [step, setStep] = useState(1);
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Spouse',
    doctorId: '',
    appointmentDate: '',
  });

  // Success details returned from API
  const [bookingResult, setBookingResult] = useState(null);

  // Fetch doctors list from public API on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors/public');
      const resData = await response.json();
      if (response.ok && resData.success) {
        setDoctors(resData.data || []);
        if (resData.data && resData.data.length > 0) {
          setFormData((prev) => ({ ...prev, doctorId: resData.data[0]._id }));
        }
      } else {
        // Fallback mock doctors if API has issues
        fallbackMockDoctors();
      }
    } catch (err) {
      console.error('Failed to contact doctors API:', err);
      fallbackMockDoctors();
    }
  };

  const fallbackMockDoctors = () => {
    const mock = [
      { _id: '60c72b2f9b1d8a23d45678b1', fullName: 'Dr. Sarah Connor', specialization: 'Cardiologist' },
      { _id: 'mock-doctor-neurology', fullName: 'Dr. Stephen Strange', specialization: 'Neurologist' },
      { _id: 'mock-doctor-pediatrics', fullName: 'Dr. Clara Oswald', specialization: 'Pediatrician' }
    ];
    setDoctors(mock);
    setFormData((prev) => ({ ...prev, doctorId: mock[0]._id }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const { fullName, age, phone, address } = formData;
    if (!fullName || !age || !phone || !address) {
      setError('Please fill in all demographic details.');
      return false;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0) {
      setError('Age must be a valid positive number.');
      return false;
    }
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setError('Invalid phone number format (7 to 15 digits).');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    const { emergencyContactName, emergencyContactPhone } = formData;
    if (!emergencyContactName || !emergencyContactPhone) {
      setError('Please fill in emergency contact details.');
      return false;
    }
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(emergencyContactPhone)) {
      setError('Invalid emergency phone number format.');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep3 = () => {
    const { doctorId, appointmentDate } = formData;
    if (!doctorId || !appointmentDate) {
      setError('Please select a doctor and schedule a date/time.');
      return false;
    }
    const date = new Date(appointmentDate);
    if (date < new Date()) {
      setError('Appointment date must be in the future.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10),
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setBookingResult(resData.data);
        setStep(4); // Show success screen
      } else {
        setError(resData.message || 'Failed to submit appointment booking.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not establish connection to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!bookingResult?.patient?.qrCode) return;
    const link = document.createElement('a');
    link.href = bookingResult.patient.qrCode;
    link.download = `MediQR-${bookingResult.patient.patientId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQR = () => {
    if (!bookingResult?.patient?.qrCode) return;
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) {
      alert('Pop-up window blocked. Please allow pop-ups to print your card.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>MediQR - Print Patient Card</title>
          <style>
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
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
              }
            }
          </style>
        </head>
        <body>
          <div class="wristband-card">
            <div class="header">
              <div>
                <h4 class="title">${bookingResult.patient.fullName}</h4>
                <p class="subtitle">Age: ${bookingResult.patient.age} &bull; Blood: ${bookingResult.patient.bloodGroup}</p>
              </div>
              <span class="badge">MediQR Profile</span>
            </div>
            <div class="qr-container">
              <img class="qr-image" src="${bookingResult.patient.qrCode}" alt="QR Code" />
            </div>
            <div class="footer">
              <div class="footer-label">Scannable Hospital Key</div>
              <div class="footer-value">${bookingResult.patient.patientId}</div>
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
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold text-teal-650 dark:text-teal-400 uppercase tracking-widest">Scheduler desk</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">Book Your Clinical Appointment</h1>
        <p className="text-xs text-slate-405 max-w-md mx-auto">
          Fill in demographics, register emergency contact lines, select a department doctor, and receive your digital QR patient card.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card dark:glass-card-dark rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Stepper Wizard Indicator (Only show if not in success step) */}
        {step < 4 && (
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-850 pb-5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600 dark:text-teal-400' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-100'}`}>1</span>
              <span>Demographics</span>
            </div>
            <span className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800"></span>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600 dark:text-teal-400' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-100'}`}>2</span>
              <span>Emergency</span>
            </div>
            <span className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800"></span>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600 dark:text-teal-400' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-teal-500 text-white' : 'bg-slate-100'}`}>3</span>
              <span>Schedule</span>
            </div>
          </div>
        )}

        {/* Error Alert Panel */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex gap-2.5 items-start text-xs font-semibold leading-relaxed">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* STEP 1: Patient Demographics */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Step 1: Patient Demographics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Peter Parker"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g. 24"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Blood Group *</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Contact Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +15550088"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Residential Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete residential address details..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-teal-650 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Emergency Contact */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Step 2: Emergency Contact Lines</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Emergency Contact Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="e.g. Aunt May"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Emergency Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="e.g. +15550089"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Relation with Patient *</label>
                <select
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Go Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-teal-650 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Doctor & Schedule Selection */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Step 3: Doctor Selection & Date</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Attending Doctor / Specialist *</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                >
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.fullName} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Appointment Date & Time *</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="datetime-local"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft size={14} />
                <span>Go Back</span>
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-black text-xs rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block"></span>
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION & QR CARD DISPLAY */}
        {step === 4 && bookingResult && (
          <div className="text-center space-y-6 py-6 animate-fade-in">
            {/* Header check status */}
            <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
              <CheckCircle size={32} />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Appointment Scheduled!</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your appointment with **{doctors.find((d) => d._id === formData.doctorId)?.fullName || 'your physician'}** has been logged in our EMR systems.
            </p>

            <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl text-left bg-slate-50/50 dark:bg-slate-900/30 max-w-sm mx-auto text-xs space-y-2">
              <p className="flex justify-between">
                <span className="text-slate-400 font-medium">Patient Name:</span>
                <span className="font-extrabold text-slate-800 dark:text-white">{bookingResult.patient?.fullName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400 font-medium">Hospital ID:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{bookingResult.patient?.patientId}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400 font-medium">Scheduled Date:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {new Date(bookingResult.appointment?.appointmentDate).toLocaleString()}
                </span>
              </p>
            </div>

            {/* QR Card Presentation */}
            {bookingResult.patient?.qrCode && (
              <div className="border-2 border-dashed border-teal-500/30 p-6 rounded-3xl max-w-xs mx-auto space-y-4 shadow-sm bg-white dark:bg-slate-950">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 border-b pb-2">
                  <span>MediQR digital Card</span>
                  <span className="text-teal-500">Intake Key</span>
                </div>
                
                <div className="w-44 h-44 border rounded-2xl mx-auto flex items-center justify-center p-3 bg-white">
                  <img
                    src={bookingResult.patient.qrCode}
                    alt="Patient QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <p className="font-mono text-xs text-slate-500 font-bold tracking-wider">
                  {bookingResult.patient.patientId}
                </p>

                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Download size={12} /> Download
                  </button>
                  <button
                    onClick={handlePrintQR}
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Printer size={12} /> Print
                  </button>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    fullName: '',
                    age: '',
                    gender: 'Male',
                    bloodGroup: 'O+',
                    phone: '',
                    address: '',
                    emergencyContactName: '',
                    emergencyContactPhone: '',
                    emergencyContactRelation: 'Spouse',
                    doctorId: doctors[0]?._id || '',
                    appointmentDate: '',
                  });
                  setBookingResult(null);
                  setError('');
                }}
                className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Schedule Another Appointment
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-50 font-bold text-xs rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Back to Home Page
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
