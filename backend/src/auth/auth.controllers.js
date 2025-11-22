import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import nodemailer from 'nodemailer';

// ---------- SEND EMAIL ----------
const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  });
};

// ---------- SIGNUP ----------
const signUp = async (req, res) => {
  const { loginId, email, password, role } = req.body;

  try {
    if (!loginId) return res.status(400).json({ message: 'Login ID is required' });
    if (loginId.length < 6 || loginId.length > 12) {
      return res.status(400).json({ message: 'Login ID must be between 6 and 12 characters' });
    }

    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const passwordRules =
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8;

    if (!passwordRules) {
      return res.status(400).json({
        message:
          'Password must contain lowercase, uppercase, number and special character. Minimum 8 characters required',
      });
    }

    const existingUser = await prisma.Users.findFirst({
      where: { OR: [{ loginId }, { email }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Login ID or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.Users.create({
      data: {
        loginId,
        email,
        password: hashedPassword,
        role: role || 'staff',
      },
    });

    const token = jwt.sign(
      { userId: user.id, loginId: user.loginId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      loginId: user.loginId,
      role: user.role,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- SIGNIN ----------
const signIn = async (req, res) => {
  const { loginId, password } = req.body;

  try {
    if (!loginId) return res.status(400).json({ message: 'Login ID is required' });
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const user = await prisma.Users.findUnique({
      where: { loginId },
    });

    if (!user) return res.status(400).json({ message: 'Invalid Login ID or Password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Login ID or Password' });

    const token = jwt.sign(
      { userId: user.id, loginId: user.loginId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Signin successful',
      token,
      loginId: user.loginId,
      role: user.role,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- FORGOT PASSWORD (Send OTP) ----------
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- VERIFY OTP ----------
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await prisma.otp.findFirst({
      where: { email, code: otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) return res.status(400).json({ message: 'Invalid OTP' });

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- RESET PASSWORD ----------
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!newPassword) return res.status(400).json({ message: 'New password is required' });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.Users.update({
      where: { email },
      data: { password: hashed },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { signUp, signIn, forgotPassword, verifyOtp, resetPassword };
