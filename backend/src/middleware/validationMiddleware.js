// Middleware to validate incoming request payloads before database operations

export const validatePatient = (req, res, next) => {
  const { fullName, age, gender, bloodGroup, phone, address, emergencyContact } = req.body;

  if (!fullName || !age || !gender || !bloodGroup || !phone || !address || !emergencyContact) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: fullName, age, gender, bloodGroup, phone, address, and emergencyContact are all required',
    });
  }

  if (typeof age !== 'number' || age < 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Age must be a positive number',
    });
  }

  // Simple phone format regex (7-15 digits, optional +)
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Invalid phone number format',
    });
  }

  // Check emergencyContact nested fields
  const { name, phone: ecPhone, relation } = emergencyContact;
  if (!name || !ecPhone || !relation) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Emergency contact must include name, phone, and relation',
    });
  }

  if (!phoneRegex.test(ecPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Invalid emergency contact phone number format',
    });
  }

  next();
};

export const validateDoctor = (req, res, next) => {
  const { doctorId, fullName, specialization, phone } = req.body;

  if (!doctorId || !fullName || !specialization || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: doctorId, fullName, specialization, and phone are all required',
    });
  }

  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Invalid doctor phone number format',
    });
  }

  next();
};

export const validateAppointment = (req, res, next) => {
  const { patientId, doctorId, appointmentDate } = req.body;

  if (!patientId || !doctorId || !appointmentDate) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: patientId, doctorId, and appointmentDate are all required',
    });
  }

  const date = new Date(appointmentDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Invalid appointment date format',
    });
  }

  if (date < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Appointment date must be in the future',
    });
  }

  next();
};

export const validateMedicalRecord = (req, res, next) => {
  const { patientId, diagnosis, symptoms, prescription } = req.body;

  if (!patientId || !diagnosis || !symptoms || !prescription) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: patientId, diagnosis, symptoms, and prescription are all required',
    });
  }

  next();
};

export const validateReport = (req, res, next) => {
  const { patientId, reportName, fileUrl } = req.body;

  if (!patientId || !reportName || !fileUrl) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: patientId, reportName, and fileUrl are all required',
    });
  }

  next();
};
