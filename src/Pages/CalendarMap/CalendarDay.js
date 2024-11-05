// CalendarDay.js

import React from 'react';
import TimeOfDayBox from './TimeOfDayBox';
import './css/calendarDay.css';
import { maxCapacity } from './reservationData';

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
}) => {
  const dateString = date.toISOString().split('T')[0];
  const reservations = reservationsByDate[dateString] || [];

  const totalGuestsByTimeSlot = [0, 0, 0]; // Morning, Afternoon, Evening

  reservations.forEach((reservation) => {
    if (
      selectedShift === 'Hele Dag' ||
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

  let totalGuests = totalGuestsByTimeSlot.reduce((a, b) => a + b, 0);

  // Adjust background color and data based on selectedViewMode
  let backgroundColor = '';
  let content = null;

  if (selectedViewMode === 'Bezettingsgraad') {
    let heatmapIntensity = 0;
    if (maxOccupation > 0) {
      heatmapIntensity = totalGuests / maxOccupation;
    }

    // Adjust background color for shift
    let heatmapColor = 'rgba(0, 123, 255,'; // default blue
    let textColor = 'white';
    if (selectedShift === 'Ochtend') {
      heatmapColor = 'rgba(24, 40, 37,'; // '#182825'
      textColor = 'white';
    } else if (selectedShift === 'Middag') {
      heatmapColor = 'rgba(1, 111, 185,'; // '#016FB9'
      textColor = 'black';
    } else if (selectedShift === 'Avond') {
      heatmapColor = 'rgba(34, 174, 209,'; // '#22AED1'
      textColor = 'black';
    } else {
      heatmapColor = 'rgba(0, 123, 255,'; // default blue
      textColor = 'white';
    }

    backgroundColor = `${heatmapColor} ${heatmapIntensity})`;

    if (isHovered && totalGuests > 0) {
      content = (
        <div className="heatmap-total-guests" style={{ color: textColor }}>
          <strong>{totalGuests}</strong>
        </div>
      );
    }
  } else if (selectedViewMode === 'Bezettingspercentage') {
    let occupancyRate = 0;
    if (maxCapacity > 0) {
      occupancyRate = (totalGuests / maxCapacity) * 100;
    }
    backgroundColor = 'white'; // or any default color
    content = (
      <div className="occupancy-percentage">
        <strong>{occupancyRate.toFixed(1)}%</strong>
      </div>
    );
  } else if (selectedViewMode === 'Voorspelling') {
    const prediction = predictionsByDate[dateString] || 0;

    let predictionIntensity = 0;
    if (maxPrediction > 0) {
      predictionIntensity = prediction / maxPrediction;
    }

    let predictionColor = 'rgba(255, 0, 0,'; // shades of red
    backgroundColor = `${predictionColor} ${predictionIntensity})`;

    if (isHovered && prediction > 0) {
      content = (
        <div className="prediction-total-guests">
          <strong>{prediction.toFixed(1)}</strong>
        </div>
      );
    }
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
          {totalGuestsByTimeSlot.map((totalGuests, index) => {
            if (totalGuests > 0) {
              if (
                selectedShift === 'Hele Dag' ||
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
