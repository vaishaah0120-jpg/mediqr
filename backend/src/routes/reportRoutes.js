import express from 'express';
import {
  createReport,
  getReportsByPatient,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateReport } from '../middleware/validationMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin', 'doctor', 'receptionist'), validateReport, createReport);

router.get('/patient/:patientId', protect, getReportsByPatient);

export default router;
