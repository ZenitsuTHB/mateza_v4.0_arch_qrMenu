// SecondaryTopBar.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './css/secondaryTopBar.css';

const buttons = [
  { id: 'edit', label: 'Bewerken' },
  { id: 'about', label: 'Bekijken' },
  { id: 'contact', label: 'Lanceren' },
];

const SecondaryTopBar = () => {
  const [activeButton, setActiveButton] = useState(buttons[0].id);

  const handleButtonClick = (id) => {
    setActiveButton(id);
    // Add additional logic here (e.g., navigation)
    console.log(`${id} button clicked`);
  };

  return (
    <div className="secondary-top-bar">
      <div className="buttons-container">
        {buttons.map((button) => (
          <motion.button
            key={button.id}
            className={`secondary-button ${
              activeButton === button.id ? 'active' : ''
            }`}
            onClick={() => handleButtonClick(button.id)}
            aria-label={button.label}
          >
            {button.label}
            {activeButton === button.id && (
              <motion.div
                layoutId="underline"
                className="underline"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SecondaryTopBar;
