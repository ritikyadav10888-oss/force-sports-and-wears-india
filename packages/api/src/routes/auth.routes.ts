import { Router } from 'express';
import { register, login, logout, getMe, verifyOtp, resendOtp } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
