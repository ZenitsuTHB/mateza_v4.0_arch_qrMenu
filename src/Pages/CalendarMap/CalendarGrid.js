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

  // Parameters for prediction algorithm weights
  const WEIGHT_MEDIAN14 = 1; // Weight for 14-day median (including zeros)
  const WEIGHT_MEDIAN20 = 0.9; // Weight for 20-day median (excluding zeros)
  const WEIGHT_AVERAGE90 = 1.7; // Weight for 90-day average of day of week
  const WEIGHT_CURRENT_RESERVATIONS = 0.2; // Weight for current reservations (divided by 5)
  const MULTIPLIER_BASE_PREDICTION = 1; // Multiplier for base prediction (sum of medians and average)

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

      // For Voorspelling, calculate predictions
      if (selectedViewMode === 'Voorspelling') {
        const predictions = calculatePredictions(
          dates.map((d) => d.date),
          reservationsByDate,
          selectedShift
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

  // Function to calculate predictions
  function calculatePredictions(datesArray, reservationsByDate, selectedShift) {
    const predictions = {};
    const today = new Date();

    // Helper function to get reservations for a date
    const getReservationsForDate = (dateStr) => {
      const reservations = reservationsByDate[dateStr] || [];
      return reservations.filter((res) => {
        return (
          selectedShift === 'Hele Dag' ||
          (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
          (selectedShift === 'Middag' && res.timeSlot === 1) ||
          (selectedShift === 'Avond' && res.timeSlot === 2)
        );
      });
    };

    // Prepare historical data
    const historicalData = [];

    // Build historical data for past dates
    datesArray.forEach((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const reservations = getReservationsForDate(dateStr);
      const totalGuests = reservations.reduce((sum, res) => sum + res.aantalGasten, 0);
      historicalData.push({ date, totalGuests });
    });

    // Start predictions from tomorrow
    const startIndex = datesArray.findIndex((date) => date > today);

    // If no future dates are found, return empty predictions
    if (startIndex === -1) {
      return predictions;
    }

    // Use a copy of historicalData to avoid mutating the original during prediction
    const extendedHistoricalData = [...historicalData];

    for (let i = startIndex; i < datesArray.length; i++) {
      const currentDate = datesArray[i];
      const currentDateStr = currentDate.toISOString().split('T')[0];
      const currentReservations = getReservationsForDate(currentDateStr);
      const currentTotalGuests = currentReservations.reduce((sum, res) => sum + res.aantalGasten, 0);

      // Collect data for medians and average
      const past14Days = extendedHistoricalData.slice(Math.max(0, i - 14), i);
      const past20Days = extendedHistoricalData
        .slice(Math.max(0, i - 20), i)
        .filter((data) => data.totalGuests > 0);
      const past90DaysSameDay = extendedHistoricalData.filter((data) => {
        return (
          data.date.getDay() === currentDate.getDay() &&
          data.date < currentDate &&
          (currentDate - data.date) / (1000 * 60 * 60 * 24) <= 90
        );
      });

      // Calculate medians and average
      const median = (values) => {
        if (values.length === 0) return 0;
        values.sort((a, b) => a - b);
        const half = Math.floor(values.length / 2);
        if (values.length % 2) return values[half];
        return (values[half - 1] + values[half]) / 2.0;
      };

      const mean = (values) => {
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
      };

      const median14Values = past14Days.map((d) => d.totalGuests);
      const median14 = median14Values.length ? median(median14Values) : 0;

      const median20Values = past20Days.map((d) => d.totalGuests);
      const median20 = median20Values.length ? median(median20Values) : 0;

      const average90Values = past90DaysSameDay.map((d) => d.totalGuests);
      const average90 = average90Values.length ? mean(average90Values) : 0;

      // Adjust if no data is available
      const factors = [];
      if (median14) factors.push(median14 * WEIGHT_MEDIAN14);
      if (median20) factors.push(median20 * WEIGHT_MEDIAN20);
      if (average90) factors.push(average90 * WEIGHT_AVERAGE90);

      const factorsCount = factors.length || 1;
      const basePrediction =
        (factors.reduce((a, b) => a + b, 0) / factorsCount) * MULTIPLIER_BASE_PREDICTION;

      const adjustedCurrentReservations = (currentTotalGuests / 5) * WEIGHT_CURRENT_RESERVATIONS;

      let prediction = basePrediction + adjustedCurrentReservations;

      // Use max between prediction and current reservations
      if (prediction < currentTotalGuests) {
        prediction = currentTotalGuests;
      }

      // Cap prediction at maxCapacity
      if (prediction > maxCapacity) {
        prediction = maxCapacity;
      }

      // Round prediction
      if (prediction < 1) {
        prediction = 0;
      }

      predictions[currentDateStr] = prediction;

      // Update historical data for future dates
      extendedHistoricalData.push({ date: currentDate, totalGuests: prediction });
    }

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
          <div key={index}>{day}</div>
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
