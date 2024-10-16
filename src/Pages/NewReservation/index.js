import React, { useState, useEffect } from 'react';
import { title, font, fields } from './formConfig'; // Removed static theme
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SuccessMessage from './StepThree';
import './css/newReservation.css';
import './css/popup.css';
import './css/mobile.css';
import './css/animations.css';
import reserveIcon from '../../Assets/logos/logo-white.webp'; // Ensure this path is correct

const NewReservation = () => {
  const initialFormData = {};
  fields.forEach((field) => {
    initialFormData[field.id] = '';
  });

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // New state for handling closing animation
  const [restaurantData, setRestaurantData] = useState(null); // State for restaurant data

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
    setIsClosing(true); // Start closing animation
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      // Reset form data and step if needed
      setFormData(initialFormData);
      setCurrentStep(1);
    }, 300);
  };

  // Fetch restaurant data from the API endpoint
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/restaurant/restaurantId123'); // Replace with the correct ID
        const data = await response.json();
        setRestaurantData(data); // Store the data in state
        console.log('Fetched restaurant data:', data); // Print the fetched data
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

  // If no restaurant data is available yet, we can return a loading indicator or null
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

          <div
            className="form-section"
          >
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
