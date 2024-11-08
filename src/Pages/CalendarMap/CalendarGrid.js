// CalendarGrid.js

import React, { useState, useEffect } from 'react';
import CalendarDay from './CalendarDay';
import './css/calendarGrid.css';
import { motion } from 'framer-motion';

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
  const [totalGuestsByShift, setTotalGuestsByShift] = useState([0, 0, 0]); // [Morning, Afternoon, Evening]

  // State variables for statistical report
  const [minGuests, setMinGuests] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [medianGuests, setMedianGuests] = useState(0);
  const [averageGuests, setAverageGuests] = useState(0);
  const [varianceGuests, setVarianceGuests] = useState(0);
  const [highestDay, setHighestDay] = useState(null);
  const [lowestDay, setLowestDay] = useState(null);

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

  // Calculate total guests by shift and statistical report when in week view
  useEffect(() => {
    if (weekOrMonthView === 'week') {
      let totals = [0, 0, 0]; // [Morning, Afternoon, Evening]
      let dailyTotals = []; // To store total guests per day

      dates.forEach(({ date }) => {
        const dateString = date.toISOString().split('T')[0];
        const reservations = reservationsByDate[dateString] || [];
        let dayTotal = 0;

        reservations.forEach((reservation) => {
          if (
            selectedShift === 'Hele Dag' ||
            (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
            (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
            (selectedShift === 'Avond' && reservation.timeSlot === 2)
          ) {
            totals[reservation.timeSlot] += reservation.aantalGasten;
            dayTotal += reservation.aantalGasten;
          }
        });

        dailyTotals.push({ date, total: dayTotal });
      });

      setTotalGuestsByShift(totals);

      // Calculate statistical data
      if (dailyTotals.length > 0) {
        const guestCounts = dailyTotals.map((day) => day.total);
        const min = Math.min(...guestCounts);
        const max = Math.max(...guestCounts);
        const median = calculateMedian(guestCounts);
        const average = calculateAverage(guestCounts);
        const variance = calculateVariance(guestCounts, average);
        const highest = dailyTotals.find((day) => day.total === max);
        const lowest = dailyTotals.find((day) => day.total === min);

        setMinGuests(min);
        setMaxGuests(max);
        setMedianGuests(median);
        setAverageGuests(average.toFixed(2));
        setVarianceGuests(variance.toFixed(2));
        setHighestDay(highest ? highest.date : null);
        setLowestDay(lowest ? lowest.date : null);
      }
    }
  }, [dates, reservationsByDate, selectedShift, weekOrMonthView, selectedViewMode, predictionsByDate]);

  // Helper functions for statistics
  const calculateMedian = (numbers) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  };

  const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
  };

  const calculateVariance = (numbers, mean) => {
    const squaredDiffs = numbers.map((val) => Math.pow(val - mean, 2));
    const sum = squaredDiffs.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
  };

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

  // Helper function to format date to Dutch day name
  const getDutchDayName = (date) => {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('nl-NL', options);
  };

  return (
    <motion.div
      className="calendar-grid"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      key={`${currentDate.toString()}-${selectedViewMode}-${selectedShift}`}
      style={{ height: weekOrMonthView === 'week' ? '700px' : '600px' }} // Adjust height for report
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

      {/* Totals Report for Week View */}
      {weekOrMonthView === 'week' && (
        <div className="calendar-grid-totals">
          <div className="calendar-report-table">
            <div className="calendar-report-title">Weekrapport</div>
            <table>
              <thead>
                <tr>
                  <th>Statistiek</th>
                  <th>Waarde</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Minimaal aantal gasten</td>
                  <td>{minGuests}</td>
                </tr>
                <tr>
                  <td>Maximaal aantal gasten</td>
                  <td>{maxGuests}</td>
                </tr>
                <tr>
                  <td>Mediaan aantal gasten</td>
                  <td>{medianGuests}</td>
                </tr>
                <tr>
                  <td>Gemiddeld aantal gasten</td>
                  <td>{averageGuests}</td>
                </tr>
                <tr>
                  <td>Variantie aantal gasten</td>
                  <td>{varianceGuests}</td>
                </tr>
                <tr>
                  <td>Hoogste dag</td>
                  <td>{highestDay ? getDutchDayName(highestDay) : '-'}</td>
                </tr>
                <tr>
                  <td>Laagste dag</td>
                  <td>{lowestDay ? getDutchDayName(lowestDay) : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CalendarGrid;
