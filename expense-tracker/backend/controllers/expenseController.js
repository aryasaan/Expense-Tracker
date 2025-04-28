import Expense from '../models/Expense.js';

// @desc    Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expense
export const addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expense = new Expense({ amount, category, description, date });

  try {
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update expense
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete expense
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
