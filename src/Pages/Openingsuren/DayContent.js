// src/pages/SchedulePage/DayContent.js

import React from 'react';
import './css/dayContent.css';
import MaxCapacityAccordion from './MaxCapacityAccordion';

const DayContent = ({ dayId, days }) => {
  const day = days.find((d) => d.id === dayId);

  return (
    <div className="schedule-page">
      {/* Title outside the container with the same class as AccountManage */}
      <h1 className="schedule-page-title">{day.label}</h1>
      
      {/* White container for input fields */}
      <div className="day-content scheme-container">
        <div className="time-inputs-container">
          <div className="input-container">
            <label htmlFor="startTime">
              Start Tijd
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
            />
          </div>
          <div className="input-container">
            <label htmlFor="endTime">
              Eind Tijd
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
            />
          </div>
        </div>

        {/* Insert the MaxCapacityAccordion here */}
        <MaxCapacityAccordion />
      </div>
    </div>
  );
};

export default DayContent;
