// CalendarDay.js

import React, { useState } from 'react';
import TimeOfDayBox from './TimeOfDayBox';
import './css/calendarDay.css';

const CalendarDay = ({
  date,
  currentMonth,
  reservationsByDate,
  onDateClick,
  isHeatmap,
  maxOccupation,
  selectedShift,
}) => {
  const dateString = date.toISOString().split('T')[0];
  const reservations = reservationsByDate[dateString] || [];

  const totalGuestsByTimeSlot = [0, 0, 0]; // Morning, Afternoon, Evening

  reservations.forEach((reservation) => {
    if (
      selectedShift === 'Volledige Dag' ||
      (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
      (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
      (selectedShift === 'Avond' && reservation.timeSlot === 2)
    ) {
      totalGuestsByTimeSlot[reservation.timeSlot] += reservation.aantalGasten;
    }
  });

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isPastDate = date < today;

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (reservations.length > 0) {
      onDateClick(date);
    }
  };

  let heatmapIntensity = 0;
  let totalGuests = 0;
  if (isHeatmap && maxOccupation > 0) {
    totalGuests = totalGuestsByTimeSlot.reduce((a, b) => a + b, 0);
    heatmapIntensity = totalGuests / maxOccupation;
  }

  const heatmapStyle = isHeatmap
    ? { backgroundColor: `rgba(0, 123, 255, ${heatmapIntensity})` } // var(--color-blue)
    : {};

  const opacity = isHovered ? 1 : 1;

  return (
    <div
      className={`calendar-day ${currentMonth ? '' : 'calendar-day--disabled'} ${isPastDate && !isToday ? 'calendar-day--past' : ''} ${isToday ? 'calendar-day--today' : ''}`}
      onClick={handleClick}
      style={{ ...heatmapStyle, opacity }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="calendar-day-number">{date.getDate()}</div>
      {isHeatmap && isHovered && totalGuests > 0 && (
        <div className="heatmap-total-guests">
          <strong>{totalGuests}</strong>
        </div>
      )}
      {!isHeatmap && (
        <div className="time-of-day-boxes">
          {totalGuestsByTimeSlot.map((totalGuests, index) => {
            if (totalGuests > 0) {
              if (
                selectedShift === 'Volledige Dag' ||
                (selectedShift === 'Ochtend' && index === 0) ||
                (selectedShift === 'Middag' && index === 1) ||
                (selectedShift === 'Avond' && index === 2)
              ) {
                return (
                  <TimeOfDayBox
                    key={index}
                    timeSlot={index}
                    totalGuests={totalGuests}
                    isPastDate={isPastDate && !isToday}
                  />
                );
              }
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
