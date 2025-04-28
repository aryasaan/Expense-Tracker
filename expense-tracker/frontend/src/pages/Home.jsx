import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses } from '../services/expenseService';

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);

      // Calculate total expenses
      const total = data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(total);

      // Find the last transaction
      if (data.length > 0) {
        const sortedExpenses = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setLastTransaction(sortedExpenses[0]);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  return (
    <div className="p-6 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to FinTrack</h1>
      <p className="text-lg text-gray-700 mb-6">Track your expenses and take control of your finances!</p>

      {/* Quick Navigation Buttons */}
      <div className="flex space-x-4 mb-8">
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/dashboard"
          className="bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition"
        >
          View Expenses
        </Link>
      </div>

      {/* Interactive Summary Section */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Summary</h2>
        <ul className="text-left text-gray-700 space-y-2">
          <li>
            <span className="font-medium">Total Expenses:</span> ₹{totalExpenses.toFixed(2)}
          </li>
          <li>
            <span className="font-medium">Top Category:</span> {lastTransaction ? lastTransaction.category : 'N/A'}
          </li>
          <li>
            <span className="font-medium">Last Transaction:</span>{' '}
            {lastTransaction
              ? `₹${lastTransaction.amount} on ${new Date(lastTransaction.date).toLocaleDateString()}`
              : 'No transactions yet'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;