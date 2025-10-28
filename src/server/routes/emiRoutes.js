import express from 'express';
import {
  getEMIs,
  createEMI,
  updateEMI,
  deleteEMI
} from '../controllers/emiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getEMIs)
  .post(protect, createEMI);

router.route('/:id')
  .put(protect, updateEMI)
  .delete(protect, deleteEMI);

export default router;
