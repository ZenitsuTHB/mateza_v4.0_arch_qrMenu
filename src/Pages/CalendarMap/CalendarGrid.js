// CalendarGrid.js

import React, { useState, useEffect } from 'react';
import CalendarDay from './CalendarDay';
import './css/calendarGrid.css';
import { motion } from 'framer-motion';
import { maxCapacity } from './reservationData';

const CalendarGrid = ({
  currentDate,
  reservationsByDate,
  onDateClick,
  selectedShift,
  selectedViewMode,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);
  const [predictionsByDate, setPredictionsByDate] = useState({});
  const [maxOccupation, setMaxOccupation] = useState(0);
  const [maxPrediction, setMaxPrediction] = useState(0);

  // Removed obsolete weight parameters
  // const WEIGHT_MEDIAN14 = 1;
  // const WEIGHT_MEDIAN20 = 1;
  // const WEIGHT_AVERAGE90 = 1;
  // const WEIGHT_CURRENT_RESERVATIONS = 0.2;
  // const MULTIPLIER_BASE_PREDICTION = 0.8;

  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const numDays = endDate.getDate();

  const prevMonthDays = (startDate.getDay() + 6) % 7; // Adjusted for Dutch week starting on Monday

  const dates = [];

  // Fill in dates from previous month
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
    dates.push({ date, currentMonth: false });
  }

  // Dates in current month
  for (let i = 1; i <= numDays; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    dates.push({ date, currentMonth: true });
  }

  // Fill in dates for next month to complete the grid
  while (dates.length % 7 !== 0) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      dates.length - numDays - prevMonthDays + 1
    );
    dates.push({ date, currentMonth: false });
  }

  // Calculate max occupation for heatmap and prediction
  useEffect(() => {
    if (
      selectedViewMode === 'Heatmap' ||
      selectedViewMode === 'Bezetting' ||
      selectedViewMode === 'Voorspelling'
    ) {
      const occupations = dates.map(({ date }) => {
        const dateString = date.toISOString().split('T')[0];
        const reservations = reservationsByDate[dateString] || [];
        let totalGuests = 0;

        reservations.forEach((res) => {
          if (
            selectedShift === 'Hele Dag' ||
            (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
            (selectedShift === 'Middag' && res.timeSlot === 1) ||
            (selectedShift === 'Avond' && res.timeSlot === 2)
          ) {
            totalGuests += res.aantalGasten;
          }
        });

        return totalGuests;
      });
      setMaxOccupation(Math.max(...occupations));

      // For Voorspelling (Prediction), calculate predictions
      if (selectedViewMode === 'Voorspelling') {
        const predictions = calculatePredictions(
          dates.map((d) => d.date),
          reservationsByDate
        );
        setPredictionsByDate(predictions);
        setMaxPrediction(Math.max(...Object.values(predictions)));
      } else {
        setPredictionsByDate({});
        setMaxPrediction(0);
      }
    }
  }, [dates, reservationsByDate, selectedShift, selectedViewMode]);

  const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']; // Dutch day names

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Function to calculate predictions based on average guests per day of week
  function calculatePredictions(datesArray, reservationsByDate) {
    const predictions = {};
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Step 1: Calculate average guests per day of the week from past data
    const dayOfWeekGuests = {
      1: [], // Monday
      2: [], // Tuesday
      3: [], // Wednesday
      4: [], // Thursday
      5: [], // Friday
      6: [], // Saturday
      0: [], // Sunday
    };

    datesArray.forEach((date) => {
      if (date < today) {
        const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        const dateStr = date.toISOString().split('T')[0];
        const reservations = reservationsByDate[dateStr] || [];
        const totalGuests = reservations.reduce((sum, res) => sum + res.aantalGasten, 0);
        dayOfWeekGuests[day].push(totalGuests);
      }
    });

    // Compute average guests per day of the week
    const averageGuestsPerDay = {};
    for (let day = 0; day < 7; day++) {
      const guests = dayOfWeekGuests[day];
      const total = guests.reduce((sum, val) => sum + val, 0);
      const average = guests.length ? total / guests.length : 0;
      averageGuestsPerDay[day] = average;
    }

    // Step 2: Predict for future dates
    datesArray.forEach((date) => {
      if (date > today) {
        const day = date.getDay();
        const dateStr = date.toISOString().split('T')[0];
        const reservations = reservationsByDate[dateStr] || [];
        const currentGuests = reservations.reduce((sum, res) => sum + res.aantalGasten, 0);

        // Calculate days in the future
        const diffTime = date - today;
        const daysInFuture = Math.ceil(diffTime / oneDayMs);

        // Define a decay factor (e.g., the farther in the future, the less influence current reservations have)
        // Here, we'll use a linear decay where influence decreases by 1% per day in the future, capping at 50%
        const maxDecayFactor = 0.5;
        const decayFactor = Math.max(maxDecayFactor, 1 - 0.01 * daysInFuture);

        // Prediction is average guests for the day of the week plus adjusted current reservations
        let prediction = averageGuestsPerDay[day] + currentGuests * decayFactor;

        // Ensure prediction is at least the current reservations
        prediction = Math.max(prediction, currentGuests);

        // Cap prediction at maxCapacity
        prediction = Math.min(prediction, maxCapacity);

        // Round prediction to the nearest integer
        prediction = Math.round(prediction);

        // Assign prediction
        predictions[dateStr] = prediction;
      }
    });

    return predictions;
  }

  return (
    <motion.div
      className="calendar-grid"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      key={`${currentDate.toString()}-${selectedViewMode}-${selectedShift}`}
    >
      <div className="calendar-grid-header">
        {dayNames.map((day, index) => (
          <div key={index} className="calendar-grid-header-day">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid-body">
        {dates.map(({ date, currentMonth }, index) => (
          <motion.div key={index} variants={itemVariants}>
            <CalendarDay
              date={date}
              currentMonth={currentMonth}
              reservationsByDate={reservationsByDate}
              onDateClick={onDateClick}
              maxOccupation={maxOccupation}
              maxPrediction={maxPrediction}
              selectedShift={selectedShift}
              selectedViewMode={selectedViewMode}
              predictionsByDate={predictionsByDate}
              isHovered={hoveredDayIndex === index}
              onMouseEnter={() => setHoveredDayIndex(index)}
              onMouseLeave={() => setHoveredDayIndex(null)}
              fadeOut={hoveredDayIndex !== null && hoveredDayIndex !== index}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarGrid;
