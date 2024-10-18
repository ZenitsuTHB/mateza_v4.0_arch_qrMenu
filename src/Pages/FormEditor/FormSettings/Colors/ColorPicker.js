// src/components/FormSettings/ColorPicker.jsx

import React from 'react';
import './css/colorPicker.css';

const ColorPicker = ({ label, name, value, onChange }) => {
  return (
    <div className="form-group color-picker-group">
      <label htmlFor={name}>{label}:</label>
      <input
        type="color"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ColorPicker;
