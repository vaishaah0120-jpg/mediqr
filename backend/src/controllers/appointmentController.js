import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { mockAppointments, mockPatients, mockDoctors } from '../config/mockData.js';
import QRCode from 'qrcode';

// @desc    Schedule a new appointment
// @route   POST /api/appointments
// @access  Private (Admin, Receptionist)
export const createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate, status } = req.body;

    if (process.env.USE_MOCK_DB === 'true') {
      // Validate that patient and doctor exist in mocks
      const patientExists = mockPatients.some((p) => p._id === patientId);
      const doctorExists = mockDoctors.some((d) => d._id === doctorId);

      if (!patientExists || !doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Referenced Patient or Doctor ID does not exist in seed databases',
        });
      }

      const newAppointment = {
        _id: `mock-app-${Date.now()}`,
        patientId,
        doctorId,
        appointmentDate,
        status: status || 'Scheduled',
      };

      mockAppointments.push(newAppointment);
      return res.status(201).json({ success: true, data: newAppointment });
    }

    const appointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (All Roles)
export const getAppointments = async (req, res, next) => {
  try {
    if (process.env.USE_MOCK_DB === 'true') {
      // Map mock populated models
      const populated = mockAppointments.map((app) => ({
        ...app,
        patientId: mockPatients.find((p) => p._id === app.patientId) || app.patientId,
        doctorId: mockDoctors.find((d) => d._id === app.doctorId) || app.doctorId,
      }));
      return res.json({ success: true, count: populated.length, data: populated });
    }

    const appointments = await Appointment.find()
      .populate('patientId')
      .populate('doctorId');
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments by Doctor ID
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private (Admin, Doctor)
export const getAppointmentsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const list = mockAppointments.filter((app) => app.doctorId === doctorId);
      const populated = list.map((app) => ({
        ...app,
        patientId: mockPatients.find((p) => p._id === app.patientId) || app.patientId,
        doctorId: mockDoctors.find((d) => d._id === app.doctorId) || app.doctorId,
      }));
      return res.json({ success: true, count: populated.length, data: populated });
    }

    const appointments = await Appointment.find({ doctorId })
      .populate('patientId')
      .populate('doctorId');
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments by Patient ID
// @route   GET /api/appointments/patient/:patientId
// @access  Private (All Roles)
export const getAppointmentsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const list = mockAppointments.filter((app) => app.patientId === patientId);
      const populated = list.map((app) => ({
        ...app,
        patientId: mockPatients.find((p) => p._id === app.patientId) || app.patientId,
        doctorId: mockDoctors.find((d) => d._id === app.doctorId) || app.doctorId,
      }));
      return res.json({ success: true, count: populated.length, data: populated });
    }

    const appointments = await Appointment.find({ patientId })
      .populate('patientId')
      .populate('doctorId');
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (All Roles)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Invalid appointment status value',
      });
    }

    if (process.env.USE_MOCK_DB === 'true') {
      const appIndex = mockAppointments.findIndex((app) => app._id === id);
      if (appIndex === -1) {
        return res.status(404).json({ success: false, message: `Appointment not found with ID ${id}` });
      }

      mockAppointments[appIndex].status = status;
      return res.json({ success: true, data: mockAppointments[appIndex] });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: `Appointment not found with ID ${id}` });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Public endpoint to book appointment (creates or finds patient profile automatically)
// @route   POST /api/appointments/public
// @access  Public
export const createPublicAppointment = async (req, res, next) => {
  try {
    const {
      fullName,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      doctorId,
      appointmentDate,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !age ||
      !gender ||
      !bloodGroup ||
      !phone ||
      !address ||
      !emergencyContactName ||
      !emergencyContactPhone ||
      !emergencyContactRelation ||
      !doctorId ||
      !appointmentDate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: All fields are required to book an appointment.',
      });
    }

    // Verify appointment date is valid and in the future
    const date = new Date(appointmentDate);
    if (isNaN(date.getTime()) || date < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Appointment date must be a valid future date.',
      });
    }

    let patientRecord = null;

    if (process.env.USE_MOCK_DB === 'true') {
      // Check if patient already exists in mocks by phone
      patientRecord = mockPatients.find((p) => p.phone === phone);

      if (!patientRecord) {
        // Generate patientId
        let patientId = '';
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
          const randNum = Math.floor(100000 + Math.random() * 900000);
          patientId = `MEDQR-${randNum}`;
          attempts++;
          isUnique = !mockPatients.some((p) => p.patientId === patientId);
        }

        // Generate QR code
        const qrCode = await QRCode.toDataURL(patientId, {
          errorCorrectionLevel: 'H',
          margin: 2,
          scale: 8,
        });

        patientRecord = {
          _id: `mock-patient-${Date.now()}`,
          patientId,
          fullName,
          age: parseInt(age, 10),
          gender,
          bloodGroup,
          phone,
          address,
          emergencyContact: {
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relation: emergencyContactRelation,
          },
          qrCode,
        };

        mockPatients.push(patientRecord);
      }

      // Check if doctor exists
      const doctorExists = mockDoctors.some((d) => d._id === doctorId);
      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Referenced Doctor ID does not exist in databases',
        });
      }

      const newAppointment = {
        _id: `mock-app-${Date.now()}`,
        patientId: patientRecord._id,
        doctorId,
        appointmentDate: date.toISOString(),
        status: 'Scheduled',
      };

      mockAppointments.push(newAppointment);

      return res.status(201).json({
        success: true,
        data: {
          appointment: newAppointment,
          patient: patientRecord,
        },
      });
    }

    // REAL DB FLOW
    // Check if patient already exists by phone
    patientRecord = await Patient.findOne({ phone });

    if (!patientRecord) {
      // Generate unique patientId
      let patientId = '';
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        const randNum = Math.floor(100000 + Math.random() * 900000);
        patientId = `MEDQR-${randNum}`;
        attempts++;
        const existing = await Patient.findOne({ patientId });
        isUnique = !existing;
      }

      if (!isUnique) {
        return res.status(500).json({
          success: false,
          message: 'System error: failed to generate a unique Patient QR identifier. Please try again.',
        });
      }

      // Generate QR Code data URL (base64 image)
      const qrCode = await QRCode.toDataURL(patientId, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 8,
      });

      patientRecord = await Patient.create({
        patientId,
        fullName,
        age: parseInt(age, 10),
        gender,
        bloodGroup,
        phone,
        address,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relation: emergencyContactRelation,
        },
        qrCode,
      });
    }

    // Verify doctor exists in DB
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Referenced Doctor ID does not exist in databases',
      });
    }

    const appointment = await Appointment.create({
      patientId: patientRecord._id,
      doctorId,
      appointmentDate: date,
      status: 'Scheduled',
    });

    res.status(201).json({
      success: true,
      data: {
        appointment,
        patient: patientRecord,
      },
    });
  } catch (error) {
    next(error);
  }
};
