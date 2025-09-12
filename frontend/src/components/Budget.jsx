import React, { useState, useEffect } from 'react';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { getExpenses } from '../services/expenseService';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' // monthly or weekly
  });

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBudget(formData);
      setFormData({ category: '', amount: '', period: 'monthly' });
      setShowBudgetForm(false);
      fetchBudgets();
    } catch (error) {
      console.error("Failed to create budget:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  // Calculate spent amount for each budget
  const calculateSpentAmount = (category, period) => {
    const now = new Date();
    let startDate;
    
    if (period === 'weekly') {
      // Start of current week (Sunday)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Start of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return expenses
      .filter(expense => 
        expense.category === category && 
        new Date(expense.date) >= startDate
      )
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <button 
          onClick={() => setShowBudgetForm(!showBudgetForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showBudgetForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showBudgetForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              name="category" 
              placeholder="Category" 
              value={formData.category} 
              onChange={handleChange} 
              required 
              className="border p-2"
            />
            <input 
              type="number" 
              name="amount" 
              placeholder="Budget Amount" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
              className="border p-2"
            />
            <select 
              name="period" 
              value={formData.period} 
              onChange={handleChange} 
              className="border p-2"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Budget
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(budget => {
          const spent = calculateSpentAmount(budget.category, budget.period);
          const percentage = (spent / budget.amount) * 100;
          const isOverBudget = spent > budget.amount;
          
          return (
            <div key={budget._id} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{budget.category}</h3>
                <span className="text-sm text-gray-600">
                  {budget.period === 'monthly' ? 'Monthly' : 'Weekly'}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span>₹{spent.toFixed(2)} spent</span>
                <span>of ₹{budget.amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className={`${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                  {percentage.toFixed(0)}%
                </span>
                <button 
                  onClick={() => handleDelete(budget._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {budgets.length === 0 && (
        <div className="text-center p-4 border rounded bg-gray-50">
          <p>No budgets set. Add your first budget to track spending.</p>
        </div>
      )}
    </div>
  );
};

export default Budget;