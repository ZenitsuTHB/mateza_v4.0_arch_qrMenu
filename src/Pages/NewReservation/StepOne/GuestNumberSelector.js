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
  const presetNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const [customGuestsVisible, setCustomGuestsVisible] = useState(false);

  useEffect(() => {
    if (field) {
      if (parseInt(formData[field.id], 10) > maxGuests) {
        // Handle max guests exceeded in parent component
      }
    }
  }, [formData, field, maxGuests]);

  if (!field) {
    return null; // Handle case when field is not provided
  }

  const handleButtonClick = (number) => {
    handleChange({
      target: { name: field.id, value: number },
    });
    setGuestSelected(true);
    setCustomGuestsVisible(false); // Hide custom input if previously visible
  };

  const handleCustomButtonClick = () => {
    setCustomGuestsVisible(true);
    handleChange({
      target: { name: field.id, value: '' },
    });
    setGuestSelected(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/, ''); // Remove non-digit characters
    handleChange({
      target: { name: field.id, value: value },
    });
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
          {!customGuestsVisible && (
            <button
              type="button"
              className={`guest-number-button guest-number-custom-button ${
                parseInt(formData[field.id], 10) > 8 ? 'selected' : ''
              }`}
              onClick={handleCustomButtonClick}
            >
              8+
            </button>
          )}
          {customGuestsVisible && (
            <input
              type="number"
              id={field.id}
              name={field.id}
              value={formData[field.id] || ''}
              onChange={handleInputChange}
              required={field.required}
              placeholder="Aantal"
              min={field.min || 6}
              className="guest-number-input"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestNumberSelector;
