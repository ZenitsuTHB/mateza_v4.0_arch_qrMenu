// CalendarGrid.js

import React, { useState, useEffect } from 'react';
import CalendarDay from './CalendarDay';
import './css/calendarGrid.css';
import { motion } from 'framer-motion';
import WeekReport from './WeekReport'; // Import the WeekReport component

const CalendarGrid = ({
  currentDate,
  reservationsByDate,
  onDateClick,
  selectedShift,
  selectedViewMode,
  predictionsByDate,
  weekOrMonthView,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);
  const [maxOccupation, setMaxOccupation] = useState(0);
  const [maxPrediction, setMaxPrediction] = useState(0);

  // Helper function to get the Monday of the current week
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0); // Reset time to midnight
    return d;
  };

  let dates = [];

  if (weekOrMonthView === 'month') {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    const prevMonthDays = (startDate.getDay() + 6) % 7; // Adjusted for Dutch week starting on Monday

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
  } else if (weekOrMonthView === 'week') {
    const currentWeekStart = getMonday(currentDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      const currentMonth = date.getMonth() === currentDate.getMonth();
      dates.push({ date, currentMonth });
    }
  }

  // Calculate max occupation for Bezettingsgraad and prediction
  useEffect(() => {
    if (
      selectedViewMode === 'Bezettingsgraad' ||
      selectedViewMode === 'Bezettingspercentage' ||
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

      // For Voorspelling, set maxPrediction
      if (selectedViewMode === 'Voorspelling') {
        setMaxPrediction(Math.max(...Object.values(predictionsByDate)));
      } else {
        setMaxPrediction(0);
      }
    }
  }, [dates, reservationsByDate, selectedShift, selectedViewMode, predictionsByDate]);

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

  return (
    <motion.div
      className="calendar-grid"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      key={`${currentDate.toString()}-${selectedViewMode}-${selectedShift}`}
    >
      {/* Calendar Header */}
      <div className="calendar-grid-header">
        {dayNames.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      {/* Calendar Body */}
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

      {/* Week Report */}
      {weekOrMonthView === 'week' && (
        <WeekReport
          dates={dates}
          reservationsByDate={reservationsByDate}
          selectedShift={selectedShift}
        />
      )}
    </motion.div>
  );
};

export default CalendarGrid;
