import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to database to seed...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing collections...');
    
    await User.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Report.deleteMany();
    
    console.log('Creating users...');
    // Seed Users using User.create so password hashing runs correctly.
    for (const u of mockUsers) {
      await User.create(u);
    }
    console.log('Users created.');

    console.log('Creating doctors...');
    for (const d of mockDoctors) {
      await Doctor.create(d);
    }
    console.log('Doctors created.');

    console.log('Creating patients...');
    for (const p of mockPatients) {
      // Pre-generate QR code for patient if it doesn't exist
      if (!p.qrCode) {
        p.qrCode = await QRCode.toDataURL(p.patientId, {
          errorCorrectionLevel: 'H',
          margin: 2,
          scale: 8,
        });
      }
      await Patient.create(p);
    }
    console.log('Patients created.');

    console.log('Creating appointments...');
    for (const a of mockAppointments) {
      await Appointment.create(a);
    }
    console.log('Appointments created.');

    console.log('Creating medical records...');
    for (const r of mockMedicalRecords) {
      await MedicalRecord.create(r);
    }
    console.log('Medical records created.');

    console.log('Creating reports...');
    for (const rep of mockReports) {
      await Report.create(rep);
    }
    console.log('Reports created.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
