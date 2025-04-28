import React from 'react';


import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseChart from './ExpenseChart'; // import chart

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ExpenseForm />
        <ExpenseList />
      </div>
      <ExpenseChart /> {/* Add Chart below form and list */}
    </div>
  );
};

export default Dashboard;
