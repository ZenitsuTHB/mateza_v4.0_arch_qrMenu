// src/components/Modal/ColorPicker.jsx

import React from 'react';

const ColorPicker = ({ label, value, onChange }) => {
  return (
    <label className="modal-label">
      {label}:
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  );
};

export default ColorPicker;
