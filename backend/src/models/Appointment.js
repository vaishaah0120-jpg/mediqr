import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date and time is required'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Scheduled', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid status (Scheduled, Completed, Cancelled)',
      },
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
