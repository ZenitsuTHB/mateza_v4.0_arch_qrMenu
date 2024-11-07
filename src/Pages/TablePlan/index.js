import React from 'react';
import Sidebar from './Sidebar';
import './css/app.css'; // Your main app CSS

const App = () => {
  // Sample data for tables
  const tables = [
    { id: 1, numberOfGuests: 4 },
    { id: 2, numberOfGuests: 6 },
    { id: 3, numberOfGuests: 2 },
    { id: 4, numberOfGuests: 8 },
    // Add more tables as needed
  ];

  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome to the Restaurant</h1>
        {/* Your main content goes here */}
      </div>

      {/* Sidebar */}
      <Sidebar tables={tables} />
    </div>
  );
};

export default App;
