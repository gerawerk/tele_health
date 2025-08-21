import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. 'Monday'
  timeSlots: [{ start: String, end: String }], // e.g. 10:00 - 12:00
});

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['doctor', 'patient', 'admin'],
    required: true,
  },

  // Common
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  profileImage: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere',
    },
    address: { type: String },
    city: { type: String },
  },

  // Doctor-specific
  specialization: { type: String },
  bio: { type: String },
  averageRating: { type: Number, default: 0 },
  availability: [availabilitySchema],
  licenseNumber: { type: String },

  // Patient-specific
  age: { type: Number },
  medicalHistory: [{ condition: String, date: Date }],
  allergies: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
