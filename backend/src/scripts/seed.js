import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from '../utils/seeder.js';

dotenv.config();

const runSeed = async () => {
  try {
    console.log('Connecting to database to seed...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    await seedDatabase({ clearExisting: true });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

runSeed();

