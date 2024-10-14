// src/components/NewReservation/NewReservation.jsx

import React, { useState } from 'react';
import { title, theme, font, fields } from './formConfig';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SuccessMessage from './StepThree';
import './css/newReservation.css';
import './css/mobile.css';
import './css/animations.css';

const NewReservation = () => {
  const initialFormData = {};
  fields.forEach((field) => {
    initialFormData[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className="new-reservation-page"
      style={{
        '--theme-color': theme.color,
        '--theme-button-color': theme.buttonColor,
      }}
    >
      <div className="top-image-section">
        <img src={theme.image} alt={theme.title} className="top-image" />
      </div>

      <div
        className="form-section"
        style={{
          backgroundColor: theme.color,
        }}
      >
        {currentStep === 1 && (
          <StepOne
            title={title}
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
            fields={fields}
          />
        )}

        {currentStep === 2 && (
          <StepTwo
            title={title}
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
            fields={fields}
          />
        )}

        {currentStep === 3 && (
          <SuccessMessage/>
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
