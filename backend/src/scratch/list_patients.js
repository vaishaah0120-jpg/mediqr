import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from '../models/Patient.js';

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  const patients = await Patient.find({});
  console.log(`Found ${patients.length} patients in MongoDB:`);
  for (const p of patients) {
    console.log(`- ID: ${p._id}, patientId: ${p.patientId}, Name: ${p.fullName}, Phone: ${p.phone}`);
  }
  await mongoose.disconnect();
} catch (err) {
  console.error('Error listing patients:', err);
}
process.exit(0);
