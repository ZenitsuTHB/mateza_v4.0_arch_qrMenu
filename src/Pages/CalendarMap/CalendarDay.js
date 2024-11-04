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
  selectedShift,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  fadeOut,
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
  const isPastDate = date < today && !isToday;

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

  // Adjust background color for shift
  let heatmapColor = 'rgba(0, 123, 255,'; // default blue
  if (isHeatmap) {
    if (selectedShift === 'Ochtend') {
      heatmapColor = 'rgba(24, 40, 37,'; // '#182825'
    } else if (selectedShift === 'Middag') {
      heatmapColor = 'rgba(1, 111, 185,'; // '#016FB9'
    } else if (selectedShift === 'Avond') {
      heatmapColor = 'rgba(34, 174, 209,'; // '#22AED1'
    } else {
      heatmapColor = 'rgba(0, 123, 255,'; // default blue
    }
  }

  const opacity = fadeOut ? 0.5 : 1;

  return (
    <div
      className={`calendar-day ${currentMonth ? '' : 'calendar-day--disabled'} ${
        isPastDate ? 'calendar-day--past' : ''
      } ${isToday ? 'calendar-day--today' : ''} ${isHeatmap ? 'heatmap-mode' : ''}`}
      onClick={handleClick}
      style={{
        backgroundColor: isHeatmap ? `${heatmapColor} ${heatmapIntensity})` : '',
        opacity,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
                    isPastDate={isPastDate}
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
