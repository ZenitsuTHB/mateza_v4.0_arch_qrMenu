// ValueSelectorGuests.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import './css/valueSelector.css'; // Use the same CSS as ValueSelector

const ValueSelectorGuests = ({ value, onChange }) => {
  const predefinedValues = [1, 2, 3, '4+ Gasten'];
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [showSlider, setShowSlider] = useState(false);

  const handlePredefinedValueClick = (val) => {
    if (val === '4+ Gasten') {
      setShowSlider(true);
      setSelectedValue(4);
      onChange({ target: { name: 'numberOfGuests', value: 4 } });
    } else {
      setShowSlider(false);
      setSelectedValue(val);
      onChange({ target: { name: 'numberOfGuests', value: val } });
    }
  };

  const handleSliderChange = (e) => {
    const val = e.target.value;
    setSelectedValue(val);
    onChange({ target: { name: 'numberOfGuests', value: val } });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSelectedValue(val);
    onChange({ target: { name: 'numberOfGuests', value: val } });
  };

  return (
    <div className="value-selector">
      <div className="predefined-values">
        {predefinedValues.map((val) => (
          <button
            key={val}
            type="button"
            className={`predefined-value-button ${
              selectedValue == val || (val === '4+ Gasten' && showSlider) ? 'active' : ''
            }`}
            onClick={() => handlePredefinedValueClick(val)}
          >
            {val === '4+ Gasten' ? '4+ Gasten' : `${val} ${val === 1 ? 'Gast' : 'Gasten'}`}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {showSlider && (
          <motion.div
            className="slider-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="range"
              min="4"
              max="15"
              step="1"
              value={selectedValue}
              onChange={handleSliderChange}
              className="slider"
            />
            <input
              type="number"
              name="numberOfGuests"
              value={selectedValue}
              onChange={handleInputChange}
              className="value-input"
              min="4"
              max="100"
              step="1"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValueSelectorGuests;
