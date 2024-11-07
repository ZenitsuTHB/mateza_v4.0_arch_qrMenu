// src/components/App.jsx

import React from 'react';
import Sidebar from './Sidebar.js';
import './css/app.css'; // Import the main app CSS

const App = () => {
  // Sample data for tables
  const tables = [
    { id: 1, numberOfGuests: 4 },
    { id: 2, numberOfGuests: 6 },
    { id: 3, numberOfGuests: 2 },
    { id: 4, numberOfGuests: 8 },
    { id: 5, numberOfGuests: 4 },
    { id: 6, numberOfGuests: 5 },
    // Add more tables as needed
  ];

  // Sample data for walls
  const walls = [
    { id: 1, length: 3 },
    { id: 2, length: 5 },
    { id: 3, length: 2 },
    { id: 4, length: 4 },
    { id: 5, length: 6 },
    // Add more walls as needed
  ];

  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome to the Restaurant</h1>
        {/* Your main content goes here */}
      </div>

      {/* Sidebar */}
      <Sidebar tables={tables} walls={walls} />
    </div>
  );
};

export default App;
