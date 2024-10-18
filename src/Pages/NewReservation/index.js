import React, { useState, useEffect } from 'react';
import { title, font, fields } from './formConfig';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SuccessMessage from './StepThree';
import './css/newReservation.css';
import './css/popup.css';
import './css/mobile.css';
import './css/animations.css';
import reserveIcon from '../../Assets/logos/logo-white.webp';

const NewReservation = () => {
  const initialFormData = {};
  fields.forEach((field) => {
    initialFormData[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

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
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setFormData(initialFormData);
      setCurrentStep(1);
    }, 300);
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(window.baseDomain + 'api/restaurant/' + window.restaurantId); // Replace with the correct ID
        const data = await response.json();
        setRestaurantData(data);
        console.log('Fetched restaurant data:', data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  if (!restaurantData) {
    return <div>Loading...</div>;
  }

  const { colors, theme } = restaurantData;

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
      className={`new-reservation-page ${window.viewMode === 'popup' ? 'popup-mode' : ''}`}
      style={{
        '--text-color': colors.textColor,
        '--background-color': colors.backgroundColor,
        '--container-color': colors.containerColor,
        '--button-color': colors.buttonColor,
        '--button-text-color': colors.buttonTextColor,
        '--widget-text-color': colors.widgetTextColor,
      }}
    >
      {window.viewMode === 'full-screen' ? (
        <>
          <div className="top-image-section">
            <img src={`https://static.reservaties.net/themes/${theme.id}.webp`} alt={theme.title} className="top-image" />
          </div>

          <div className="form-section">
            {formContent}
          </div>
        </>
      ) : (
        <>
          <button className="open-modal-button" onClick={openModal}>
            <span className="button-content">
              <span className="button-text">Boek een Tafel</span>
              <div className="separator"></div>
              <img src={reserveIcon} alt="Reserve Icon" className="button-icon" />
            </span>
          </button>
          {(isModalOpen || isClosing) && (
            <>
              <div
                className={`modal-overlay ${isClosing ? 'hide' : 'show'}`}
                onClick={closeModal}
              ></div>
              <div className={`modal ${isClosing ? 'hide' : 'show'}`}>
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
