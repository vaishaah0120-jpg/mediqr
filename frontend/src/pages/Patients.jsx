import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Heart,
  MapPin,
  Clock,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

const Patients = () => {
  const { token, user } = useAuth();

  // State parameters
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal controls
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Emergency Contact nested states
  const [ecName, setEcName] = useState('');
  const [ecPhone, setEcPhone] = useState('');
  const [ecRelation, setEcRelation] = useState('Spouse');

  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  // Fetch Patients List
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/patients?page=${page}&limit=5&search=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPatients(data.data);
        setTotalPages(data.pagination.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when search or page changes
  useEffect(() => {
    fetchPatients();
  }, [page, searchQuery]);

  // Handle Search Input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  // Check role authorization for write options (Receptionist or Admin)
  const canModify = user?.role === 'admin' || user?.role === 'receptionist';

  // Open Form Modal (Add mode)
  const handleOpenAddModal = () => {
    setSelectedPatient(null);
    setFullName('');
    setAge('');
    setGender('Male');
    setBloodGroup('O+');
    setPhone('');
    setAddress('');
    setEcName('');
    setEcPhone('');
    setEcRelation('Spouse');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open Form Modal (Edit mode)
  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setFullName(patient.fullName);
    setAge(patient.age.toString());
    setGender(patient.gender);
    setBloodGroup(patient.bloodGroup);
    setPhone(patient.phone);
    setAddress(patient.address);
    setEcName(patient.emergencyContact?.name || '');
    setEcPhone(patient.emergencyContact?.phone || '');
    setEcRelation(patient.emergencyContact?.relation || 'Spouse');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open View Profile Modal
  const handleOpenProfileModal = (patient) => {
    setSelectedPatient(patient);
    setIsProfileModalOpen(true);
  };

  // Submit Add / Edit Patient
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Client side regex check
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setFormError('Patient phone number must be between 7 and 15 digits (digits only, optional +).');
      setFormLoading(false);
      return;
    }
    if (!phoneRegex.test(ecPhone)) {
      setFormError('Emergency contact phone number must be between 7 and 15 digits.');
      setFormLoading(false);
      return;
    }

    const payload = {
      fullName,
      age: parseInt(age, 10),
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact: {
        name: ecName,
        phone: ecPhone,
        relation: ecRelation,
      },
    };

    try {
      let response;
      if (selectedPatient) {
        // Edit mode
        response = await fetch(`${API_URL}/patients/${selectedPatient._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Add mode
        response = await fetch(`${API_URL}/patients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const resData = await response.json();
      if (response.ok && resData.success) {
        setIsFormModalOpen(false);
        fetchPatients();
      } else {
        setFormError(resData.message || 'Operation failed. Verify fields.');
      }
    } catch (err) {
      setFormError('Could not contact API server. Verify backend status.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this patient record?')) return;

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        fetchPatients();
      } else {
        alert(resData.message || 'Delete operation failed.');
      }
    } catch (err) {
      alert('Could not contact API server.');
    }
  };

  const handleDownloadQR = (patient) => {
    if (!patient.qrCode) return;
    const link = document.createElement('a');
    link.href = patient.qrCode;
    link.download = `MediQR-${patient.patientId || 'patient'}.png`;
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
                <h4 class="title">${patient.fullName}</h4>
                <p class="subtitle">Age: ${patient.age} &bull; Blood Group: ${patient.bloodGroup}</p>
              </div>
              <span class="badge">MediQR Profile</span>
            </div>
            
            <div class="qr-container">
              <img class="qr-image" src="${patient.qrCode}" alt="QR Code" />
            </div>
            
            <div class="footer">
              <div class="footer-label">Scannable Hospital wristband Key</div>
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

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Patient Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage check-in files, review contact registries, and print digital QR codes.</p>
        </div>
        {canModify && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Patient Profile</span>
          </button>
        )}
      </div>

      {/* Table Actions Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search name, QR ID, phone..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {patients.length} records in this page
        </span>
      </div>

      {/* Main Records Table */}
      <div className="glass-card dark:glass-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-20">
              <span className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin inline-block"></span>
              <p className="text-xs text-slate-400 mt-3 font-semibold">Retrieving patient directories...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold">No patients found</p>
              <p className="text-xs">No database entries match the search keywords.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase">
                  <th className="py-4 px-5">Patient Name</th>
                  <th className="py-4 px-4">QR Code ID</th>
                  <th className="py-4 px-4">Demographics</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4">Emergency Contact</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {patients.map((p) => (
                  <tr key={p._id} className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{p.fullName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.address}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/5 px-2 py-1 rounded-lg inline-block mt-3.5 mx-4">
                      {p.patientId}
                    </td>
                    <td className="py-4 px-4">
                      <div>Age: {p.age} • {p.gender}</div>
                      <div className="text-[10px] text-red-500 font-bold mt-0.5">Blood Type: {p.bloodGroup}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">{p.phone}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{p.emergencyContact?.name}</div>
                      <div className="text-[10px] text-slate-400">{p.emergencyContact?.relation} • {p.emergencyContact?.phone}</div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenProfileModal(p)}
                          title="View Profile / QR"
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-teal-500 transition-colors cursor-pointer border border-slate-100 dark:border-slate-900"
                        >
                          <Eye size={15} />
                        </button>
                        {canModify && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              title="Edit Patient"
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-sky-500 transition-colors cursor-pointer border border-slate-100 dark:border-slate-900"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeletePatient(p._id)}
                              title="Delete Patient"
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-red-500 transition-colors cursor-pointer border border-slate-100 dark:border-slate-900"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination controls footer */}
        <div className="h-16 px-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs text-slate-400 font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ========================================================
          ADD / EDIT MODAL FORM
          ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {selectedPatient ? 'Edit Patient Profile' : 'Intake New Patient'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex gap-2 text-xs">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <p className="leading-relaxed font-semibold">{formError}</p>
                </div>
              )}

              {/* Patient Core Info */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-900 pb-1">
                  1. Clinical Demographics
                </span>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Richard Hendricks"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 29"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 5550199"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Residential Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 123 Health Ave"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact nested */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-900 pb-1">
                  2. Emergency Contact
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={ecName}
                      onChange={(e) => setEcName(e.target.value)}
                      placeholder="e.g. Sarah Hendricks"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={ecPhone}
                      onChange={(e) => setEcPhone(e.target.value)}
                      placeholder="e.g. 5550299"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Relation</label>
                    <select
                      value={ecRelation}
                      onChange={(e) => setEcRelation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex gap-3 border-t border-slate-100 dark:border-slate-900 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <span>{selectedPatient ? 'Save Changes' : 'Generate Profile'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW PATIENT PROFILE MODAL
          ======================================================== */}
      {isProfileModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in relative overflow-hidden">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest">Digital Medical File</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{selectedPatient.fullName}</h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Grid Detail */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-900 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Demographics</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Age {selectedPatient.age} • {selectedPatient.gender}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-900 flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Blood Group</span>
                    <span className="font-semibold text-red-500">{selectedPatient.bloodGroup}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-900 flex items-center gap-2.5 col-span-2">
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Primary Contact</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.phone}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-900 flex items-center gap-2.5 col-span-2">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Home Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.address}</span>
                  </div>
                </div>
              </div>

              {/* Emergency details */}
              <div className="bg-teal-50/20 dark:bg-teal-950/10 border border-teal-500/10 p-4 rounded-xl space-y-1.5">
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">In Case of Emergency (ICE)</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPatient.emergencyContact?.name}</span>
                  <span className="text-slate-400 font-semibold">{selectedPatient.emergencyContact?.relation}</span>
                </div>
                <p className="text-xs font-mono text-slate-500">{selectedPatient.emergencyContact?.phone}</p>
              </div>

              {/* Printable QR Wristband Card */}
              <div className="border-t border-slate-100 dark:border-slate-900 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block mb-3">Wristband QR Profile</span>

                <div id="printable-wristband" className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-xl max-w-xs mx-auto text-left relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl"></div>

                  <div className="flex justify-between items-start mb-3.5">
                    <div>
                      <h4 className="font-black text-sm text-white leading-none">{selectedPatient.fullName}</h4>
                      <p className="text-[9px] text-slate-400 mt-1">Age: {selectedPatient.age} • Blood Group: {selectedPatient.bloodGroup}</p>
                    </div>
                    <span className="text-[8px] font-black text-teal-400 tracking-wider border border-teal-500/20 px-2 py-0.5 rounded bg-teal-950/30 uppercase">
                      Hospital ID
                    </span>
                  </div>

                  {/* Real Generated QR Code */}
                  <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-800">
                    {selectedPatient.qrCode ? (
                      <img
                        src={selectedPatient.qrCode}
                        alt={`QR Code for ${selectedPatient.fullName}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[10px] text-slate-400 text-center font-bold">QR Loading...</div>
                    )}
                  </div>

                  <div className="mt-3.5 border-t border-slate-800/80 pt-2.5 text-center">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Medical QR Code Key</p>
                    <p className="text-xs font-bold text-teal-400 mt-0.5 font-mono">{selectedPatient.patientId}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => handlePrintQR(selectedPatient)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Printer size={14} /> Print Wristband
                  </button>
                  <button
                    onClick={() => handleDownloadQR(selectedPatient)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Download Digital Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
