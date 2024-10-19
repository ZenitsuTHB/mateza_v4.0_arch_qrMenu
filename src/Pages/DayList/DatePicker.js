// DatePickerComponent.js

import React from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import {
  formatDateDutch,
  isToday,
} from '../../Utils/dateUtils.js';
import './css/datePicker.css';

const DatePickerComponent = ({
  selectedDate,
  setSelectedDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
  handleDateChange,
}) => {
  return (
    <div className="date-picker-component">
      {selectedDate && (
        <h2 className="selected-date">
          {isToday(selectedDate) ? 'Vandaag' : formatDateDutch(selectedDate)}
        </h2>
      )}

      <button
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className="date-button"
      >
        <FaCalendarAlt className="date-button-icon" />
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
