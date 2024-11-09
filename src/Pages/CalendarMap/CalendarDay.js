// CalendarDay.js

import React from 'react';
import TimeOfDayBox from './TimeOfDayBox';
import './css/calendarDay.css';

const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];

const CalendarDay = ({
  date,
  currentMonth,
  reservationsByDate,
  onDateClick,
  maxOccupation,
  maxPrediction,
  selectedShift,
  selectedViewMode,
  predictionsByDate,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  fadeOut,
  maxCapacity,
  gemiddeldeDuurCouvert,
}) => {
  const dateString = date.toISOString().split('T')[0];
  const reservations = reservationsByDate[dateString] || [];

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isPastDate = date < today && !isToday;

  const handleClick = () => {
    if (reservations.length > 0) {
      onDateClick(date);
    }
  };

  let totalGuests = 0;

  // Calculate totalGuestsByTimeSlot
  const totalGuestsByTimeSlot = [0, 0, 0]; // Ochtend, Middag, Avond

  reservations.forEach((reservation) => {
    totalGuests += reservation.aantalGasten;
    totalGuestsByTimeSlot[reservation.timeSlot] += reservation.aantalGasten;
  });

  // Adjust background color and data based on selectedViewMode
  let backgroundColor = '';
  let content = null;

  if (selectedViewMode === 'Bezettingsgraad') {
    // ... (existing code for Bezettingsgraad)
  } else if (selectedViewMode === 'Bezettingspercentage') {
    // ... (existing code for Bezettingspercentage)
  } else if (selectedViewMode === 'Voorspelling') {
    // ... (existing code for Voorspelling)
  }

  const opacity =
    isHovered
      ? 1
      : fadeOut
      ? 0.5
      : selectedViewMode === 'Bezettingsgraad' || selectedViewMode === 'Voorspelling'
      ? 1
      : isPastDate && !isHovered
      ? 0.5
      : 1;

  return (
    <div
      className={`calendar-day ${currentMonth ? '' : 'calendar-day--disabled'} ${
        isPastDate ? 'calendar-day--past' : ''
      } ${isToday ? 'calendar-day--today' : ''} ${
        selectedViewMode !== 'Algemeen' ? 'special-mode' : ''
      }`}
      onClick={handleClick}
      style={{
        backgroundColor,
        opacity,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="calendar-day-number">{date.getDate()}</div>
      {content}
      {selectedViewMode === 'Algemeen' && (
        <div className="time-of-day-boxes">
          {[0, 1, 2].map((timeSlot) => {
            const shiftName = timeSlotNames[timeSlot];
            const totalGuestsInShift = totalGuestsByTimeSlot[timeSlot];

            if (
              (selectedShift === 'Dag' || selectedShift === shiftName) &&
              totalGuestsInShift > 0
            ) {
              return (
                <TimeOfDayBox
                  key={timeSlot}
                  timeSlot={timeSlot}
                  totalGuests={totalGuestsInShift}
                  isPastDate={isPastDate}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
