import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ToggleSwitch from './ToggleSwitch'; // Adjust the path based on your project structure
import './css/shiftsAccordion.css'; // Create this CSS file for styling

const ShiftsAccordion = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [shifts, setShifts] = useState([]);

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
          <span>Shifts</span>
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
                type="text"
                placeholder="Shift Naam"
                value={shift.name}
                onChange={(e) => handleShiftChange(index, 'name', e.target.value)}
              />
              <input
                type="time"
                value={shift.time}
                onChange={(e) => handleShiftChange(index, 'time', e.target.value)}
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
