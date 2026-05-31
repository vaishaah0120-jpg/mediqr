export const mockUsers = [
  {
    _id: '60c72b2f9b1d8a23d4567890',
    name: 'System Admin (Demo)',
    email: 'admin@mediqr.com',
    password: 'AdminPass123',
    role: 'admin',
  },
  {
    _id: '60c72b2f9b1d8a23d4567891',
    name: 'Dr. Sarah Connor (Demo)',
    email: 'doctor@mediqr.com',
    password: 'DoctorPass123',
    role: 'doctor',
    specialization: 'Cardiologist',
  },
  {
    _id: '60c72b2f9b1d8a23d4567892',
    name: 'John Doe (Demo)',
    email: 'receptionist@mediqr.com',
    password: 'RecepPass123',
    role: 'receptionist',
  }
];

export const mockPatients = [
  {
    _id: '60c72b2f9b1d8a23d45678a1',
    patientId: 'MEDQR-9021',
    fullName: 'James Carter',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+15550199',
    address: '123 Health Ave, Heart City',
    emergencyContact: {
      name: 'Sarah Carter',
      phone: '+15550198',
      relation: 'Spouse'
    }
  },
  {
    _id: '60c72b2f9b1d8a23d45678a2',
    patientId: 'MEDQR-8041',
    fullName: 'Clara Oswald',
    age: 28,
    gender: 'Female',
    bloodGroup: 'A-',
    phone: '+15550244',
    address: '42 TARDIS Ln, Chronos City',
    emergencyContact: {
      name: 'Danny Pink',
      phone: '+15550245',
      relation: 'Fiance'
    }
  },
  {
    _id: '60c72b2f9b1d8a23d45678a3',
    patientId: 'MEDQR-3311',
    fullName: 'Marcus Aurelius',
    age: 62,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+15550881',
    address: '1 Forum Way, Ancient Rome',
    emergencyContact: {
      name: 'Commodus',
      phone: '+15550882',
      relation: 'Son'
    }
  }
];

export const mockDoctors = [
  {
    _id: '60c72b2f9b1d8a23d45678b1',
    user: '60c72b2f9b1d8a23d4567891', // Dr Sarah Connor User ID
    doctorId: 'DOC-9021',
    fullName: 'Dr. Sarah Connor',
    specialization: 'Cardiologist',
    phone: '+15550301'
  }
];

export const mockAppointments = [
  {
    _id: '60c72b2f9b1d8a23d45678c1',
    patientId: '60c72b2f9b1d8a23d45678a1', // James Carter
    doctorId: '60c72b2f9b1d8a23d45678b1', // Dr Sarah Connor
    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'Scheduled'
  },
  {
    _id: '60c72b2f9b1d8a23d45678c2',
    patientId: '60c72b2f9b1d8a23d45678a2', // Clara Oswald
    doctorId: '60c72b2f9b1d8a23d45678b1', // Dr Sarah Connor
    appointmentDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    status: 'Scheduled'
  }
];

export const mockMedicalRecords = [
  {
    _id: '60c72b2f9b1d8a23d45678d1',
    patientId: '60c72b2f9b1d8a23d45678a1',
    doctorId: '60c72b2f9b1d8a23d45678b1',
    diagnosis: 'Hypertension Stage 1',
    symptoms: 'Mild chest tightness, blood pressure 135/85',
    prescription: 'Lisinopril 10mg once daily',
    notes: 'Follow-up BP readings daily for 2 weeks.',
    visitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockReports = [
  {
    _id: '60c72b2f9b1d8a23d45678e1',
    patientId: '60c72b2f9b1d8a23d45678a1',
    doctorId: '60c72b2f9b1d8a23d45678b1',
    reportName: 'Electrocardiogram (ECG) Report',
    fileUrl: 'http://localhost:5000/public/uploads/reports/ecg_james_carter.pdf',
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];
