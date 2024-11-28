// src/Pages/NewReservation/ReservationStepOne.jsx

import React, { useState, useEffect } from 'react';
import ValueSelectorGuests from './ValueSelector';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';

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

  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      <ValueSelectorGuests
        setGuests={setGuests}
        value={formData.guests}
        onChange={handleChange}
        error={errors.guests}
      />

      {formData.guests && (
        <DateSelector
          guests={formData.guests}
          formData={formData}
          handleChange={handleChange}
          resetFormDataFields={resetFormDataFields}
          timeblocks={timeblocks}
        />
      )}

      {formData.date && (
        <TimeSelector
          guests={formData.guests}
          formData={formData}
          handleChange={handleChange}
          field={{ id: 'time', label: 'Tijd' }}
          selectedDate={formData.date}
        />
      )}
    </form>
  );
};

export default ReservationStepOne;
