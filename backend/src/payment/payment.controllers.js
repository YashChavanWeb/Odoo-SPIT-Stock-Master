import Razorpay from 'razorpay';
import { prisma } from '../utils/prisma.js';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order (protected route)
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Check if user exists
    const user = await prisma.Users.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create order on Razorpay
    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 100000)}`,
    };
    const order = await razorpay.orders.create(options);

    // Save payment in DB
    const payment = await prisma.payment.create({
      data: {
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'created',
        userId: user.id,
      },
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: payment.status,
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

// Get Payment Details (robust)
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // First, fetch payment from Prisma DB
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: paymentId }, // ensure payment exists
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found in DB' });
    }

    if (!payment.razorpayPaymentId) {
      return res.status(400).json({
        message: 'Payment not completed yet, Razorpay payment ID not available',
      });
    }

    // Fetch from Razorpay
    const razorpayPayment = await razorpay.payments.fetch(
      payment.razorpayPaymentId
    );

    res.status(200).json(razorpayPayment);
  } catch (err) {
    console.error('Error fetching payment:', err);
    res.status(500).json({ message: 'Failed to fetch payment details' });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    if (!paymentId || !status) {
      return res
        .status(400)
        .json({ message: 'Payment ID and status required' });
    }

    // Find payment in DB
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: paymentId },
    });

    if (!payment || payment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: 'You can only update your own payments' });
    }

    // Update DB
    const updatedPayment = await prisma.payment.update({
      where: { razorpayOrderId: paymentId },
      data: { status },
    });

    res.status(200).json(updatedPayment);
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};
