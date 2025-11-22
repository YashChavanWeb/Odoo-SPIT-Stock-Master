import express from 'express';
import { signIn, signUp } from './auth.controllers.js';
import { authMiddleware, isAdmin } from './auth.middlewares.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signIn', signIn);
router.get('/admin-protected', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Protected route accessed. Only admins allowed.' });
});

export default router;
