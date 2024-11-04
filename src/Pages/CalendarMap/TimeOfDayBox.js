// TimeOfDayBox.js

import React from 'react';
import './css/timeOfDay.css';

const TimeOfDayBox = ({ timeSlot, totalGuests, isPastDate }) => {
  const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
  const timeSlotColors = ['#28a745', '#17a2b8', '#007BFF']; // Green, Cyan, Blue
  const backgroundColor = timeSlotColors[timeSlot];
  const opacity = isPastDate ? 0.5 : 1;

  return (
    <div
      className="time-of-day-box"
      style={{ backgroundColor, opacity }}
    >
      <span>{timeSlotNames[timeSlot]}: {totalGuests}</span>
    </div>
  );
};

export default TimeOfDayBox;
