// CalendarDay.js

import React from 'react';
import TimeOfDayBox from './TimeOfDayBox';
import './css/calendarDay.css';

const CalendarDay = ({
  date,
  currentMonth,
  reservationsByDate,
  onDateClick,
  isHeatmap,
  maxOccupation,
}) => {
  const dateString = date.toISOString().split('T')[0];
  const reservations = reservationsByDate[dateString] || [];

  const totalGuestsByTimeSlot = [0, 0, 0]; // Morning, Afternoon, Evening

  reservations.forEach((reservation) => {
    totalGuestsByTimeSlot[reservation.timeSlot] += reservation.aantalGasten;
  });

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isPastDate = date < today;

  const handleClick = () => {
    if (reservations.length > 0) {
      onDateClick(date);
    }
  };

  let heatmapIntensity = 0;
  if (isHeatmap && maxOccupation > 0) {
    const totalGuests = totalGuestsByTimeSlot.reduce((a, b) => a + b, 0);
    heatmapIntensity = totalGuests / maxOccupation;
  }

  const heatmapStyle = isHeatmap
    ? { backgroundColor: `rgba(0, 123, 255, ${heatmapIntensity})` } // var(--color-blue)
    : {};

  return (
    <div
      className={`calendar-day ${currentMonth ? '' : 'calendar-day--disabled'} ${isPastDate ? 'calendar-day--past' : ''} ${isToday ? 'calendar-day--today' : ''}`}
      onClick={handleClick}
      style={heatmapStyle}
    >
      <div className="calendar-day-number">{date.getDate()}</div>
      {!isHeatmap && (
        <div className="time-of-day-boxes">
          {totalGuestsByTimeSlot.map((totalGuests, index) => {
            if (totalGuests > 0) {
              return (
                <TimeOfDayBox
                  key={index}
                  timeSlot={index}
                  totalGuests={totalGuests}
                  isPastDate={isPastDate}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
