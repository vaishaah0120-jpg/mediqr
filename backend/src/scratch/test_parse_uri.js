import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const rawUri = process.env.MONGO_URI;
// Replace Ovi$12345 with Ovi%2412345
const encodedUri = rawUri.replace('Ovi$12345', 'Ovi%2412345');

console.log('Testing raw URI connection...');
mongoose.connect(rawUri)
  .then(() => console.log('Raw URI connected!'))
  .catch(err => console.log('Raw URI Error:', err.message));

console.log('Testing encoded URI connection...');
mongoose.connect(encodedUri)
  .then(() => console.log('Encoded URI connected!'))
  .catch(err => console.log('Encoded URI Error:', err.message));
