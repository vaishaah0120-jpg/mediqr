import Report from '../models/Report.js';
import { mockReports, mockPatients, mockDoctors } from '../config/mockData.js';

// @desc    Upload report metadata
// @route   POST /api/reports
// @access  Private (Admin, Doctor, Receptionist)
export const createReport = async (req, res, next) => {
  try {
    const { patientId, doctorId, reportName, fileUrl } = req.body;

    if (process.env.USE_MOCK_DB === 'true') {
      const patientExists = mockPatients.some((p) => p._id === patientId);
      const doctorExists = mockDoctors.some((d) => d._id === doctorId);

      if (!patientExists || !doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Referenced Patient or Doctor ID does not exist in databases',
        });
      }

      const newReport = {
        _id: `mock-rep-${Date.now()}`,
        patientId,
        doctorId,
        reportName,
        fileUrl,
        uploadedAt: new Date().toISOString(),
      };

      mockReports.push(newReport);
      return res.status(201).json({ success: true, data: newReport });
    }

    const report = await Report.create(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports by Patient ID
// @route   GET /api/reports/patient/:patientId
// @access  Private (All Roles)
export const getReportsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const list = mockReports.filter((rep) => rep.patientId === patientId);
      const populated = list.map((rep) => ({
        ...rep,
        patientId: mockPatients.find((p) => p._id === rep.patientId) || rep.patientId,
        doctorId: mockDoctors.find((d) => d._id === rep.doctorId) || rep.doctorId,
      }));
      return res.json({ success: true, count: populated.length, data: populated });
    }

    const reports = await Report.find({ patientId })
      .populate('patientId')
      .populate('doctorId');
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};
