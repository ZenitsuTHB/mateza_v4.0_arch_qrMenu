// src/components/DatePickerComponent/DatePickerComponent.jsx

import React from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import {
  formatDateDutch,
  isToday,
} from '../../../Utils/dateUtils.js';
import './css/datePicker.css';

const DatePickerComponent = ({
  selectedDate,
  setSelectedDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
}) => {
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const handlePrintClick = (e) => {
    e.stopPropagation(); // Prevent triggering other click events
    // Future implementation for printing
    console.log('Print icon clicked');
  };

  return (
    <div className="date-picker-component">
      {selectedDate && (
        <h2 className="selected-date">
          {isToday(selectedDate) ? 'Vandaag' : formatDateDutch(selectedDate)}
        </h2>
      )}

	   <button
        className="button-style-1 button-date"
		onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
      >

		
        <FaCalendarAlt className="button-style-1-icon" />
        {selectedDate
          ? isToday(selectedDate)
            ? 'Vandaag'
            : `${formatDateDutch(selectedDate)}`
          : 'Datum'}
      </button>

      <button
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className="button-style-1 date-button"
      >

		
        <FaCalendarAlt className="button-style-1-icon date-button-icon" />
        {selectedDate
          ? isToday(selectedDate)
            ? 'Vandaag'
            : `${formatDateDutch(selectedDate)}`
          : 'Datum'}
      </button>

      {isDatePickerOpen && (
        <div className="date-picker-popup">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            locale="nl"
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecteer een datum"
            todayButton="Vandaag"
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
