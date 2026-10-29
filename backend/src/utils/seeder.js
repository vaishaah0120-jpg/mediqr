import QRCode from 'qrcode';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Report from '../models/Report.js';
import {
  mockUsers,
  mockPatients,
  mockDoctors,
  mockAppointments,
  mockMedicalRecords,
  mockReports,
} from '../config/mockData.js';

export const seedDatabase = async ({ clearExisting = false } = {}) => {
  if (process.env.USE_MOCK_DB === 'true') {
    return { success: true, message: 'Running in mock DB mode; mock data already active.' };
  }

  if (clearExisting) {
    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Report.deleteMany();
  }

  console.log('Seeding users...');
  for (const u of mockUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
    }
  }

  console.log('Seeding doctors...');
  for (const d of mockDoctors) {
    const exists = await Doctor.findOne({ doctorId: d.doctorId });
    if (!exists) {
      await Doctor.create(d);
    }
  }

  console.log('Seeding patients...');
  for (const p of mockPatients) {
    const exists = await Patient.findOne({ patientId: p.patientId });
    if (!exists) {
      const patientData = { ...p };
      if (!patientData.qrCode) {
        patientData.qrCode = await QRCode.toDataURL(patientData.patientId, {
          errorCorrectionLevel: 'H',
          margin: 2,
          scale: 8,
        });
      }
      await Patient.create(patientData);
    }
  }

  console.log('Seeding appointments...');
  const apptCount = await Appointment.countDocuments();
  if (apptCount === 0) {
    for (const a of mockAppointments) {
      await Appointment.create(a);
    }
  }

  console.log('Seeding medical records...');
  const recCount = await MedicalRecord.countDocuments();
  if (recCount === 0) {
    for (const r of mockMedicalRecords) {
      await MedicalRecord.create(r);
    }
  }

  console.log('Seeding reports...');
  const repCount = await Report.countDocuments();
  if (repCount === 0) {
    for (const rep of mockReports) {
      await Report.create(rep);
    }
  }

  return { success: true, message: 'Database seeded successfully with demo data.' };
};

export const autoSeedIfEmpty = async () => {
  if (process.env.USE_MOCK_DB === 'true') return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Auto-seeding initial demo data...');
      await seedDatabase({ clearExisting: false });
      console.log('✅ Auto-seeding completed successfully.');
    }
  } catch (error) {
    console.error('Failed to auto-seed database:', error.message);
  }
};
