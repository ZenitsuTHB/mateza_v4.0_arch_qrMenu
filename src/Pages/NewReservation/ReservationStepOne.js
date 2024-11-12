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

  console.log("timeblocks:", timeblocks);

  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      <ValueSelectorGuests
        value={formData.numberOfGuests}
        onChange={handleChange}
        error={errors.numberOfGuests}
      />

      {/* Only show DateSelector after numberOfGuests is selected */}
      {formData.numberOfGuests && (
        <DateSelector
          formData={formData}
          handleChange={handleChange}
          resetFormDataFields={resetFormDataFields}
          timeblocks={timeblocks} // Pass timeblocks here
          expanded={false}
          setCurrentExpandedField={() => {}}
        />
      )}

      {/* Only show TimeSelector after date is selected */}
      {formData.date && (
        <TimeSelector
          formData={formData}
          handleChange={handleChange}
          field={{ id: 'time', label: 'Tijd' }}
          selectedDate={formData.date}
          expanded={false}
          setCurrentExpandedField={() => {}}
        />
      )}

      <button type="submit" className="account-manage__button">
        Verder
      </button>
    </form>
  );
};

export default ReservationStepOne;
