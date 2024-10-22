// src/components/Modal/TimeInput.jsx

import React from 'react';

const TimeInput = ({ label, value, onChange, step = 300 }) => {
  return (
    <label className="modal-label">
      {label}:
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        step={step}
      />
    </label>
  );
};

export default TimeInput;
