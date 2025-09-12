import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://expense-tracker-fintracker.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);

// MongoDB Connection
connectDB();

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
