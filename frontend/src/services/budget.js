import axios from 'axios';

const API_URL = 'https://expense-tracker-fintracker.onrender.com/api/budgets'||'http://localhost:5000/api/budgets';

export const getBudgets = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await axios.post(API_URL, budgetData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, budgetData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
};