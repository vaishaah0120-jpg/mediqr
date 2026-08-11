import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('URI from dotenv:', uri);

try {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('SUCCESS: Connected to MongoDB!');
  await mongoose.disconnect();
} catch (err) {
  console.error('ERROR connecting to MongoDB:', err.message);
  console.error(err);
}
process.exit(0);
