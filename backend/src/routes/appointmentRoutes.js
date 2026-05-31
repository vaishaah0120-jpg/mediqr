import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateAppointment } from '../middleware/validationMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAppointments)
  .post(protect, authorize('admin', 'receptionist'), validateAppointment, createAppointment);

router.route('/:id').put(protect, updateAppointmentStatus);

router.get('/doctor/:doctorId', protect, getAppointmentsByDoctor);
router.get('/patient/:patientId', protect, getAppointmentsByPatient);

export default router;
