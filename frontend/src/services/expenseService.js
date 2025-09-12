import axios from 'axios';

const API_URL = 'https://expense-tracker-fintracker.onrender.com/api'||'http://localhost:5000/api/expenses';

export const getExpenses = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createExpense = async (expense) => {
  const res = await axios.post(API_URL, expense);
  return res.data;
};

export const updateExpense = async (id, expense) => {
  const res = await axios.put(`${API_URL}/${id}`, expense);
  return res.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};