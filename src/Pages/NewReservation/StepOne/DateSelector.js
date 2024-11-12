// src/components/ReservationForm/DateSelector.jsx

import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { generateAvailableDates } from './Utils/generateDates';
import moment from 'moment';

const DateSelector = ({
  formData,
  handleChange,
  resetFormDataFields,
  timeblocks,
}) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    if (Array.isArray(timeblocks)) {
      const dates = generateAvailableDates(timeblocks);
      setAvailableDates(dates);
    } else {
      console.error("timeblocks is undefined or not an array:", timeblocks);
      setAvailableDates([]);
    }
  }, [timeblocks]);

  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log('Selected date:', formattedDate);
    handleChange({
      target: { name: 'date', value: formattedDate },
    });
    resetFormDataFields(['time']);
  };

  return (
    <div className="form-group date-selector-container">
      <label htmlFor="date" className="default-text-color">
        Datum<span className="required">*</span>
      </label>
      <Calendar
        availableDates={availableDates}
        selectedDate={formData.date || null}
        onSelectDate={handleDateSelect}
        autoExpand={false}
      />
    </div>
  );
};

export default DateSelector;
