// src/components/NewReservation/NewReservation.jsx

import React, { useState, useEffect } from 'react';
import { title, theme, font, fields } from './formConfig';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SuccessMessage from './StepThree';
import './css/newReservation.css';
import './css/popup.css';
import './css/mobile.css';
import './css/animations.css';

const NewReservation = ({ mode = 'popup' }) => {
  const initialFormData = {};
  fields.forEach((field) => {
    initialFormData[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form data and step if needed
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  // Render the form content
  const formContent = (
    <div className="reservation-form">
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

      {currentStep === 3 && <SuccessMessage />}
    </div>
  );

  return (
    <div
      className={`new-reservation-page ${mode === 'popup' ? 'popup-mode' : ''}`}
      style={{
        '--theme-color': theme.color,
        '--theme-button-color': theme.buttonColor,
      }}
    >
      {mode === 'full-screen' ? (
        <>
          <div className="top-image-section">
            <img src={theme.image} alt={theme.title} className="top-image" />
          </div>

          <div
            className="form-section"
            style={{
              backgroundColor: theme.color,
            }}
          >
            {formContent}
          </div>
        </>
      ) : (
        <>
          <button className="open-modal-button" onClick={openModal}>
            Reserveer
          </button>
          {isModalOpen && (
            <>
              <div
                className={`modal-overlay ${isModalOpen ? 'show' : ''}`}
                onClick={closeModal}
              ></div>
              <div className={`modal ${isModalOpen ? 'show' : ''}`}>
                <div className="modal-content">
                  <button className="close-modal-button" onClick={closeModal}>
                    &times;
                  </button>
                  {formContent}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <style>{`
        .new-reservation-page * {
          font-family: ${font};
        }
      `}</style>
    </div>
  );
};

export default NewReservation;
