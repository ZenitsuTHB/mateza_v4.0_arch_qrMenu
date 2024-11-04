// CalendarHeader.js

import React from 'react';
import './css/calendarHeader.css';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, isHeatmap, toggleHeatmap }) => {
  const monthNames = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli',
    'augustus', 'september', 'oktober', 'november', 'december'
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="calendar-header">
      <button className="nav-button" onClick={onPrevMonth}>
        <FaChevronLeft size={24} />
      </button>
      <h2>{month} {year}</h2>
      <div className="header-buttons">
        <button className="standard-button blue heatmap-button" onClick={toggleHeatmap}>
          <FaFire style={{ marginRight: '5px' }} />
          {isHeatmap ? 'Normaal' : 'Heatmap'}
        </button>
        <button className="nav-button" onClick={onNextMonth}>
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
