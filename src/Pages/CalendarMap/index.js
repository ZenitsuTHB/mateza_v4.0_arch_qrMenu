// CalendarComponent.js

import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import BarChartView from './BarChartView'; // Import the new BarChartView component
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
  const [isChartView, setIsChartView] = useState(false); // State to toggle between calendar and chart view
  const [predictionsByDate, setPredictionsByDate] = useState({}); // State for predictions

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
      // Optionally, handle dates with no reservations
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
        toggleChartView={toggleChartView} // Pass the toggle function to the header
      />
      {isChartView ? (
        <BarChartView
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          maxCapacity={maxCapacity}
          predictionsByDate={predictionsByDate}
          setPredictionsByDate={setPredictionsByDate} // Pass predictions state
        />
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          onDateClick={handleDateClick}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          setPredictionsByDate={setPredictionsByDate} // Pass predictions state
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
