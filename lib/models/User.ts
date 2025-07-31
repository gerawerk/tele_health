// lib/models/userModel.ts
import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  role: 'doctor' | 'patient';
  isVerified: boolean;
  verificationDocuments: string[];
  profileImage?: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  totalReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    dateOfBirth: { type: Date, required: false },
    role: { type: String, enum: ['doctor', 'patient'], required: false, default: 'patient' },
    isVerified: { type: Boolean, default: false },
    verificationDocuments: { type: [String], default: [] },
    profileImage: { type: String },
    specialization: { type: String },
    experience: { type: Number },
    rating: { type: Number },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);