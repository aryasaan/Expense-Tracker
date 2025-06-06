import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // <-- yeh zaruri hai!
import './index.css'; // tailwind or your styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap entire App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
