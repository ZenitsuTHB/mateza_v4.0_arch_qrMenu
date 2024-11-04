// CalendarGrid.js

import React from 'react';
import CalendarDay from './CalendarDay';
import './css/calendarGrid.css';

const CalendarGrid = ({ currentDate, reservationsByDate, onDateClick, isHeatmap }) => {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const numDays = endDate.getDate();

  const prevMonthDays = startDate.getDay(); // Number of days from previous month to show

  const dates = [];

  // Fill in dates from previous month
  for (let i = prevMonthDays -1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
    dates.push({ date, currentMonth: false });
  }

  // Dates in current month
  for (let i = 1; i <= numDays; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    dates.push({ date, currentMonth: true });
  }

  // Fill in dates for next month to complete the grid
  while (dates.length % 7 !== 0) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, dates.length - numDays - prevMonthDays + 1);
    dates.push({ date, currentMonth: false });
  }

  // Calculate max occupation for heatmap
  let maxOccupation = 0;
  if (isHeatmap) {
    const occupations = dates.map(({ date }) => {
      const dateString = date.toISOString().split('T')[0];
      const reservations = reservationsByDate[dateString] || [];
      const totalGuests = reservations.reduce((sum, res) => sum + res.aantalGasten, 0);
      return totalGuests;
    });
    maxOccupation = Math.max(...occupations);
  }

  return (
    <div className="calendar-grid">
      <div className="calendar-grid-header">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="calendar-grid-body">
        {dates.map(({ date, currentMonth }, index) => (
          <CalendarDay
            key={index}
            date={date}
            currentMonth={currentMonth}
            reservationsByDate={reservationsByDate}
            onDateClick={onDateClick}
            isHeatmap={isHeatmap}
            maxOccupation={maxOccupation}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
