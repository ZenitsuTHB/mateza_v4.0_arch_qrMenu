// src/components/NewReservation/DateSelector.jsx

import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Calendar from './Calendar';

const DateSelector = ({ formData, handleChange }) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Fetch available dates from your API or define them statically
    // Ensure dates are in 'YYYY-MM-DD' format and consider CEST timezone

    // Example of generating dates for the next year
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    const oneYearLater = today.clone().add(1, 'year');
    const dates = [];

    let date = today.clone();
    while (date.isSameOrBefore(oneYearLater, 'day')) {
      // For demonstration, make weekdays available
      if (date.day() !== 0 && date.day() !== 6) {
        dates.push(date.format('YYYY-MM-DD'));
      }
      date.add(1, 'day');
    }

    setAvailableDates(dates);
  }, []);

  const handleDateSelect = (date) => {
    // Convert selected date to CEST timezone
    const dateInCEST = moment(date).tz('Europe/Amsterdam');
    handleChange({
      target: { name: 'datum', value: dateInCEST.format('YYYY-MM-DD') },
    });
  };

  return (
    <div className="form-group">
      <label htmlFor="datum">
        Datum<span className="required">*</span>
      </label>
      <Calendar
        availableDates={availableDates}
        selectedDate={
          formData.datum
            ? moment(formData.datum, 'YYYY-MM-DD')
                .tz('Europe/Amsterdam')
                .toDate()
            : null
        }
        onSelectDate={handleDateSelect}
      />
    </div>
  );
};

export default DateSelector;
