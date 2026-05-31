import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    console.log('Connecting to database to seed...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing users collection...');
    
    await User.deleteMany();
    
    console.log('Creating seed users...');

    const users = [
      {
        name: 'System Admin',
        email: 'admin@mediqr.com',
        password: 'AdminPass123',
        role: 'admin',
      },
      {
        name: 'Dr. Sarah Connor',
        email: 'doctor@mediqr.com',
        password: 'DoctorPass123',
        role: 'doctor',
        specialization: 'Cardiologist',
      },
      {
        name: 'John Doe',
        email: 'receptionist@mediqr.com',
        password: 'RecepPass123',
        role: 'receptionist',
      },
    ];

    // Using insertMany runs standard validation. Each user will be saved and their password hashed.
    for (const u of users) {
      await User.create(u);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedUsers();
