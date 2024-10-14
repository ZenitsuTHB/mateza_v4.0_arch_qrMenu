// src/components/NewReservation/StepOne.jsx

import React, { useState } from 'react';
import Title from './Title';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import GuestNumberSelector from './GuestNumberSelector';
import MaxGuestMessage from './MaxGuestsMessage'; // New component for the message

const StepOne = ({
  title,
  formData,
  handleChange,
  setCurrentStep,
  fields,
}) => {
  const [guestSelected, setGuestSelected] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [maxGuestsExceeded, setMaxGuestsExceeded] = useState(false);
  const maxGuests = 10; // Define maximum guests allowed for online reservations

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  // Extract the fields for time and number of guests
  const timeField = fields.find((field) => field.id === 'tijd');
  const guestNumberField = fields.find(
    (field) => field.id === 'aantalPersonen'
  );

  // Check if the number of guests exceeds the maximum allowed
  const numGuests = parseInt(formData[guestNumberField.id], 10);
  const guestsExceeded = numGuests > maxGuests;

  return (
    <form className="reservation-form" onSubmit={handleNext}>
      <Title title={title} subtitle="Stap 1/3" />

      <GuestNumberSelector
        formData={formData}
        handleChange={handleChange}
        field={guestNumberField}
        setGuestSelected={setGuestSelected}
        maxGuests={maxGuests}
      />

      {guestSelected && !guestsExceeded && (
        <DateSelector
          formData={formData}
          handleChange={(e) => {
            handleChange(e);
            setDateSelected(true);
          }}
        />
      )}

      {guestSelected && guestsExceeded && (
        <MaxGuestMessage maxGuests={maxGuests} />
      )}

      {dateSelected && (
        <TimeSelector
          formData={formData}
          handleChange={handleChange}
          field={timeField}
          selectedDate={formData.datum} // Pass the selected date
        />
      )}

      {!guestsExceeded && (
        <button type="submit" className="submit-button">
          Volgende
        </button>
      )}
    </form>
  );
};

export default StepOne;
