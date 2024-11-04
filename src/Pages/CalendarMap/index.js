// CalendarComponent.js

import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import ReservationDetailsModal from './ReservationDetailsModal';
import reservations from './reservationData';
import './css/calendarComponent.css';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservationsByDate, setReservationsByDate] = useState({});
  const [selectedDateReservations, setSelectedDateReservations] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Volledige Dag'); // Default to 'Volledige Dag'
  const [selectedViewMode, setSelectedViewMode] = useState('Normaal'); // 'Normaal', 'Heatmap', 'Bezettingsgraad'

  useEffect(() => {
    // Organize reservations by date
    const resByDate = {};
    reservations.forEach(reservation => {
      const date = reservation.date;
      if (!resByDate[date]) {
        resByDate[date] = [];
      }
      resByDate[date].push(reservation);
    });
    setReservationsByDate(resByDate);
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() -1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() +1, 1));
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (reservationsByDate[dateString]) {
      setSelectedDateReservations({
        date: dateString,
        reservations: reservationsByDate[dateString],
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedDateReservations(null);
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
      />
      <CalendarGrid
        currentDate={currentDate}
        reservationsByDate={reservationsByDate}
        onDateClick={handleDateClick}
        selectedShift={selectedShift}
        selectedViewMode={selectedViewMode}
      />
      {selectedDateReservations && (
        <ReservationDetailsModal
          reservationsData={selectedDateReservations}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
