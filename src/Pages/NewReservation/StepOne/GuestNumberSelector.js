// src/components/NewReservation/GuestNumberSelector.jsx

import React from 'react';

const GuestNumberSelector = ({ formData, handleChange, field }) => {
  if (!field) {
    return null; // Handle case when field is not provided
  }

  return (
    <div className="form-group">
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <input
        type={field.type === 'input' ? 'text' : field.type}
        id={field.id}
        name={field.id}
        value={formData[field.id]}
        onChange={handleChange}
        required={field.required}
        placeholder={field.placeholder || ''}
        min={field.min || undefined}
      />
    </div>
  );
};

export default GuestNumberSelector;
