// CalendarComponent.js

import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import BarChartView from './BarChartView';
import ReservationDetailsModal from './ReservationDetailsModal';
import './css/calendarComponent.css';
import { withHeader } from '../../Components/Structural/Header';
import useReservations from './Hooks/useReservations';
import usePredictions from './Hooks/usePredictions';
import WeekReport from './WeekReport';
import MonthReport from './MonthReport'; // Import MonthReport
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard'; // Import ModalWithoutTabs
import { maxCapacity } from './reservationData'; // Adjust the path as necessary

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateReservations, setSelectedDateReservations] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Dag');
  const [selectedViewMode, setSelectedViewMode] = useState('Algemeen');
  const [isChartView, setIsChartView] = useState(false);
  const [weekOrMonthView, setWeekOrMonthView] = useState('month');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // State for report modal

  const reservationsByDate = useReservations();
  const predictionsByDate = usePredictions(
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode
  );

  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0); // Reset time to midnight
    return d;
  };

  // Generate dates based on the view
  const generateDates = () => {
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

    return dates;
  };

  const dates = generateDates(); // Get dates

  const handlePrev = () => {
    if (weekOrMonthView === 'week') {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7);
        return newDate;
      });
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    }
  };

  const handleNext = () => {
    if (weekOrMonthView === 'week') {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
      });
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    }
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

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  return (
    <div className="calendar-component">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
        selectedViewMode={selectedViewMode}
        setSelectedViewMode={setSelectedViewMode}
        isChartView={isChartView}
        toggleChartView={toggleChartView}
        weekOrMonthView={weekOrMonthView}
        setWeekOrMonthView={setWeekOrMonthView}
        onGenerateReport={openReportModal} // Pass the function
      />
      {isChartView ? (
        <BarChartView
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          weekOrMonthView={weekOrMonthView} // Pass this prop
          maxCapacity={maxCapacity} // Pass maxCapacity if needed
        />
      ) : (
        <CalendarGrid
          dates={dates} // Pass dates to CalendarGrid
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          onDateClick={handleDateClick}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          weekOrMonthView={weekOrMonthView}
        />
      )}
      {selectedDateReservations && (
        <ReservationDetailsModal
          reservationsData={selectedDateReservations}
          onClose={handleCloseModal}
        />
      )}

      {isReportModalOpen && (
        <ModalWithoutTabs
          content={
            weekOrMonthView === 'week' ? (
              <WeekReport
                dates={dates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
                autoGenerate={true} // Automatically generate the report
              />
            ) : (
              <MonthReport
                dates={dates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
                autoGenerate={true} // Automatically generate the report
              />
            )
          }
          onClose={closeReportModal}
        />
      )}
    </div>
  );
};

export default withHeader(CalendarComponent);
