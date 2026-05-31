import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecordsByPatient,
} from '../controllers/medicalRecordController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateMedicalRecord } from '../middleware/validationMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin', 'doctor'), validateMedicalRecord, createMedicalRecord);

router.get('/patient/:patientId', protect, getMedicalRecordsByPatient);

export default router;
