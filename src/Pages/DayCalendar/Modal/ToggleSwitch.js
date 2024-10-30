// ToggleSwitch.jsx

import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="day-header">
    <span className="day-label">{label}</span>
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round"></span>
    </label>
  </div>
);

export default ToggleSwitch;
