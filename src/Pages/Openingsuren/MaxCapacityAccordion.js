// src/components/MaxCapacityAccordion.js

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch'; // Adjust the path based on your project structure
import './css/maxCapacityAccordion.css'; // Create this CSS file for styling

const MaxCapacityAccordion = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState('');

  const handleHeaderClick = () => {
    if (enabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      setIsExpanded(true); // Optionally expand when enabled
    } else {
      setIsExpanded(false); // Collapse when disabled
    }
  };

  return (
    <div className="max-capacity-accordion">
      <div
        className={`item-header ${isExpanded ? 'expanded' : ''}`}
        onClick={handleHeaderClick}
      >
        <div className={`item-label ${!enabled ? 'disabled' : ''}`}>
          {enabled && (
            <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
          )}
          <span>Max Capaciteit</span>
        </div>
        <div className="toggle-middle" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch
            checked={enabled}
            onChange={handleToggle}
          />
        </div>
      </div>
      {isExpanded && enabled && (
        <div className="item-content">
          <label htmlFor="maxCapacity">Max capaciteit</label>
          <input
            type="number"
            id="maxCapacity"
            name="maxCapacity"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            min="1"
          />
        </div>
      )}
    </div>
  );
};

export default MaxCapacityAccordion;
