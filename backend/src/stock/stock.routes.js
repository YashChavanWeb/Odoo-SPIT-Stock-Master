import express from 'express';
import { updateStock } from './stock.controller.js';

const router = express.Router();

// update stock
router.put('/update', updateStock);

export default router;
