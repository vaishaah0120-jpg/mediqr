import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Emergency contact name is required'],
  },
  phone: {
    type: String,
    required: [true, 'Emergency contact phone is required'],
  },
  relation: {
    type: String,
    required: [true, 'Emergency contact relation is required'],
  },
});

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, 'Patient QR identifier is required'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not a valid gender (Male, Female, Other)',
      },
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: [true, 'Emergency contact details are required'],
    },
    qrCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
