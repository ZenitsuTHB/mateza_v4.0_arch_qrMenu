// src/pages/SchedulePage/TimeInputs.js

import React from 'react';
import './css/timeInputs.css';

const TimeInputs = ({ startTime, endTime, setStartTime, setEndTime }) => {
  return (
    <div className="schedule-page time-inputs">
      <div className="time-input">
        <label>Start tijd:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="time-input">
        <label>Eind tijd:</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TimeInputs;
