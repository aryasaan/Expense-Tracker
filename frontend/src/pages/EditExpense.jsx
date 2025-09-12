import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/expenses/${id}`);
        const data = res.data;
        setExpense({
          amount: data.amount || '',
          category: data.category || '',
          description: data.description || '',
          date: data.date ? data.date.slice(0, 10) : ''
        });
      } catch (error) {
        console.error('Error fetching expense:', error);
        alert('Failed to load expense');
        navigate('/expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setExpense(exp => ({
      ...exp,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense) return;
    try {
      await axios.put(`http://localhost:5000/api/expenses/${id}`, expense);
      alert('Expense updated successfully');
      // navigate('/expenses');

      navigate('/dashboard');
      
    } catch (error) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!expense) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="category"
          value={expense.category}
          onChange={handleChange}
          type="text"
          placeholder="Category"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="description"
          value={expense.description}
          onChange={handleChange}
          type="text"
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="date"
          value={expense.date}
          onChange={handleChange}
          type="date"
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}

export default EditExpense;