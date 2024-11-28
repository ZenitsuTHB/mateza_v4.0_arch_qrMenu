// src/Pages/NewReservation/DateSelector.jsx

import React, { useEffect, useState, useCallback } from 'react';
import Calendar from './Calendar';
import { generateAvailableDates } from './Utils/generateDates';
import moment from 'moment';

const DateSelector = ({
  guests,
  formData,
  handleChange,
  resetFormDataFields,
  timeblocks,
}) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [reservations, setReservations] = useState([]); // New state for reservations

  useEffect(() => {
    if (Array.isArray(timeblocks)) {
      const dates = generateAvailableDates(guests, timeblocks, reservations);
      setAvailableDates(dates);
    } else {
      console.error('timeblocks is undefined or not an array:', timeblocks);
      setAvailableDates([]);
    }
  }, [formData.guests, timeblocks, reservations]);

  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log('Selected date:', formattedDate);
    handleChange({
      target: { name: 'date', value: formattedDate },
    });
    resetFormDataFields(['time']);
  };

  // Memoize the callback to prevent unnecessary re-renders
  const handleReservationsFetched = useCallback((data) => {
    setReservations(data); // Update the reservations state
  }, []);

  return (
    <div className="form-group date-selector-container">
      <Calendar
        availableDates={availableDates}
        selectedDate={formData.date || null}
        onSelectDate={handleDateSelect}
        autoExpand={false}
        onReservationsFetched={handleReservationsFetched} // Pass the handler as prop
      />
    </div>
  );
};

export default DateSelector;
