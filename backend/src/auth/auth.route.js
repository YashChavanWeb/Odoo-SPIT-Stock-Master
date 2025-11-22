import express from 'express';
import {
  signIn,
  signUp,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from './auth.controllers.js';
import { authMiddleware, isManager } from './auth.middlewares.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

// OTP RESET PASSWORD
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.get('/manager-protected', authMiddleware, isManager, (req, res) => {
  res.json({ message: 'Manager-only route accessed' });
});

export default router;
