// src/components/NewReservation/GuestNumberSelector.jsx

import React, { useState, useEffect } from 'react';
import './css/guestNumberSelector.css';

const GuestNumberSelector = ({
  formData,
  handleChange,
  field,
  setGuestSelected,
  maxGuests,
}) => {
  // Move Hooks to the top level
  const presetNumbers = [1, 2, 3, 4];
  const [customGuests, setCustomGuests] = useState('');

  // Ensure `field` is included in dependencies and safely accessed
  useEffect(() => {
    if (field) {
      if (parseInt(formData[field.id], 10) > maxGuests) {
        // Handle max guests exceeded in parent component
      }
    }
  }, [formData, field, maxGuests]);

  // After Hooks, handle the early return
  if (!field) {
    return null; // Handle case when field is not provided
  }

  const handleButtonClick = (number) => {
    handleChange({
      target: { name: field.id, value: number },
    });
    setGuestSelected(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/, ''); // Remove non-digit characters
    handleChange({
      target: { name: field.id, value: value },
    });
    setCustomGuests(value);
    setGuestSelected(!!value);
  };

  return (
    <div className="form-group guest-number-selector">
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <div className="guest-number-inputs">
        <div className="guest-number-buttons">
          {presetNumbers.map((number) => (
            <button
              key={number}
              type="button"
              className={`guest-number-button ${
                formData[field.id] === number.toString() ? 'selected' : ''
              }`}
              onClick={() => handleButtonClick(number.toString())}
            >
              {number}
            </button>
          ))}
        </div>
        <input
          type="number"
          id={field.id}
          name={field.id}
          value={formData[field.id] || customGuests}
          onChange={handleInputChange}
          required={field.required}
          placeholder="Aantal"
          min={field.min || 1}
          className="guest-number-input"
        />
      </div>
    </div>
  );
};

export default GuestNumberSelector;
