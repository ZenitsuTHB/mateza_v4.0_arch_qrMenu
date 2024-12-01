// src/pages/SchedulePage/DayContent.js

import React from 'react';
import './css/dayContent.css';

const DayContent = ({ dayId, days }) => {
  const day = days.find((d) => d.id === dayId);

  return (
    <div className="schedule-page day-content">
      <h1>{day.label}</h1>
    </div>
  );
};

export default DayContent;
