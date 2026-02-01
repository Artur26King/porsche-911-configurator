import { Router } from 'express';
import { register, verify, setPassword, createPIN, login } from '../controllers/authController.js';

const router = Router();

// 1. Registration: nickname + email → sends verification code
router.post('/register', register);

// 2. Verify email: email + code → confirm email only; do not create user or store code
router.post('/verify', verify);

// 3. Set Password: email + 4-digit password → create user with nickname, email, hashed password (verification code discarded)
router.post('/set-password', setPassword);

// 3b. Legacy endpoint: Create PIN (maps to setPassword for backward compatibility)
router.post('/create-pin', createPIN);

// 4. Login: nicknameOrEmail + password → authentication
router.post('/login', login);

export default router;
