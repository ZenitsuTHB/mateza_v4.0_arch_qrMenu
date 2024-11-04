// CalendarHeader.js

import React from 'react';
import './css/calendarHeader.css';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, isHeatmap, toggleHeatmap }) => {
  const monthNames = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli',
    'augustus', 'september', 'oktober', 'november', 'december'
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="calendar-header">
      <button className="standard-button blue" onClick={onPrevMonth}>&lt;</button>
      <h2>{month} {year}</h2>
      <div className="header-buttons">
        <button className="standard-button blue heatmap-button" onClick={toggleHeatmap}>
          {isHeatmap ? 'Normaal' : 'Heatmap'}
        </button>
        <button className="standard-button blue" onClick={onNextMonth}>&gt;</button>
      </div>
    </div>
  );
};

export default CalendarHeader;
