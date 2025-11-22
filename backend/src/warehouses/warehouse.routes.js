import express from 'express';
import {
  createWarehouse,
  getShortCodes,
  updateWarehouse,
} from './warehouse.controller.js';

const router = express.Router();

router.post('/create', createWarehouse);
router.patch('/update/:id', updateWarehouse);
router.get('/short-codes', getShortCodes);

export default router;
