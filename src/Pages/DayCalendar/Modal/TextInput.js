// src/components/Modal/TextInput.jsx

import React from 'react';

const TextInput = ({ label, value, onChange }) => {
  return (
    <label className="modal-label">
      {label}:
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  );
};

export default TextInput;
