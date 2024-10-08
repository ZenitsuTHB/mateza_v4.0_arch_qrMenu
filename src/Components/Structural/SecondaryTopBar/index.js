// SecondaryTopBar.js
import React from 'react';
import './css/secondaryTopBar.css';

const SecondaryTopBar = () => {
  const handleButtonClick = (buttonName) => {
    // Define the actions for each button
    console.log(`${buttonName} button clicked`);
    // Add your desired functionality here
  };

  return (
    <div className="secondary-top-bar">
      <div className="button-container">
        <button
          className="secondary-button"
          onClick={() => handleButtonClick('Button 1')}
          aria-label="Button 1"
        >
          Button 1
        </button>
        <button
          className="secondary-button"
          onClick={() => handleButtonClick('Button 2')}
          aria-label="Button 2"
        >
          Button 2
        </button>
        <button
          className="secondary-button"
          onClick={() => handleButtonClick('Button 3')}
          aria-label="Button 3"
        >
          Button 3
        </button>
      </div>
    </div>
  );
};

export default SecondaryTopBar;
