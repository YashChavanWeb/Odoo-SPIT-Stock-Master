import express from 'express';
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from './product.controllers.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/create', createProduct);
router.patch('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;
