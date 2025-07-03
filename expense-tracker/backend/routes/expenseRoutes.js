import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense,getExpenseById } from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

router.get('/:id', getExpenseById);

export default router;
