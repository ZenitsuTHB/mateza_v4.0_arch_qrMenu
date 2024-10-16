// src/components/FormSettings/ColorPicker.jsx

import React from 'react';
import '../css/FormSettings/colorPicker.css'; // Optional: Create specific CSS for ColorPicker

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
