// src/Pages/NewReservation/DateSelectorWithoutLimits.jsx

import React, { useEffect, useState, useCallback } from 'react';
import Calendar from './Calendar';
import moment from 'moment';

const DateSelectorWithoutLimits = ({
  guests,
  formData,
  handleChange,
  resetFormDataFields,
  timeblocks,
}) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Allow all dates from today to one year ahead
    const today = moment().format('YYYY-MM-DD');
    const maxDate = moment().add(1, 'year').format('YYYY-MM-DD');
    const allDates = [];
    let current = moment(today);
    while (current.isSameOrBefore(maxDate, 'day')) {
      allDates.push(current.format('YYYY-MM-DD'));
      current.add(1, 'day');
    }
    setAvailableDates(allDates);
  }, []);

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
      <Calendar
        availableDates={availableDates}
        selectedDate={formData.date || null}
        onSelectDate={handleDateSelect}
        autoExpand={false}
        onReservationsFetched={() => {}} // No action needed in this mode
      />
    </div>
  );
};

export default DateSelectorWithoutLimits;
