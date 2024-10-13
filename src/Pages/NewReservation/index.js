// src/components/NewReservation/NewReservation.jsx

import React, { useState } from 'react';
import './css/newReservation.css';
import { title, theme, font, fields } from './formConfig';
import { FaCheckCircle } from 'react-icons/fa';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SuccessMessage from './SuccessMessage';

const NewReservation = () => {
  // Initialize form data state with empty values for each field
  const initialFormData = {};
  fields.forEach((field) => {
    initialFormData[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  // Handle input changes
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
        {currentStep === 1 && (
          <StepOne
            title={title}
            subtitle="Stap 1/3"
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
            fields={fields}
          />
        )}

        {currentStep === 2 && (
          <StepTwo
            title={title}
            subtitle="Stap 2/3"
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
            fields={fields}
          />
        )}

        {currentStep === 3 && (
          <SuccessMessage message="Uw pagina is klaar om te delen!" />
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
