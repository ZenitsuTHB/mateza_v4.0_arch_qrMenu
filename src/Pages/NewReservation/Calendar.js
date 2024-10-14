// src/components/NewReservation/Calendar.jsx

import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './css/calendar.css';

const Calendar = ({ availableDates, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(
    moment().tz('Europe/Amsterdam') // Set to CEST timezone
  );

  const daysOfWeek = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const months = [
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December',
  ];

  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');

    // Start from Monday
    const startDate = startOfMonth.clone().startOf('isoWeek');
    const endDate = endOfMonth.clone().endOf('isoWeek');

    const date = startDate.clone();
    const days = [];

    while (date.isBefore(endDate) || date.isSame(endDate, 'day')) {
      days.push(date.clone());
      date.add(1, 'day');
    }

    return days;
  };

  const handleDateClick = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    if (availableDates.includes(dateString)) {
      onSelectDate(date.toDate());
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  const days = generateCalendarDays();

  const isSameDay = (date1, date2) => {
    return date1.isSame(date2, 'day');
  };

  const today = moment().tz('Europe/Amsterdam');

  return (
    <div className="calendar">
      {/* Calendar header with month and year navigation */}
      <div className="calendar-header">
        <button type="button" onClick={handlePrevMonth}>
          &lt;
        </button>
        <span>
          {months[currentMonth.month()]} {currentMonth.year()}
        </span>
        <button type="button" onClick={handleNextMonth}>
          &gt;
        </button>
      </div>
      {/* Calendar grid */}
      <table className="calendar-table">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: days.length / 7 }).map((_, weekIndex) => (
            <tr key={weekIndex}>
              {days
                .slice(weekIndex * 7, weekIndex * 7 + 7)
                .map((day, index) => {
                  const dateString = day.format('YYYY-MM-DD');
                  const isAvailable = availableDates.includes(dateString);
                  const isSelected =
                    selectedDate &&
                    isSameDay(
                      day,
                      moment(selectedDate).tz('Europe/Amsterdam')
                    );

                  return (
                    <td
                      key={index}
                      className={`${
                        isAvailable ? 'available' : 'unavailable'
                      } ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="day-circle">{day.date()}</div>
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
