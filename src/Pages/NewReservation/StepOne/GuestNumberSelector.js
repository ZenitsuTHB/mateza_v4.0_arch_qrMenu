// src/components/NewReservation/GuestNumberSelector.jsx

import React, { useState, useEffect, useRef } from 'react';
import './css/guestNumberSelector.css';

const GuestNumberSelector = ({
  formData,
  handleChange,
  field,
  setGuestSelected,
  maxGuests,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customGuestsVisible, setCustomGuestsVisible] = useState(false);
  const guestSelectorRef = useRef(null);

  const presetNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (field) {
      if (parseInt(formData[field.id], 10) > maxGuests) {
        // Handle max guests exceeded in parent component
      }
    }
  }, [formData, field, maxGuests]);

  // Close guest selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!field) {
    return null; // Handle case when field is not provided
  }

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleGuestSelect = (number) => {
    handleChange({
      target: { name: field.id, value: number },
    });
    setGuestSelected(true);
    setIsExpanded(false);
    setCustomGuestsVisible(false);
  };

  const handleCustomButtonClick = () => {
    setCustomGuestsVisible(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/, ''); // Remove non-digit characters
    handleChange({
      target: { name: field.id, value: value },
    });
    setGuestSelected(!!value);
  };

  const formatDisplayGuests = () => {
    return formData[field.id]
      ? `${formData[field.id]} ${formData[field.id] === '1' ? 'Gast' : 'Gasten'}`
      : 'Selecteer aantal gasten';
  };

  return (
    <div
      className="form-group guest-number-selector-container"
      ref={guestSelectorRef}
    >
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <div className="guest-number-display" onClick={handleButtonClick}>
        <span>{formatDisplayGuests()}</span>
        <span className="arrow">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path
              d="M7 10l5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
      </div>
      {isExpanded && (
        <div className="guest-number-selector">
          <div className="guest-number-options">
            {presetNumbers.map((number) => (
              <div
                key={number}
                className={`guest-number-option ${
                  formData[field.id] === number.toString() ? 'selected' : ''
                }`}
                onClick={() => handleGuestSelect(number.toString())}
              >
                {number}
              </div>
            ))}
            <div
              className={`guest-number-option ${
                parseInt(formData[field.id], 10) > 8 ? 'selected' : ''
              }`}
              onClick={handleCustomButtonClick}
            >
              8+
            </div>
          </div>
          {customGuestsVisible && (
            <div className="guest-number-custom-input">
              <input
                type="number"
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={handleInputChange}
                required={field.required}
                placeholder="Aantal gasten"
                min={field.min || 9}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuestNumberSelector;
