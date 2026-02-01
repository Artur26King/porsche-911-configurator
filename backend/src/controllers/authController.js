import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidEmail, isValidNickname, isValidPIN } from '../utils/validation.js';
import { sendVerificationEmail } from '../services/email.js';
import * as pendingRegistrations from '../services/pendingRegistrations.js';

/**
 * Auth flow:
 * 1. Register: nickname + email → send 4-digit code (no DB write).
 * 2. Verify: email + code → confirm email only; do NOT create user or store code as password.
 * 3. Set password: email + user-chosen 4-digit password → create user with nickname, email, hashed password; verification code is discarded.
 * 4. Login: nickname or email + permanent password only (verification code never allows login).
 */
const SALT_ROUNDS = 10;

function generateCode() {
  return String(crypto.randomInt(1000, 9999));
}

/**
 * 1. Register (no DB write)
 * - Validate nickname and email
 * - Ensure nickname/email not already in DB
 * - Generate 4-digit code, store in memory, send via SendGrid
 * - User is not saved until set-password after verification
 */
export async function register(req, res) {
  try {
    const { nickname, email } = req.body;

    if (!nickname?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Nickname and email are required' });
    }

    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidNickname(trimmedNickname)) {
      return res.status(400).json({ error: 'Nickname must be at least 3 characters' });
    }
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existing = await User.findOne({
      $or: [{ nickname: trimmedNickname }, { email: trimmedEmail }],
    });
    if (existing) {
      return res.status(409).json({ error: 'Nickname or email already in use' });
    }

    const code = generateCode();
    pendingRegistrations.add(trimmedNickname, trimmedEmail, code);

    try {
      await sendVerificationEmail(trimmedEmail, code);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
      pendingRegistrations.remove(trimmedEmail);
      return res.status(502).json({
        error: 'Could not send verification email. Please try again later.',
      });
    }

    res.status(201).json({
      message: 'Verification code sent to your email',
      email: trimmedEmail,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * 2. Verify email (code is for confirmation only; do NOT create user or store code as password)
 * - Check code in pending store and mark as verified
 * - Frontend then shows "Set password" screen; user creates permanent password
 */
export async function verify(req, res) {
  try {
    const { email, code } = req.body;

    if (!email?.trim() || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = String(code).trim();
    const result = pendingRegistrations.verifyAndMark(trimmedEmail, trimmedCode);

    if (!result) {
      return res.status(400).json({
        error: 'Invalid or expired verification code. Please request a new one.',
      });
    }

    const existing = await User.findOne({
      $or: [{ nickname: result.nickname }, { email: result.email }],
    });
    if (existing) {
      pendingRegistrations.remove(trimmedEmail);
      return res.status(409).json({ error: 'User already registered. Use login instead.' });
    }

    res.json({
      message: 'Email verified. Create your password on the next screen.',
      emailVerified: true,
      email: result.email,
      nickname: result.nickname,
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
}

/**
 * 3. Set permanent password (first and only password stored; verification code is never stored)
 * - Requires verified pending registration (user just verified email)
 * - Create user in DB with nickname, email, and hashed user-chosen password
 * - Pending entry and verification code are discarded; only permanent password allows login
 */
export async function setPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = String(password).trim();

    if (!isValidPIN(trimmedPassword)) {
      return res.status(400).json({ error: 'Password must be exactly 4 digits' });
    }

    const pendingData = pendingRegistrations.takeVerified(trimmedEmail);
    if (!pendingData) {
      return res.status(403).json({
        error: 'Email must be verified first. Enter the code from your email, then set your password.',
      });
    }

    const existing = await User.findOne({
      $or: [{ nickname: pendingData.nickname }, { email: pendingData.email }],
    });
    if (existing) {
      return res.status(409).json({ error: 'User already registered. Use login instead.' });
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);

    await User.create({
      nickname: pendingData.nickname,
      email: pendingData.email,
      password: passwordHash,
      pinHash: passwordHash,
      isVerified: true,
    });

    res.status(201).json({
      message: 'Password created. You can now log in with your nickname or email and this password.',
    });
  } catch (err) {
    console.error('Set password error:', err);
    res.status(500).json({ error: 'Failed to set password' });
  }
}

/**
 * Legacy: Create PIN maps to set-password
 */
export async function createPIN(req, res) {
  req.body.password = req.body.pin;
  return setPassword(req, res);
}

/**
 * 4. Login
 * - Find user by nickname OR email
 * - Compare password with stored bcrypt hash
 * - Return user only on correct credentials
 */
export async function login(req, res) {
  try {
    const { nicknameOrEmail, password } = req.body;

    if (!nicknameOrEmail?.trim() || password == null || password === '') {
      return res.status(400).json({ error: 'Nickname/email and password are required' });
    }

    const trimmedInput = String(nicknameOrEmail).trim();
    const trimmedPassword = String(password).trim();

    if (!isValidPIN(trimmedPassword)) {
      return res.status(400).json({ error: 'Password must be exactly 4 digits' });
    }

    const user = await User.findOne({
      $or: [
        { nickname: trimmedInput },
        { email: trimmedInput.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Incorrect nickname, email, or password' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Email not verified. Please verify your email first.' });
    }

    const storedHash = user.password || user.pinHash;
    if (!storedHash) {
      return res.status(403).json({ error: 'Account not set up. Please complete registration.' });
    }

    const match = await bcrypt.compare(trimmedPassword, storedHash);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect nickname, email, or password' });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    const token = jwt.sign(
      { userId: user._id.toString() },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        nickname: user.nickname,
        email: user.email,
        emailVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}
