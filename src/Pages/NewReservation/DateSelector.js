// src/components/ReservationForm/DateSelector.jsx

import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { generateAvailableDates } from './Utils/generateAvailableDates';

const DateSelector = ({
  formData,
  handleChange,
  resetFormDataFields,
  timeblocks,
  expanded,
  setCurrentExpandedField,
}) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const dates = generateAvailableDates(timeblocks);
    setAvailableDates(dates);
  }, [timeblocks]);

  const formatDateForFilter = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    handleChange({
      target: { name: 'date', value: date },
    });
    resetFormDataFields(['time']);
    if (setCurrentExpandedField) {
      setCurrentExpandedField('time');
    }
  };

  return (
    <div className="form-group date-selector-container">
      <label htmlFor="date" className="default-text-color">
        Datum<span className="required">*</span>
      </label>
      <Calendar
        availableDates={availableDates}
        selectedDate={formData.date ? formData.date : null}
        onSelectDate={handleDateSelect}
        autoExpand={expanded}
      />
    </div>
  );
};

export default DateSelector;
