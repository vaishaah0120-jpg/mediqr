import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Error Handler Import
import { errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase, autoSeedIfEmpty } from './utils/seeder.js';

// Load environment variables
dotenv.config();

// Connect to Database
await connectDB();
// Auto seed demo data if database is empty
await autoSeedIfEmpty();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/reports', reportRoutes);

// Seed route (convenience endpoint for cloud/demo deployments)
app.all('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase({ clearExisting: req.query.reset === 'true' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Base and health check routes
app.get(['/', '/api'], (req, res) => {
  res.json({ message: 'MediQR API is running...', status: 'online' });
});

// Global Error Handler (must be after routes)
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
