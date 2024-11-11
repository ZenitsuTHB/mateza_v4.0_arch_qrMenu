// src/components/ReservationForm/DateSelector.jsx

import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { generateAvailableDates } from './Utils/generateDates';

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
    if (timeblocks && Array.isArray(timeblocks)) {
      const dates = generateAvailableDates(timeblocks);
      setAvailableDates(dates);
    } else {
      console.error("timeblocks is undefined or not an array:", timeblocks);
      setAvailableDates([]);
    }
  }, [timeblocks]);

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
