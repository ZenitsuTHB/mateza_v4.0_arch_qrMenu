// CalendarHeader.js

import React, { useState, useRef, useEffect } from 'react';
import './css/calendarHeader.css';
import { FaChevronLeft, FaChevronRight, FaChartBar, FaChevronDown } from 'react-icons/fa';
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

  // New state for view options dropdown
  const [isViewOptionsOpen, setIsViewOptionsOpen] = useState(false);
  const viewOptionsRef = useRef(null);
  const viewButtonRef = useRef(null);

  // Handle Click Outside for View Options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        viewOptionsRef.current &&
        !viewOptionsRef.current.contains(event.target) &&
        viewButtonRef.current &&
        !viewButtonRef.current.contains(event.target)
      ) {
        setIsViewOptionsOpen(false);
      }
    };

    if (isViewOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isViewOptionsOpen]);

  // Function to handle view option selection
  const handleViewOptionSelection = (option) => {
    setIsViewOptionsOpen(false);
  };

  return (
    <div className="calendar-header">
      {!(selectedViewMode === 'Voorspelling' && isAtCurrentMonth) ? (
        <button className="nav-button" onClick={onPrevMonth}>
          <FaChevronLeft size={24} />
        </button>
      ) : (
        <div style={{ width: '24px' }}></div>
      )}
      <div className="header-title-container">
        <h2>
          {month} {year}
        </h2>
        <button
          className="view-options-button"
          onClick={() => setIsViewOptionsOpen(!isViewOptionsOpen)}
          ref={viewButtonRef}
          aria-label="Toggle view options"
        >
          <FaChevronDown size={16} />
        </button>
        {isViewOptionsOpen && (
          <div className="view-options-container" ref={viewOptionsRef}>
            <div
              className="view-option"
              onClick={() => handleViewOptionSelection('week')}
            >
              Week
            </div>
			<div
              className="view-option"
              onClick={() => handleViewOptionSelection('maand')}
            >
              Maand
            </div>
          </div>
        )}
      </div>
      <button
        className="nav-button"
        onClick={onNextMonth}
        style={{ marginRight: '24px' }}
      >
        <FaChevronRight size={24} />
      </button>

      <div className="header-buttons">
        <button
          onClick={toggleChartView}
          className="standard-button blue chart-toggle-button"
          title={isChartView ? 'Terug naar Kalender' : 'Bekijk Bar Chart'}
        >
          <FaChartBar size={16} />
        </button>

        <ShiftSelector
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
        />
        <ViewModeSelector
          selectedViewMode={selectedViewMode}
          setSelectedViewMode={setSelectedViewMode}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
