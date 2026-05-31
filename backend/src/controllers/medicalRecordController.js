import MedicalRecord from '../models/MedicalRecord.js';
import { mockMedicalRecords, mockPatients, mockDoctors } from '../config/mockData.js';

// @desc    Create a new medical EMR record entry
// @route   POST /api/medical-records
// @access  Private (Admin, Doctor)
export const createMedicalRecord = async (req, res, next) => {
  try {
    const { patientId, doctorId, diagnosis, symptoms, prescription, notes } = req.body;

    if (process.env.USE_MOCK_DB === 'true') {
      // Validate patient and doctor exist
      const patientExists = mockPatients.some((p) => p._id === patientId);
      const doctorExists = mockDoctors.some((d) => d._id === doctorId);

      if (!patientExists || !doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Referenced Patient or Doctor ID does not exist in databases',
        });
      }

      const newRecord = {
        _id: `mock-mr-${Date.now()}`,
        patientId,
        doctorId,
        diagnosis,
        symptoms,
        prescription,
        notes: notes || '',
        visitDate: new Date().toISOString(),
      };

      mockMedicalRecords.push(newRecord);
      return res.status(201).json({ success: true, data: newRecord });
    }

    const record = await MedicalRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get EMR records history by Patient ID
// @route   GET /api/medical-records/patient/:patientId
// @access  Private (All Roles)
export const getMedicalRecordsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const records = mockMedicalRecords.filter((mr) => mr.patientId === patientId);
      const populated = records.map((mr) => ({
        ...mr,
        patientId: mockPatients.find((p) => p._id === mr.patientId) || mr.patientId,
        doctorId: mockDoctors.find((d) => d._id === mr.doctorId) || mr.doctorId,
      }));
      return res.json({ success: true, count: populated.length, data: populated });
    }

    const records = await MedicalRecord.find({ patientId })
      .populate('patientId')
      .populate('doctorId');
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};
