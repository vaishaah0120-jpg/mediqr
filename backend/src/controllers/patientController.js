import Patient from '../models/Patient.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Report from '../models/Report.js';
import { mockPatients, mockMedicalRecords, mockReports, mockDoctors } from '../config/mockData.js';
import QRCode from 'qrcode';

// @desc    Create new patient profile
// @route   POST /api/patients
// @access  Private (Admin, Receptionist)
export const createPatient = async (req, res, next) => {
  try {
    const { fullName, age, gender, bloodGroup, phone, address, emergencyContact } = req.body;

    // Generate unique patientId automatically
    let patientId = '';
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const randNum = Math.floor(100000 + Math.random() * 900000);
      patientId = `MEDQR-${randNum}`;
      attempts++;
      
      if (process.env.USE_MOCK_DB === 'true') {
        isUnique = !mockPatients.some((p) => p.patientId === patientId);
      } else {
        const existing = await Patient.findOne({ patientId });
        isUnique = !existing;
      }
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

    if (process.env.USE_MOCK_DB === 'true') {
      const newPatient = {
        _id: `mock-patient-${Date.now()}`,
        patientId,
        fullName,
        age,
        gender,
        bloodGroup,
        phone,
        address,
        emergencyContact,
        qrCode,
      };

      mockPatients.push(newPatient);
      return res.status(201).json({ success: true, data: newPatient });
    }

    const patient = await Patient.create({
      patientId,
      fullName,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      qrCode,
    });
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patient records (supports pagination & search)
// @route   GET /api/patients
// @access  Private (All Roles)
export const getPatients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search || '';

    if (process.env.USE_MOCK_DB === 'true') {
      let list = [...mockPatients];
      
      if (search) {
        const searchLower = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.fullName.toLowerCase().includes(searchLower) ||
            p.patientId.toLowerCase().includes(searchLower) ||
            p.phone.includes(searchLower)
        );
      }
      
      const total = list.length;
      const pages = Math.ceil(total / limit);
      const data = list.slice(startIndex, startIndex + limit);
      
      return res.json({
        success: true,
        pagination: { page, limit, total, pages },
        data,
      });
    }

    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { fullName: searchRegex },
          { patientId: searchRegex },
          { phone: searchRegex },
        ],
      };
    }

    const total = await Patient.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const data = await Patient.find(query).skip(startIndex).limit(limit);

    res.json({
      success: true,
      pagination: { page, limit, total, pages },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient profile by database ObjectId
// @route   GET /api/patients/:id
// @access  Private (All Roles)
export const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const patient = mockPatients.find((p) => p._id === id);
      if (!patient) {
        return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
      }
      return res.json({ success: true, data: patient });
    }

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient profile by QR Code identifier
// @route   GET /api/patients/qr/:qrId
// @access  Private (All Roles)
export const getPatientByQR = async (req, res, next) => {
  try {
    const { qrId } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const patient = mockPatients.find((p) => p.patientId === qrId);
      if (!patient) {
        return res.status(404).json({ success: false, message: `Patient profile not registered for QR code ${qrId}` });
      }
      return res.json({ success: true, data: patient });
    }

    const patient = await Patient.findOne({ patientId: qrId });
    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient profile not registered for QR code ${qrId}` });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Admin, Receptionist)
export const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const patientIndex = mockPatients.findIndex((p) => p._id === id);
      if (patientIndex === -1) {
        return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
      }

      const updated = {
        ...mockPatients[patientIndex],
        ...req.body,
      };

      mockPatients[patientIndex] = updated;
      return res.json({ success: true, data: updated });
    }

    const patient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient profile
// @route   DELETE /api/patients/:id
// @access  Private (Admin, Receptionist)
export const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const patientIndex = mockPatients.findIndex((p) => p._id === id);
      if (patientIndex === -1) {
        return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
      }

      mockPatients.splice(patientIndex, 1);
      return res.json({ success: true, message: 'Patient removed from records' });
    }

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
    }

    res.json({ success: true, message: 'Patient removed from records' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient QR Code base64 image data
// @route   GET /api/patients/:id/qr
// @access  Private (All Roles)
export const getPatientQR = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const patient = mockPatients.find((p) => p._id === id);
      if (!patient) {
        return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
      }
      return res.json({ success: true, qrCode: patient.qrCode, patientId: patient.patientId });
    }

    const patient = await Patient.findById(id).select('qrCode patientId');
    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient not found with id of ${id}` });
    }

    res.json({ success: true, qrCode: patient.qrCode, patientId: patient.patientId });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full patient record (demographics, records, reports) by QR Code patientId
// @route   GET /api/patients/qr/:qrId/full-record
// @access  Private (All Roles)
export const getFullPatientRecordByQR = async (req, res, next) => {
  try {
    const { qrId } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const patient = mockPatients.find((p) => p.patientId === qrId);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: `Patient profile not registered for QR code ${qrId}`,
        });
      }

      // Filter clinical histories from mock list
      const medicalRecordsRaw = mockMedicalRecords.filter((mr) => mr.patientId === patient._id);
      const medicalRecords = medicalRecordsRaw.map((mr) => ({
        ...mr,
        doctorId: mockDoctors.find((d) => d._id === mr.doctorId) || mr.doctorId,
      }));

      // Filter reports from mock list
      const reportsRaw = mockReports.filter((rep) => rep.patientId === patient._id);
      const reports = reportsRaw.map((rep) => ({
        ...rep,
        doctorId: mockDoctors.find((d) => d._id === rep.doctorId) || rep.doctorId,
      }));

      return res.json({
        success: true,
        patient,
        medicalRecords,
        reports,
      });
    }

    const patient = await Patient.findOne({ patientId: qrId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient profile not registered for QR code ${qrId}`,
      });
    }

    // Query databases in parallel
    const [medicalRecords, reports] = await Promise.all([
      MedicalRecord.find({ patientId: patient._id })
        .populate('doctorId')
        .sort({ visitDate: -1 }),
      Report.find({ patientId: patient._id })
        .populate('doctorId')
        .sort({ uploadedAt: -1 }),
    ]);

    res.json({
      success: true,
      patient,
      medicalRecords,
      reports,
    });
  } catch (error) {
    next(error);
  }
};
