import mongoose from 'mongoose';

/**
 * User model:
 * - nickname: unique, min 3 characters
 * - email: unique, validated
 * - password: bcrypt hash of 4-digit PIN (set after email verification)
 * - isVerified: email verification status
 * - verificationCode: 4-digit code (stored during registration, cleared after verification)
 * - codeExpiresAt: expiration time for verification code (10 minutes)
 * - pinHash: legacy field (kept for compatibility, maps to password)
 */
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: null }, // Hashed password (4-digit PIN)
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null },
  codeExpiresAt: { type: Date, default: null },
  pinHash: { type: String, default: null }, // Legacy field for compatibility
}, { timestamps: true });

export default mongoose.model('User', userSchema);
