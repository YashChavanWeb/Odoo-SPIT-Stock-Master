import express from 'express';
import {
  createOrder,
  getPaymentDetails,
  updatePaymentStatus,
} from './payment.controllers.js';
import { authMiddleware } from '../auth/auth.middlewares.js';

const router = express.Router();

router.post('/order', authMiddleware, createOrder);
router.get('/details/:paymentId', authMiddleware, getPaymentDetails);
router.patch('/update-status', authMiddleware, updatePaymentStatus);

export default router;
