import express from 'express';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal
} from '../controllers/savingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getSavingsGoals)
  .post(protect, createSavingsGoal);

router.route('/:id')
  .put(protect, updateSavingsGoal)
  .delete(protect, deleteSavingsGoal);

export default router;
