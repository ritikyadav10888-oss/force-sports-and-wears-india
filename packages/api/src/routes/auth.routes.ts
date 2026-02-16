import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { sendOtp, verifyOtp } from '../controllers/otp.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

// OTP Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
