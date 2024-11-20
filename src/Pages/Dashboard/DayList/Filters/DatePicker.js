// DatePickerComponent.js

import React from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaPrint } from 'react-icons/fa'; // Import FaPrint
import 'react-datepicker/dist/react-datepicker.css';
import {
  formatDateDutch,
  isToday,
} from '../../../../Utils/dateUtils.js';
import './css/datePicker.css';
import '../css/print.css';


const DatePickerComponent = ({
  selectedDate,
  setSelectedDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
  handleDateChange,
}) => {
  const handlePrintClick = (e) => {
    e.stopPropagation(); // Prevent triggering other click events
    window.print(); // Trigger the print dialog
  };

  return (
    <div className="date-picker-component">
      {selectedDate && (
        <h2 className="selected-date">
          {isToday(selectedDate) ? 'Vandaag' : formatDateDutch(selectedDate)}
          <FaPrint
            className="print-icon"
            onClick={handlePrintClick}
            title="Print"
          />
        </h2>
      )}

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
