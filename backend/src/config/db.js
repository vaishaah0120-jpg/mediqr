import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.warn(`\n⚠️  [DATABASE WARNING] Could not connect to MongoDB: ${error.message}`);
    console.warn(`⚠️  [DATABASE WARNING] Falling back to IN-MEMORY Mock Database for local demonstration.\n`);
    process.env.USE_MOCK_DB = 'true';
    
    try {
      // Auto-generate QR codes for seeded mock patients
      const QRCode = await import('qrcode');
      const { mockPatients } = await import('./mockData.js');
      for (const p of mockPatients) {
        if (!p.qrCode) {
          p.qrCode = await QRCode.default.toDataURL(p.patientId, {
            errorCorrectionLevel: 'H',
            margin: 2,
            scale: 8,
          });
        }
      }
    } catch (qrErr) {
      console.error('Failed to pre-generate QR codes for mock patients:', qrErr);
    }
  }
};

export default connectDB;
