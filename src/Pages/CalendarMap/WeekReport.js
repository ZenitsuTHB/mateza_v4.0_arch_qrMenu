// WeekReport.js

import React, { useState, useEffect } from 'react';
import './css/weekReport.css';
import { motion } from 'framer-motion';

const WeekReport = ({ dates, reservationsByDate, selectedShift, autoGenerate = false }) => {
  const [reportGenerated, setReportGenerated] = useState(autoGenerate);
  const [loading, setLoading] = useState(false);
  const [totalGuestsByShift, setTotalGuestsByShift] = useState([0, 0, 0]); // [Morning, Afternoon, Evening]
  const [dailyTotals, setDailyTotals] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (autoGenerate) {
      generateReportData();
    }
  }, [autoGenerate]);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      generateReportData();
      setLoading(false);
      setReportGenerated(true);
    }, 2000); // Simulate 2 seconds loading time
  };

  // Function to generate the report data
  const generateReportData = () => {
    let totals = [0, 0, 0]; // [Morning, Afternoon, Evening]
    let dailyTotalsTemp = []; // To store total guests per day

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

      dailyTotalsTemp.push({
        date,
        total: dayTotal,
        shiftTotals,
      });
    });

    setTotalGuestsByShift(totals);
    setDailyTotals(dailyTotalsTemp);

    // Calculate statistical data
    if (dailyTotalsTemp.length > 0) {
      const guestCounts = dailyTotalsTemp.map((day) => day.total);
      const min = Math.min(...guestCounts);
      const max = Math.max(...guestCounts);
      const median = calculateMedian(guestCounts);
      const average = calculateAverage(guestCounts);
      const highest = dailyTotalsTemp.find((day) => day.total === max);
      const lowest = dailyTotalsTemp.find((day) => day.total === min);

      setStats({
        minGuests: min,
        maxGuests: max,
        medianGuests: median,
        averageGuests: average.toFixed(2),
        lowestDay: lowest ? lowest.date : null,
        highestDay: highest ? highest.date : null,
      });
    }
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
    <div className="week-report">
      {!reportGenerated && !loading && !autoGenerate && (
        <div
          className="generate-report-text"
          onClick={handleGenerateReport}
          style={{ color: 'var(--color-blue)', cursor: 'pointer' }}
        >
          Genereer rapport
        </div>
      )}

      {(reportGenerated || autoGenerate) && (
        <motion.div
          className="calendar-report-table"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="calendar-report-title">Weekrapport</div>
          <table>
            <thead>
              <tr>
                <th>Dag</th>
                <th>Ochtend</th>
                <th>Middag</th>
                <th>Avond</th>
                <th>Totaal</th>
              </tr>
            </thead>
            <tbody>
              
              {dailyTotals.map(({ date, shiftTotals, total }, index) => (
                <motion.tr key={index} variants={rowVariants}>
                  <td>{getDutchDayName(date)}</td>
                  <td>{shiftTotals[0]}</td>
                  <td>{shiftTotals[1]}</td>
                  <td>{shiftTotals[2]}</td>
                  <td>{total}</td>
                </motion.tr>
              ))}
			  <motion.tr variants={rowVariants} className='totals-styled'>
                <td>
                  <strong>Totaal</strong>
                </td>
                <td>{totalGuestsByShift[0]}</td>
                <td>{totalGuestsByShift[1]}</td>
                <td>{totalGuestsByShift[2]}</td>
                <td>{totalGuestsByShift.reduce((a, b) => a + b, 0)}</td>
              </motion.tr>
            </tbody>
          </table>

          {/* Statistical data */}
          <motion.div className="statistical-data" variants={containerVariants}>
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
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const statLabels = {
  minGuests: 'Minimaal aantal gasten',
  maxGuests: 'Maximaal aantal gasten',
  medianGuests: 'Mediaan aantal gasten',
  averageGuests: 'Gemiddeld aantal gasten',
  lowestDay: 'Laagste dag',
  highestDay: 'Hoogste dag',
};

export default WeekReport;
