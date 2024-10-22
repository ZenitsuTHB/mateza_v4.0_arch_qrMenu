// src/components/Modal/NumberInput.jsx

import React from 'react';

const NumberInput = ({ label, value, onChange, min, step = 1 }) => {
  return (
    <label className="modal-label">
      {label}:
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        step={step}
        required
      />
    </label>
  );
};

export default NumberInput;
