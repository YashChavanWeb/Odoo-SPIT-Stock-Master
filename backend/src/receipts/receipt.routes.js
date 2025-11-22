import express from 'express';
import {
  createReceipt,
  getReceipts,
  getSingleReceipt,
  updateReceiptDetails,
  updateReceiptProducts,
  updateReceiptStatus,
} from './receipt.controller.js';

const router = express.Router();

router.post('/create', createReceipt);
router.put('/:id/update/products', updateReceiptProducts);
router.put('/:id/update/details', updateReceiptDetails);
router.patch('/:id/status', updateReceiptStatus);

router.get('/', getReceipts);
router.get('/:id', getSingleReceipt);

export default router;
