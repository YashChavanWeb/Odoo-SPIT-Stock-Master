import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.Users.findFirst({
      where: {
        OR: [{ email: email }, { name: name }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.Users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Error during signup:', error);

    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.Users.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Signin successful',
      token,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { signUp, signIn };
