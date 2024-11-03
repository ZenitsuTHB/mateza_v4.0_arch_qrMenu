// src/components/ReservationForm/ReservationStepOne.jsx

import React from 'react';
import FormField from './FormField';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import ValueSelectorGuests from './ValueSelector'; // Import the guests value selector
import './css/newReservation.css'; // Ensure CSS is imported

const ReservationStepOne = ({ formData, errors, handleChange, handleStepOneSubmit }) => {
  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      
      {/* Iteration 1: Value Selector for Aantal Gasten */}
      <ValueSelectorGuests
        value={formData.numberOfGuests}
        onChange={handleChange}
        error={errors.numberOfGuests}
      />

      {/* Other form fields */}
      <FormField
        label="Datum"
        name="date"
        type="date"
        placeholder="Datum"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        icon={FaCalendarAlt}
      />
      <FormField
        label="Tijd"
        name="time"
        type="time"
        placeholder="Tijd"
        value={formData.time}
        onChange={handleChange}
        error={errors.time}
        icon={FaClock}
      />

      <button type="submit" className="account-manage__button">
        Verder
      </button>
    </form>
  );
};

export default ReservationStepOne;
