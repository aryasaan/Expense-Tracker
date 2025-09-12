import axios from 'axios';

const api = axios.create({
  baseURL: " https://expense-tracker-fintracker.onrender.com" || "http://localhost:5000/api",
});

export default api;
