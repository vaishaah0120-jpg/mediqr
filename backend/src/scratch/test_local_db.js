import mongoose from 'mongoose';

const localUri = 'mongodb://127.0.0.1:27017/mediqr';
try {
  console.log('Connecting to local MongoDB...');
  await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
  console.log('SUCCESS: Connected to local MongoDB!');
  await mongoose.disconnect();
} catch (err) {
  console.error('ERROR connecting to local MongoDB:', err.message);
}
process.exit(0);
