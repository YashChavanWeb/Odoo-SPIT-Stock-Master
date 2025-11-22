import express from 'express';
import {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
} from './locations.controller.js';

const router = express.Router();

router.post('/create', createLocation);
router.get('/all', getLocations);
router.patch('/update/:id', updateLocation);
router.delete('/delete/:id', deleteLocation);

export default router;
