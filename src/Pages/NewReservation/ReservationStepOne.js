// src/components/ReservationForm/ReservationStepOne.jsx

import React from 'react';
import ValueSelectorGuests from './ValueSelector'; // Import the guests value selector
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import './css/newReservationAdmin.css'; // Ensure CSS is imported

const ReservationStepOne = ({
  formData,
  errors,
  handleChange,
  handleStepOneSubmit,
  setFormData,
  timeblocks,
}) => {
  const resetFormDataFields = (fieldsToReset) => {
    const newFormData = { ...formData };
    fieldsToReset.forEach((field) => {
      newFormData[field] = '';
    });
    setFormData(newFormData);
  };

  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      <ValueSelectorGuests
        value={formData.numberOfGuests}
        onChange={handleChange}
        error={errors.numberOfGuests}
      />

      <DateSelector
        formData={formData}
        handleChange={handleChange}
        resetFormDataFields={resetFormDataFields}
        timeblocks={timeblocks}
        expanded={false}
        setCurrentExpandedField={() => {}}
      />

      <TimeSelector
        formData={formData}
        handleChange={handleChange}
        field={{ id: 'time', label: 'Tijd' }}
        selectedDate={formData.date}
        timeblocks={timeblocks}
        expanded={false}
        setCurrentExpandedField={() => {}}
      />

      <button type="submit" className="account-manage__button">
        Verder
      </button>
    </form>
  );
};

export default ReservationStepOne;
