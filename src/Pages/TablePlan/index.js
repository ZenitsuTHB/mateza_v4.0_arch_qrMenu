// src/App.js
import React from 'react';
import ParentComponent from './components/ParentComponent';
import './css/app.css'

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        {/* Main content can be customized as needed */}
        <h1>Welcome to the Restaurant</h1>
        <p>Select a table from the sidebar to see details.</p>
      </div>
      <div className="sidebar">
        <h2>Available Tables</h2>
        <ParentComponent />
      </div>
    </div>
  );
}

export default App;
