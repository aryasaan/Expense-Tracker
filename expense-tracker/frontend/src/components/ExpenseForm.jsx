import React, { useState, useEffect } from 'react';
import { createExpense, updateExpense, getExpenses } from '../services/expenseService';

// Predefined categories with icons (can be represented with emojis for simplicity)
const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📱' },
  { id: 'health', name: 'Health & Medical', icon: '💊' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'other', name: 'Other', icon: '📦' }
];

const ExpenseForm = ({ currentExpense = null, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});
  const [customCategory, setCustomCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTransactions, setLastTransactions] = useState([]);

  useEffect(() => {
    // Reset form if currentExpense changes
    if (currentExpense) {
      setFormData({
        amount: currentExpense.amount,
        category: currentExpense.category,
        description: currentExpense.description || '',
        date: new Date(currentExpense.date).toISOString().split('T')[0]
      });
    }
    
    // Fetch last few transactions for quick add
    fetchLastTransactions();
  }, [currentExpense]);

  const fetchLastTransactions = async () => {
    try {
      const data = await getExpenses();
      // Get unique transactions by category and description
      const uniqueTransactions = [];
      const seen = new Set();
      
      data.forEach(expense => {
        const key = `${expense.category}-${expense.description}`;
        if (!seen.has(key) && expense.description) {
          seen.add(key);
          uniqueTransactions.push(expense);
        }
      });
      
      setLastTransactions(uniqueTransactions.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch last transactions:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    if (!formData.date) {
      errors.date = 'Please select a date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, category: categoryId });
    if (formErrors.category) {
      setFormErrors({ ...formErrors, category: null });
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      setFormData({ ...formData, category: customCategory.trim() });
      setCustomCategory('');
      if (formErrors.category) {
        setFormErrors({ ...formErrors, category: null });
      }
    }
  };

  const handleQuickAdd = (transaction) => {
    setFormData({
      ...formData,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (currentExpense) {
        await updateExpense(currentExpense._id, formData);
      } else {
        await createExpense(formData);
      }
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Inform parent component if needed
      if (onExpenseAdded) {
        onExpenseAdded();
      }
      
      // Refresh last transactions
      fetchLastTransactions();
    } catch (error) {
      console.error("Failed to save expense:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-6">
        {currentExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Expense {currentExpense ? 'updated' : 'added'} successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              className={`border rounded w-full py-2 px-8 ${formErrors.amount ? 'border-red-500' : 'border-gray-300'}`}
              step="0.01"
            />
          </div>
          {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.name)}
                className={`flex items-center justify-center p-2 border rounded ${
                  formData.category === category.name
                    ? 'bg-blue-100 border-blue-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
          
          <div className="flex mt-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Custom category"
              className="flex-1 border border-gray-300 rounded-l p-2"
            />
            <button
              type="button"
              onClick={handleCustomCategorySubmit}
              className="bg-gray-200 px-4 py-2 rounded-r border-t border-r border-b border-gray-300"
            >
              Add
            </button>
          </div>
          {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            placeholder="What did you spend on?"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 text-white py-2 rounded ${
            submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Saving...' : currentExpense ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
      
      {lastTransactions.length > 0 && !currentExpense && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add from Recent Transactions</h3>
          <div className="space-y-2">
            {lastTransactions.map((transaction, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickAdd(transaction)}
                className="flex justify-between items-center w-full p-2 text-left border rounded hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    {CATEGORIES.find(cat => cat.name === transaction.category)?.icon || '📦'}
                  </span>
                  <span className="text-sm">{transaction.description}</span>
                </span>
                <span className="text-sm font-medium">₹{transaction.amount}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseForm;