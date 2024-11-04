// CalendarHeader.js

import React from 'react';
import './css/calendarHeader.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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

  // Determine if we are at the current month and in 'Voorspelling' view
  const today = new Date();
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  return (
    <div className="calendar-header">
      {!(selectedViewMode === 'Voorspelling' && isCurrentMonth) && (
        <button className="nav-button" onClick={onPrevMonth}>
          <FaChevronLeft size={24} />
        </button>
      )}
      <h2>{month} {year}</h2>
      <div className="header-buttons">
        <ShiftSelector
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
        />
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
