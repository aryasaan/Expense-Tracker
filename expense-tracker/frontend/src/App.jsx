import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import Expenses from './pages/Expense'
import EditExpense from './pages/EditExpense';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
         <Route path="/expenses" element={<Expenses />} />
      <Route path="/expenses/edit/:id" element={<EditExpense />} />
      </Routes>
    </>
  );
}

export default App;
