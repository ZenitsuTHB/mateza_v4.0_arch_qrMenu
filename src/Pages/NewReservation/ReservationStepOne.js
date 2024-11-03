// src/components/ReservationForm/ReservationStepOne.jsx

import React from 'react';
import FormField from './FormField';
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';

const ReservationStepOne = ({ formData, errors, handleChange, handleStepOneSubmit }) => {
  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      <FormField
        label="Aantal gasten"
        name="numberOfGuests"
        type="number"
        placeholder="Aantal gasten"
        value={formData.numberOfGuests}
        onChange={handleChange}
        error={errors.numberOfGuests}
        icon={FaUsers}
      />
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
