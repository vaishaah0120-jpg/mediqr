import Doctor from '../models/Doctor.js';
import { mockDoctors } from '../config/mockData.js';

// @desc    Create new doctor profile
// @route   POST /api/doctors
// @access  Private (Admin)
export const createDoctor = async (req, res, next) => {
  try {
    const { user, doctorId, fullName, specialization, phone } = req.body;

    if (process.env.USE_MOCK_DB === 'true') {
      if (mockDoctors.some((d) => d.doctorId === doctorId)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate value entered for doctorId '${doctorId}'. That resource already exists.`,
        });
      }

      const newDoctor = {
        _id: `mock-doctor-${Date.now()}`,
        user: user || `mock-user-${Date.now()}`,
        doctorId,
        fullName,
        specialization,
        phone,
      };

      mockDoctors.push(newDoctor);
      return res.status(201).json({ success: true, data: newDoctor });
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctor profiles
// @route   GET /api/doctors
// @access  Private (All Roles)
export const getDoctors = async (req, res, next) => {
  try {
    if (process.env.USE_MOCK_DB === 'true') {
      return res.json({ success: true, count: mockDoctors.length, data: mockDoctors });
    }

    const doctors = await Doctor.find().populate('user', 'name email');
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor profile by ID
// @route   GET /api/doctors/:id
// @access  Private (All Roles)
export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const doctor = mockDoctors.find((d) => d._id === id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: `Doctor profile not found with ID ${id}` });
      }
      return res.json({ success: true, data: doctor });
    }

    const doctor = await Doctor.findById(id).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: `Doctor profile not found with ID ${id}` });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Admin, Doctor Self)
export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const doctorIndex = mockDoctors.findIndex((d) => d._id === id);
      if (doctorIndex === -1) {
        return res.status(404).json({ success: false, message: `Doctor profile not found with ID ${id}` });
      }

      const updated = {
        ...mockDoctors[doctorIndex],
        ...req.body,
      };

      mockDoctors[doctorIndex] = updated;
      return res.json({ success: true, data: updated });
    }

    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: `Doctor profile not found with ID ${id}` });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};
