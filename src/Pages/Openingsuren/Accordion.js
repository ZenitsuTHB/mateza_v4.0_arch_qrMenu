// src/pages/SchedulePage/Accordion.js

import React from 'react';
import './css/accordion.css';
import ToggleSwitch from './ToggleSwitch';

const Accordion = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="schedule-page accordion">
      <div className="accordion-header" onClick={onToggle}>
        <span>{title}</span>
        <ToggleSwitch checked={isOpen} onChange={onToggle} />
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
