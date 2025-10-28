import express from 'express';
import {
  getRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense
} from '../controllers/recurringController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRecurringExpenses)
  .post(protect, createRecurringExpense);

router.route('/:id')
  .put(protect, updateRecurringExpense)
  .delete(protect, deleteRecurringExpense);

export default router;
