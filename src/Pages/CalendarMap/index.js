// CalendarComponent.js

import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import BarChartView from './BarChartView';
import ReservationDetailsModal from './ReservationDetailsModal';
import reservations, { maxCapacity } from './reservationData';
import './css/calendarComponent.css';
import { withHeader } from '../../Components/Structural/Header';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservationsByDate, setReservationsByDate] = useState({});
  const [selectedDateReservations, setSelectedDateReservations] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Hele Dag');
  const [selectedViewMode, setSelectedViewMode] = useState('Normaal');
  const [isChartView, setIsChartView] = useState(false);
  const [predictionsByDate, setPredictionsByDate] = useState({});

  // Parameters for prediction algorithm weights
  const WEIGHT_MEDIAN14 = 0;
  const WEIGHT_MEDIAN20 = 0;
  const WEIGHT_AVERAGE90 = 1;
  const WEIGHT_CURRENT_RESERVATIONS = 0.2;
  const MULTIPLIER_BASE_PREDICTION = 2;

  useEffect(() => {
    // Organize reservations by date
    const resByDate = {};
    reservations.forEach((reservation) => {
      const date = reservation.date;
      if (!resByDate[date]) {
        resByDate[date] = [];
      }
      resByDate[date].push(reservation);
    });
    setReservationsByDate(resByDate);
  }, []);

  useEffect(() => {
    if (selectedViewMode === 'Voorspelling') {
      calculatePredictions();
    } else {
      setPredictionsByDate({});
    }
  }, [currentDate, reservationsByDate, selectedShift, selectedViewMode]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (reservationsByDate[dateString]) {
      setSelectedDateReservations({
        date: dateString,
        reservations: reservationsByDate[dateString],
      });
    } else {
      setSelectedDateReservations({
        date: dateString,
        reservations: [],
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedDateReservations(null);
  };

  const toggleChartView = () => {
    setIsChartView(!isChartView);
  };

  const calculatePredictions = () => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    const datesArray = [];
    for (let i = 1; i <= numDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      datesArray.push(date);
    }

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
      setPredictionsByDate({});
      return;
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
      const past90DaysSameDay = extendedHistoricalData.filter((data, idx) => {
        return (
          data.date.getDay() === currentDate.getDay() &&
          idx < i &&
          (currentDate - data.date) / (1000 * 60 * 60 * 24) <= 90
        );
      });

      // Calculate medians and average
      const median = (values) => {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const half = Math.floor(sorted.length / 2);
        if (sorted.length % 2) return sorted[half];
        return (sorted[half - 1] + sorted[half]) / 2.0;
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

      // Update extendedHistoricalData with predicted value
      extendedHistoricalData.push({ date: currentDate, totalGuests: prediction });
    }

    setPredictionsByDate(predictions);
  };

  return (
    <div className="calendar-component">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
        selectedViewMode={selectedViewMode}
        setSelectedViewMode={setSelectedViewMode}
        isChartView={isChartView}
        toggleChartView={toggleChartView}
      />
      {isChartView ? (
        <BarChartView
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          maxCapacity={maxCapacity}
          predictionsByDate={predictionsByDate}
        />
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          onDateClick={handleDateClick}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
        />
      )}
      {selectedDateReservations && (
        <ReservationDetailsModal
          reservationsData={selectedDateReservations}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default withHeader(CalendarComponent);
