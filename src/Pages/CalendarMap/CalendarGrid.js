// CalendarGrid.js

import React, { useState } from 'react';
import CalendarDay from './CalendarDay';
import './css/calendarGrid.css';
import { motion } from 'framer-motion';

const CalendarGrid = ({
  currentDate,
  reservationsByDate,
  onDateClick,
  selectedShift,
  selectedViewMode,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);

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

  // Calculate max occupation for heatmap
  let maxOccupation = 0;
  if (selectedViewMode === 'Heatmap' || selectedViewMode === 'Bezetting') {
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
    maxOccupation = Math.max(...occupations);
  }

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
              selectedShift={selectedShift}
              selectedViewMode={selectedViewMode}
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
