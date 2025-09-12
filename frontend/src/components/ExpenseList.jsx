import React, { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../services/expenseService';
import { useNavigate } from 'react-router-dom';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    searchTerm: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters, sortConfig]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (_id) => {
    try {
      await deleteExpense(_id);
      setExpenses(prev => prev.filter(exp => exp._id !== _id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (_id) => {
    navigate(`/expenses/edit/${_id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let result = [...expenses];

    if (filters.category) {
      result = result.filter(expense => expense.category === filters.category);
    }

    if (filters.dateRange !== 'all') {
      const today = new Date();
      const dateFilters = {
        'week': new Date(today.setDate(today.getDate() - 7)),
        'month': new Date(today.setMonth(today.getMonth() - 1)),
        'year': new Date(today.setFullYear(today.getFullYear() - 1))
      };

      const startDate = dateFilters[filters.dateRange];
      result = result.filter(expense => new Date(expense.date) >= startDate);
    }

    if (filters.minAmount) {
      result = result.filter(expense => expense.amount >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(expense => expense.amount <= Number(filters.maxAmount));
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      } else if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date) 
          : new Date(b.date) - new Date(a.date);
      }
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });

    setFilteredExpenses(result);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
      searchTerm: ''
    });
  };

  const categories = [...new Set(expenses.map(exp => exp.category))];

  if (loading) {
    return <div className="text-center text-gray-500">Loading expenses...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Expenses</h2>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
            <select 
              id="category" 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">Date Range:</label>
            <select 
              id="dateRange" 
              name="dateRange" 
              value={filters.dateRange} 
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">Min Amount:</label>
            <input 
              type="number"
              id="minAmount"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              placeholder="Min"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">Max Amount:</label>
            <input 
              type="number"
              id="maxAmount"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              placeholder="Max"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search:</label>
            <input 
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search expenses..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center text-gray-500">No expenses found matching your filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort('date')} className="px-6 py-3 cursor-pointer">Date</th>
                <th onClick={() => handleSort('description')} className="px-6 py-3 cursor-pointer">Description</th>
                <th onClick={() => handleSort('category')} className="px-6 py-3 cursor-pointer">Category</th>
                <th onClick={() => handleSort('amount')} className="px-6 py-3 cursor-pointer">Amount</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map(expense => (
                <tr key={expense._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEditExpense(expense._id)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-gray-700">
        <p>Total: <strong>${filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</strong></p>
        <p>Showing {filteredExpenses.length} of {expenses.length} expenses</p>
      </div>
    </div>
  );
};

export default ExpenseList;
