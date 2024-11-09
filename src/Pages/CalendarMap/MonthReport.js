// MonthReport.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const MonthReport = ({ dates, reservationsByDate, selectedShift, autoGenerate = false }) => {
  const [reportGenerated, setReportGenerated] = useState(autoGenerate);
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState([]); // Array of weeks, each week is an array of dates
  const [stats, setStats] = useState({});
  const [totalGuests, setTotalGuests] = useState(0); // Total guests over the month

  useEffect(() => {
    if (autoGenerate) {
      generateReportData();
    }
    // Group dates into weeks
    const groupedWeeks = groupDatesIntoWeeks(dates);
    setWeeks(groupedWeeks);
  }, [dates, autoGenerate]);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      generateReportData();
      setLoading(false);
      setReportGenerated(true);
    }, 2000); // Simulate 2 seconds loading time
  };

  // Function to group dates into weeks
  const groupDatesIntoWeeks = (dates) => {
    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }
    return weeks;
  };

  // Function to generate the report data for the entire month
  const generateReportData = () => {
    let totals = [0, 0, 0]; // [Morning, Afternoon, Evening]
    let dailyTotalsTemp = []; // To store total guests per day
    let totalGuestsTemp = 0; // Total guests over the month

    dates.forEach(({ date }) => {
      const dateString = date.toISOString().split('T')[0];
      const reservations = reservationsByDate[dateString] || [];
      let dayTotal = 0;
      let shiftTotals = [0, 0, 0];

      reservations.forEach((reservation) => {
        if (
          selectedShift === 'Dag' ||
          (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
          (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
          (selectedShift === 'Avond' && reservation.timeSlot === 2)
        ) {
          totals[reservation.timeSlot] += reservation.aantalGasten;
          shiftTotals[reservation.timeSlot] += reservation.aantalGasten;
          dayTotal += reservation.aantalGasten;
        }
      });

      totalGuestsTemp += dayTotal;

      dailyTotalsTemp.push({
        date,
        total: dayTotal,
        shiftTotals,
      });
    });

    setTotalGuests(totalGuestsTemp);

    // Calculate statistical data
    if (dailyTotalsTemp.length > 0) {
      const guestCounts = dailyTotalsTemp.map((day) => day.total);
      const min = Math.min(...guestCounts);
      const max = Math.max(...guestCounts);
      const median = calculateMedian(guestCounts);
      const average = calculateAverage(guestCounts);
      const variance = calculateVariance(guestCounts, average);
      const highest = dailyTotalsTemp.find((day) => day.total === max);
      const lowest = dailyTotalsTemp.find((day) => day.total === min);

      setStats({
        minGuests: min,
        maxGuests: max,
        medianGuests: median,
        averageGuests: average.toFixed(2),
        varianceGuests: variance.toFixed(2),
        lowestDay: lowest ? lowest.date : null,
        highestDay: highest ? highest.date : null,
      });
    }

    setReportGenerated(true);
  };

  // Helper functions for statistics
  const calculateMedian = (numbers) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const calculateAverage = (numbers) =>
    numbers.reduce((acc, val) => acc + val, 0) / numbers.length;

  const calculateVariance = (numbers, mean) => {
    const squaredDiffs = numbers.map((val) => (val - mean) ** 2);
    return squaredDiffs.reduce((acc, val) => acc + val, 0) / numbers.length;
  };

  const getDutchDateString = (date) =>
    date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });

  const getDutchDayName = (date) =>
    date.toLocaleDateString('nl-NL', { weekday: 'long' });

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="month-report">
      {!reportGenerated && !loading && !autoGenerate && (
        <div
          className="generate-report-text"
          onClick={handleGenerateReport}
          style={{ color: 'var(--color-blue)', cursor: 'pointer' }}
        >
          Genereer rapport
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="progress-bar"></div>
          <div>Laden...</div>
        </div>
      )}

      {(reportGenerated || autoGenerate) && (
        <motion.div
          className="calendar-report-table"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Updated Title Section */}
          <div className="calendar-report-title">
            Maandrapport {selectedShift !== 'Dag' && `- ${selectedShift}`}
          </div>

          {/* Render collapsible blocks for each week */}
          <div className="weeks-container">
            {weeks.map((weekDates, weekIndex) => (
              <CollapsibleBlock
                key={weekIndex}
                weekNumber={weekIndex + 1}
                dates={weekDates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
              />
            ))}
          </div>

          {/* Add margin between weeks and statistics */}
          <div className="statistics-separator"></div>

          {/* Render statistical data for the entire month */}
          <div className="statistical-data">
            <table>
              <thead>
                <tr>
                  <th>Statistiek</th>
                  <th>Waarde</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats).map(([key, value], index) => (
                  <motion.tr key={index} variants={rowVariants}>
                    <td>{statLabels[key]}</td>
                    <td>
                      {key.includes('Day') && value
                        ? getDutchDayName(value)
                        : value}
                    </td>
                  </motion.tr>
                ))}
                <motion.tr variants={rowVariants} className="totals-styled">
                  <td><strong>Totaal aantal gasten</strong></td>
                  <td>{totalGuests}</td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// CollapsibleBlock component
const CollapsibleBlock = ({ weekNumber, dates, reservationsByDate, selectedShift }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate week label
  const weekLabel = `Week ${weekNumber}`;

  // Function to calculate total guests per day
  const calculateDailyGuests = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const reservations = reservationsByDate[dateString] || [];
    let totalGuests = 0;

    reservations.forEach((reservation) => {
      if (
        selectedShift === 'Dag' ||
        (selectedShift === 'Ochtend' && reservation.timeSlot === 0) ||
        (selectedShift === 'Middag' && reservation.timeSlot === 1) ||
        (selectedShift === 'Avond' && reservation.timeSlot === 2)
      ) {
        totalGuests += reservation.aantalGasten;
      }
    });

    return totalGuests;
  };

  // Calculate total guests for the week
  const totalGuestsForWeek = dates.reduce((total, day) => {
    return total + calculateDailyGuests(day.date);
  }, 0);

  return (
    <div className="collapsible-block">
      <div
        className="block-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="block-title">{weekLabel}</div>
        <FaChevronDown
          className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="block-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <table className="week-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Dag</th>
                  <th>Aantal Gasten</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((day, index) => (
                  <tr key={index}>
                    <td>{day.date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td>{getDutchDayName(day.date)}</td>
                    <td>{calculateDailyGuests(day.date)}</td>
                  </tr>
                ))}
                <tr className="totals-styled">
                  <td><strong>Totaal</strong></td>
                  <td></td>
                  <td><strong>{totalGuestsForWeek}</strong></td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get Dutch day names
const getDutchDayName = (date) =>
  date.toLocaleDateString('nl-NL', { weekday: 'long' });

const statLabels = {
  minGuests: 'Minimaal aantal gasten',
  maxGuests: 'Maximaal aantal gasten',
  medianGuests: 'Mediaan aantal gasten',
  averageGuests: 'Gemiddeld aantal gasten',
  varianceGuests: 'Variantie aantal gasten',
  lowestDay: 'Laagste dag',
  highestDay: 'Hoogste dag',
};

export default MonthReport;
