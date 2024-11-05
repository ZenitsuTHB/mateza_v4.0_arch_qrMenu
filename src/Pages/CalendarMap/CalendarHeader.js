// CalendarHeader.js

import React from 'react';
import './css/calendarHeader.css';
import { FaChevronLeft, FaChevronRight, FaChartBar } from 'react-icons/fa';
import ShiftSelector from './ShiftSelector';
import ViewModeSelector from './ViewModeSelector';

const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  selectedShift,
  setSelectedShift,
  selectedViewMode,
  setSelectedViewMode,
  isChartView,
  toggleChartView,
}) => {
  const monthNames = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const isAtCurrentMonth =
    currentDate.getFullYear() === new Date().getFullYear() &&
    currentDate.getMonth() === new Date().getMonth();

  return (
    <div className="calendar-header">
      {!(selectedViewMode === 'Voorspelling' && isAtCurrentMonth) ? (
        <button className="nav-button" onClick={onPrevMonth}>
          <FaChevronLeft size={24} />
        </button>
      ) : (
        <div style={{ width: '24px' }}></div>
      )}
      <h2>{month} {year}</h2>
      <div className="header-buttons">
        <ShiftSelector
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
        />
        <button
          onClick={toggleChartView}
          className="standard-button blue chart-toggle-button"
        >
          <FaChartBar size={16} />
        </button>
        <ViewModeSelector
          selectedViewMode={selectedViewMode}
          setSelectedViewMode={setSelectedViewMode}
        />
        <button className="nav-button" onClick={onNextMonth}>
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
