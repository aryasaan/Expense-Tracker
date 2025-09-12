import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { getExpenses } from '../services/expenseService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa66cc', '#33b5e5', '#8884d8', '#ff7373'];

const ExpenseChart = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [timeFrame, setTimeFrame] = useState('all');
  const [chartType, setChartType] = useState('category');

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpensesByTimeFrame(timeFrame);
  }, [expenses, timeFrame]);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const filterExpensesByTimeFrame = (frame) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (frame) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // All time
        startDate = new Date(0); // Beginning of time
    }
    
    const filtered = expenses.filter(exp => new Date(exp.date) >= startDate);
    setFilteredExpenses(filtered);
  };

  // Group by Category for Pie Chart
  const getCategoryData = () => {
    const categoryData = filteredExpenses.reduce((acc, curr) => {
      const category = curr.category;
      acc[category] = (acc[category] || 0) + Number(curr.amount);
      return acc;
    }, {});

    return Object.keys(categoryData).map(category => ({
      name: category,
      value: categoryData[category]
    }));
  };

  // Group by Month for Bar Chart
  const getMonthlyData = () => {
    const monthData = filteredExpenses.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(curr.amount);
      return acc;
    }, {});

    return Object.keys(monthData).map(month => ({
      month,
      total: monthData[month]
    }));
  };

  // Group by Day for Line Chart
  const getDailyData = () => {
    const dailyData = {};
    
    // Create a sorted array of dates within the filtered range
    const sortedExpenses = [...filteredExpenses].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    sortedExpenses.forEach(exp => {
      const dateStr = new Date(exp.date).toISOString().split('T')[0];
      dailyData[dateStr] = (dailyData[dateStr] || 0) + Number(exp.amount);
    });

    return Object.keys(dailyData).map(date => ({
      date: new Date(date).toLocaleDateString(),
      amount: dailyData[date]
    }));
  };

  // Calculate total expenses
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  // Calculate average expense
  const avgExpense = filteredExpenses.length 
    ? (totalAmount / filteredExpenses.length).toFixed(2) 
    : 0;

  // Find highest expense
  const highestExpense = filteredExpenses.length 
    ? Math.max(...filteredExpenses.map(exp => Number(exp.amount))) 
    : 0;

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expense Analysis</h2>
        
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
          
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="category">By Category</option>
            <option value="time">By Time</option>
            <option value="trend">Spending Trend</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Expenses</p>
          <h3 className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Average Expense</p>
          <h3 className="text-2xl font-bold">₹{avgExpense}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Highest Expense</p>
          <h3 className="text-2xl font-bold">₹{highestExpense.toFixed(2)}</h3>
        </div>
      </div>

      {chartType === 'category' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Top Categories</h3>
            <div className="space-y-4">
              {getCategoryData()
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>{category.name}</span>
                        <span>₹{category.value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="h-1 rounded-full" 
                          style={{ 
                            width: `${(category.value / totalAmount) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {chartType === 'time' && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'trend' && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getDailyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Daily Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;