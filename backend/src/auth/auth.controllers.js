import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

// Signup
const signUp = async (req, res) => {
  const { loginId, email, password, role } = req.body;

  try {
    // Validate loginId
    if (!loginId || loginId.length < 6 || loginId.length > 12) {
      return res.status(400).json({ message: 'Login ID must be 6 to 12 characters long' });
    }

    // Validate password strength
    const passCheck =
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8;

    if (!passCheck) {
      return res.status(400).json({
        message:
          'Password must contain lowercase, uppercase, number, special character and be at least 8 characters long',
      });
    }

    // Check if email or loginId already exists
    const existingUser = await prisma.Users.findFirst({
      where: {
        OR: [{ email }, { loginId }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.Users.create({
      data: {
        loginId,
        email,
        password: hashedPassword,
        role: role || 'staff',
      },
    });

    // Create token
    const token = jwt.sign(
      { userId: user.id, loginId: user.loginId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created',
      token,
      loginId: user.loginId,
      role: user.role,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Signin
const signIn = async (req, res) => {
  const { loginId, password } = req.body;

  try {
    const user = await prisma.Users.findUnique({
      where: { loginId },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Login ID or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Login ID or Password' });
    }

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

export { signUp, signIn };
