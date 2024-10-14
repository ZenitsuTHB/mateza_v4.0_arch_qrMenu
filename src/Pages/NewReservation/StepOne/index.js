// src/components/NewReservation/StepOne.jsx

import React from 'react';
import Title from './Title';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import GuestNumberSelector from './GuestNumberSelector';

const StepOne = ({
  title,
  formData,
  handleChange,
  setCurrentStep,
  fields,
}) => {
  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  // Extract the fields for time and number of guests
  const timeField = fields.find((field) => field.id === 'tijd');
  const guestNumberField = fields.find((field) => field.id === 'aantalPersonen');

  return (
    <form className="reservation-form" onSubmit={handleNext}>
      <Title title={title} subtitle="Stap 1/3" />

	  <GuestNumberSelector
        formData={formData}
        handleChange={handleChange}
        field={guestNumberField}
      />
	  
      <DateSelector formData={formData} handleChange={handleChange} />

      <TimeSelector
        formData={formData}
        handleChange={handleChange}
        field={timeField}
      />

      

      <button type="submit" className="submit-button">
        Volgende
      </button>
    </form>
  );
};

export default StepOne;
