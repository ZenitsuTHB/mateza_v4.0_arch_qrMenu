// src/components/Modal/OptionSelect.jsx

import React from 'react';

const OptionSelect = ({ label, options, value, onChange }) => {
  return (
    <label className="modal-label">
      {label}:
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
};

export default OptionSelect;
