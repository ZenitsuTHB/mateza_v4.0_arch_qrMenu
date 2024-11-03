// ValueSelectorGuests.jsx

import React, { useState } from 'react';
import './css/valueSelector.css'; // Use the same CSS as ValueSelector

const ValueSelectorGuests = ({ value, onChange }) => {
  const predefinedValues = [2, 3, 4, 5];
  const [customValue, setCustomValue] = useState(value || '');

  const handlePredefinedValueClick = (val) => {
    setCustomValue(val);
    onChange({ target: { name: 'numberOfGuests', value: val } });
  };

  const handleSliderChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange({ target: { name: 'numberOfGuests', value: val } });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange({ target: { name: 'numberOfGuests', value: val } });
  };

  return (
    <div className="value-selector">
      <div className="predefined-values">
        {predefinedValues.map((val) => (
          <button
            key={val}
            type="button"
            className={`predefined-value-button ${parseInt(customValue) === val ? 'active' : ''}`}
            onClick={() => handlePredefinedValueClick(val)}
          >
            {val} Gasten
          </button>
        ))}
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="1"
          max="15"
          step="1"
          value={customValue}
          onChange={handleSliderChange}
          className="slider"
        />
        <input
          type="number"
          name="numberOfGuests"
          value={customValue}
          onChange={handleInputChange}
          className="value-input"
          min="1"
          max="100"
          step="1"
        />
      </div>
    </div>
  );
};

export default ValueSelectorGuests;
