// /src/Components/Calendar/CalendarComponent.js

import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import BarChartView from './BarChartView';
import ReservationDetailsModal from './ReservationDetailsModal';
import './css/calendarComponent.css';
import { withHeader } from '../../Components/Structural/Header';
import useReservations from './Hooks/useReservations';
import usePredictions from './Hooks/usePredictions';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateReservations, setSelectedDateReservations] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Hele Dag');
  const [selectedViewMode, setSelectedViewMode] = useState('Algemeen');
  const [isChartView, setIsChartView] = useState(false);

  const reservationsByDate = useReservations();
  const predictionsByDate = usePredictions(
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
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
