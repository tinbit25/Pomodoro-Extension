import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import "./index.css"; // In

// Create the root element using createRoot (React 18)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap the App component with BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
