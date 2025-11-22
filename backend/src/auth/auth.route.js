import express from 'express';
import { signIn, signUp } from './auth.controllers.js';
import { authMiddleware, isManager } from './auth.middlewares.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.get('/manager-protected', authMiddleware, isManager, (req, res) => {
  res.json({ message: 'Manager-only route accessed' });
});

export default router;
