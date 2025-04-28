import React from 'react';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(res.data.data);
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    setExpenses(expenses.filter(exp => exp._id !== id));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ExpenseForm 
        expenses={expenses} 
        setExpenses={setExpenses} 
        currentExpense={currentExpense} 
        setCurrentExpense={setCurrentExpense} 
      />
      <div className="overflow-auto bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Amount</th>
              <th className="text-left py-2 px-3">Category</th>
              <th className="text-left py-2 px-3">Description</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp._id} className="border-t">
                <td className="py-2 px-3">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="py-2 px-3">${exp.amount.toFixed(2)}</td>
                <td className="py-2 px-3">{exp.category}</td>
                <td className="py-2 px-3">{exp.description}</td>
                <td className="py-2 px-3 flex gap-2 justify-center">
                  <button
                    onClick={() => setCurrentExpense(exp)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;
