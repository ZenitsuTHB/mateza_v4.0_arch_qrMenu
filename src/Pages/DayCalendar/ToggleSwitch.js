// src/components/Modal/ToggleSwitch.jsx

import React from 'react';

const ToggleSwitch = ({ label, value, onChange, alignLeft }) => {
  return (
    <div className={`toggle-switch-container${alignLeft ? ' align-left' : ''}`}>
      <label className="modal-label toggle-switch">
        {label}:
        <div className="switch">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="slider"></span>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
