// src/components/NewReservation/NewReservation.jsx

import React, { useState } from 'react';
import './css/newReservation.css';
import { title, notification, theme, font, fields } from './formConfig';
import { FaCheckCircle } from 'react-icons/fa';

const NewReservation = () => {
  // Initialize form data state with empty values for each field
  const initialFormData = {};
  fields.forEach((field) => {
    initialFormData[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // For number fields, ensure only numbers are entered
    if (type === 'number' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log('Reserveringsgegevens:', formData);
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Function to darken the theme color for hover effects
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = ((num >> 8) & 0x00ff) - amt,
      B = (num & 0x0000ff) - amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Fields for each step
  const stepFields = [
    // Step 1 fields
    fields.filter(
      (field) =>
        field.id === 'datum' ||
        field.id === 'tijd' ||
        field.id === 'aantalPersonen'
    ),
    // Step 2 fields
    fields.filter(
      (field) =>
        field.id === 'naam' ||
        field.id === 'email' ||
        field.id === 'telefoonnummer' ||
        field.id === 'opmerkingen'
    ),
  ];

  return (
    <div
      className="new-reservation-page"
      style={{
        '--theme-color': theme.color,
        '--theme-color-dark': darkenColor(theme.color, 20),
      }}
    >
      {/* Top Image Section */}
      <div className="top-image-section">
        <img src={theme.image} alt={theme.title} className="top-image" />
      </div>

      {/* Form Section */}
      <div
        className="form-section"
        style={{
          backgroundColor: theme.color,
        }}
      >
        {currentStep <= 2 && (
          <form
            className="reservation-form"
            onSubmit={currentStep === 1 ? handleNext : handleSubmit}
          >
            <h2>{title}</h2>

            {stepFields[currentStep - 1].map((field) => (
              <div className="form-group" key={field.id}>
                <label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder || ''}
                  ></textarea>
                ) : (
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
                )}
              </div>
            ))}

            <button type="submit" className="submit-button">
              {currentStep === 1 ? 'Volgende' : 'Reserveren'}
            </button>
          </form>
        )}

        {currentStep === 3 && (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            <p>Uw pagina is klaar om te delen!</p>
          </div>
        )}
      </div>

      <style>{`
        .new-reservation-page * {
          font-family: ${font};
        }
      `}</style>
    </div>
  );
};

export default NewReservation;
