// CalendarHeader.js

import React from 'react';
import './css/calendarHeader.css';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, isHeatmap, toggleHeatmap }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="calendar-header">
      <button onClick={onPrevMonth}>&lt;</button>
      <h2>{month} {year}</h2>
      <button onClick={onNextMonth}>&gt;</button>
      <button className="heatmap-button" onClick={toggleHeatmap}>
        {isHeatmap ? 'Normal View' : 'Heatmap'}
      </button>
    </div>
  );
};

export default CalendarHeader;
