// ShiftsAccordion.js

import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch';
import './css/shiftsAccordion.css';

const ShiftsAccordion = ({ enabled, setEnabled, shifts, setShifts }) => {
  const [isExpanded, setIsExpanded] = useState(enabled);

  useEffect(() => {
    setIsExpanded(enabled);
  }, [enabled]);

  const handleHeaderClick = () => {
    if (enabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const addNewShift = () => {
    setShifts([...shifts, { name: '', time: '' }]);
  };

  const handleShiftChange = (index, field, value) => {
    const newShifts = [...shifts];
    newShifts[index][field] = value;
    setShifts(newShifts);
  };

  return (
    <div className="shifts-accordion">
      <div
        className={`item-header ${isExpanded ? 'expanded' : ''}`}
        onClick={handleHeaderClick}
      >
        <div className={`item-label ${!enabled ? 'disabled' : ''}`}>
          {enabled && (
            <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
          )}
          <span>Shifts ({shifts.length})</span>
        </div>
        <div className="toggle-middle" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch checked={enabled} onChange={handleToggle} />
        </div>
      </div>
      {isExpanded && enabled && (
        <div className="item-content">
          {shifts.map((shift, index) => (
            <div key={index} className="shift-row">
              <input
                type="time"
                value={shift.time}
                onChange={(e) => handleShiftChange(index, 'time', e.target.value)}
                placeholder="Tijd"
              />
              <input
                type="text"
                placeholder="Shift Naam"
                value={shift.name}
                onChange={(e) => handleShiftChange(index, 'name', e.target.value)}
              />
            </div>
          ))}
          <div className="add-shift" onClick={addNewShift}>
            <span>Voeg Nieuwe Shift Toe</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftsAccordion;
