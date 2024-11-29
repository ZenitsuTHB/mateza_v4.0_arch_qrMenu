// src/Pages/NewReservation/ReservationStepOne.jsx

import React, { useState, useEffect } from 'react';
import ValueSelectorGuests from './ValueSelector';
import DateSelectorWithLimits from './DateSelectorWithLimits';
import DateSelectorWithoutLimits from './DateSelectorWithoutLimits';
import TimeSelectorWithLimits from './TimeSelectorWithLimits';
import TimeSelectorWithoutLimits from './TimeSelectorWithoutLimits';
import './css/reservationMode.css'; // NEW: Import CSS for reservation mode

const ReservationStepOne = ({
  formData,
  errors,
  handleChange,
  handleStepOneSubmit,
  setFormData,
  timeblocks,
  loadingTimeblocks,
  timeblocksError,
}) => {
  const [guests, setGuests] = useState(1);
  
  const resetFormDataFields = (fieldsToReset) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      fieldsToReset.forEach((field) => {
        newFormData[field] = '';
      });
      return newFormData;
    });
  };

  // Set default reservation mode to 'met_limieten' on component mount
  useEffect(() => {
    if (!formData.reservationMode) {
      handleChange({
        target: { name: 'reservationMode', value: 'met_limieten' },
      });
    }
  }, [formData.reservationMode, handleChange]);

  useEffect(() => {
      resetFormDataFields(['date', 'time']);
  }, [guests]);

  if (timeblocksError) {
    return (
      <div>
        <a
          href="https://dashboard.reservaties.net/#/scheme"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}
        >
          Klik hier
        </a>{' '}
        om uw openingsuren in te stellen.
      </div>
    );
  }

  // Handler for reservation mode selection
  const handleReservationModeSelect = (mode) => {
    handleChange({
      target: { name: 'reservationMode', value: mode },
    });
    // Reset date and time when reservation mode changes
    resetFormDataFields(['date', 'time']);
  };

  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      {/* NEW: Reservation Mode Selection */}
      <div className="form-group reservation-mode">
        <div className="reservation-mode-buttons">
          <button
            type="button"
            className={`reservation-mode-button ${
              formData.reservationMode === 'met_limieten' ? 'active' : ''
            }`}
            onClick={() => handleReservationModeSelect('met_limieten')}
            aria-pressed={formData.reservationMode === 'met_limieten'}
          >
            Met Limieten
          </button>
          <button
            type="button"
            className={`reservation-mode-button ${
              formData.reservationMode === 'zonder_regels' ? 'active' : ''
            }`}
            onClick={() => handleReservationModeSelect('zonder_regels')}
            aria-pressed={formData.reservationMode === 'zonder_regels'}
          >
            Vrij Reserveren
          </button>
        </div>
      </div>

      <ValueSelectorGuests
        setGuests={setGuests}
        value={formData.guests}
        onChange={handleChange}
        error={errors.guests}
      />

      {formData.guests && (
        <>
          {formData.reservationMode === 'met_limieten' ? (
            <DateSelectorWithLimits
              guests={formData.guests}
              formData={formData}
              handleChange={handleChange}
              resetFormDataFields={resetFormDataFields}
              timeblocks={timeblocks}
            />
          ) : (
            <DateSelectorWithoutLimits
              guests={formData.guests}
              formData={formData}
              handleChange={handleChange}
              resetFormDataFields={resetFormDataFields}
              timeblocks={timeblocks}
            />
          )}
        </>
      )}

      {formData.date && (
        <>
          {formData.reservationMode === 'met_limieten' ? (
            <TimeSelectorWithLimits
              guests={formData.guests}
              formData={formData}
              handleChange={handleChange}
              field={{ id: 'time', label: 'Tijd' }}
              selectedDate={formData.date}
              setCurrentExpandedField={() => {}}
            />
          ) : (
            <TimeSelectorWithoutLimits
              guests={formData.guests}
              formData={formData}
              handleChange={handleChange}
              field={{ id: 'time', label: 'Tijd' }}
              selectedDate={formData.date}
              setCurrentExpandedField={() => {}}
            />
          )}
        </>
      )}
    </form>
  );
};

export default ReservationStepOne;
