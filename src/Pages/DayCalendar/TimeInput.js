// src/components/Modal/TimeInput.jsx

import React from 'react';

const TimeInput = ({ label, value, onChange }) => {
  return (
    <label className="modal-label">
      {label}:
      <input
        type="time"
        step="300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  );
};

export default TimeInput;
