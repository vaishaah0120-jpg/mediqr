import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  getPatientByQR,
  updatePatient,
  deletePatient,
  getPatientQR,
  getFullPatientRecordByQR,
} from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validatePatient } from '../middleware/validationMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getPatients)
  .post(protect, authorize('admin', 'receptionist'), validatePatient, createPatient);

router
  .route('/:id')
  .get(protect, getPatientById)
  .put(protect, authorize('admin', 'receptionist'), validatePatient, updatePatient)
  .delete(protect, authorize('admin', 'receptionist'), deletePatient);

router.get('/:id/qr', protect, getPatientQR);
router.get('/qr/:qrId', protect, getPatientByQR);
router.get('/qr/:qrId/full-record', protect, getFullPatientRecordByQR);

export default router;
