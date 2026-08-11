import express from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateDoctor } from '../middleware/validationMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getDoctors)
  .post(protect, authorize('admin'), validateDoctor, createDoctor);

router.get('/public', getDoctors);

router
  .route('/:id')
  .get(protect, getDoctorById)
  .put(protect, authorize('admin', 'doctor'), validateDoctor, updateDoctor);

export default router;
