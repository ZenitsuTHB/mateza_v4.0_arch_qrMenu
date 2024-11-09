// CalendarDay.js

import React from 'react';
import TimeOfDayBox from './TimeOfDayBox';
import './css/calendarDay.css';

const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
const timeSlotColors = ['rgba(24, 40, 37,', 'rgba(1, 111, 185,', 'rgba(34, 174, 209,'];

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
  weatherDataByDate,
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
    if (
      selectedShift === 'Dag' ||
      (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
      (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
      (selectedShift === 'Avond' && reservation.timeSlot === 2)
    ) {
      totalGuests += reservation.aantalGasten;
      totalGuestsByTimeSlot[reservation.timeSlot] += reservation.aantalGasten;
    }
  });

  // Adjust background color and data based on selectedViewMode
  let backgroundColor = '';
  let content = null;

  if (selectedViewMode === 'Weer') {
    const temperature = weatherDataByDate[dateString];

    backgroundColor = 'white'; // Or any default background color
    content = (
      <div className="occupancy-percentage">
        <strong>{temperature !== undefined ? `${temperature}°C` : ''}</strong>
      </div>
    );
  } else if (selectedViewMode === 'Bezettingsgraad') {
    // Existing code for Bezettingsgraad
    // ...
  } else if (selectedViewMode === 'Bezettingspercentage') {
    // Existing code for Bezettingspercentage
    // ...
  } else if (selectedViewMode === 'Voorspelling') {
    // Existing code for Voorspelling
    // ...
  }

  const opacity =
    isHovered
      ? 1
      : fadeOut
      ? 0.5
      : selectedViewMode === 'Bezettingsgraad' || selectedViewMode === 'Voorspelling' || selectedViewMode === 'Weer'
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
