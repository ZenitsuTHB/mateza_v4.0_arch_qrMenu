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
import MonthReport from './MonthReport';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard';
import { maxCapacity as initialMaxCapacity } from './reservationData';
import BezettingspercentageForm from './BezettingspercentageForm';
import useDates from './Hooks/useDates';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateReservations, setSelectedDateReservations] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Dag');
  const [selectedViewMode, setSelectedViewMode] = useState('Algemeen');
  const [isChartView, setIsChartView] = useState(false);
  const [weekOrMonthView, setWeekOrMonthView] = useState('month');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [maxCapacityInput, setMaxCapacityInput] = useState(initialMaxCapacity);
  const [gemiddeldeDuurCouvertInput, setGemiddeldeDuurCouvertInput] = useState('');

  const reservationsByDate = useReservations();
  const predictionsByDate = usePredictions(
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode
  );

  const dates = useDates(currentDate, weekOrMonthView);

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
    setSelectedDateReservations({
      date: dateString,
      reservations: reservationsByDate[dateString] || [],
    });
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

  const handleMaxCapacityChange = (e) => {
    setMaxCapacityInput(e.target.value);
  };

  const handleGemiddeldeDuurCouvertChange = (e) => {
    setGemiddeldeDuurCouvertInput(e.target.value);
  };

  const handleHerberekenen = () => {
    if (maxCapacityInput < 1 || gemiddeldeDuurCouvertInput < 1) {
      alert('Voer geldige positieve nummers in voor capaciteit en duur.');
      return;
    }

    console.log('Herberekenen clicked');
    console.log('Max Capacity:', maxCapacityInput);
    console.log('Gemiddelde Duur Couvert:', gemiddeldeDuurCouvertInput);

    alert('Herberekeningen zijn succesvol uitgevoerd.');
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
        onGenerateReport={openReportModal}
      />

      {selectedViewMode === 'Bezettingspercentage' && (
        <BezettingspercentageForm
          maxCapacity={maxCapacityInput}
          gemiddeldeDuurCouvert={gemiddeldeDuurCouvertInput}
          onMaxCapacityChange={handleMaxCapacityChange}
          onGemiddeldeDuurCouvertChange={handleGemiddeldeDuurCouvertChange}
          onHerberekenen={handleHerberekenen}
        />
      )}

      {isChartView ? (
        <BarChartView
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          weekOrMonthView={weekOrMonthView}
          maxCapacity={maxCapacityInput}
        />
      ) : (
        <CalendarGrid
          dates={dates}
          currentDate={currentDate}
          reservationsByDate={reservationsByDate}
          onDateClick={handleDateClick}
          selectedShift={selectedShift}
          selectedViewMode={selectedViewMode}
          predictionsByDate={predictionsByDate}
          weekOrMonthView={weekOrMonthView}
          maxCapacity={maxCapacityInput}
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
                autoGenerate={true}
              />
            ) : (
              <MonthReport
                dates={dates}
                reservationsByDate={reservationsByDate}
                selectedShift={selectedShift}
                autoGenerate={true}
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
