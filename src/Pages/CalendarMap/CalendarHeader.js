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

  // Utility function to get the Monday of the week for a given date
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0); // Reset time to midnight
    return d;
  };

  // Utility function to get the first and last day of the month
  const getMonthStartEnd = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(currentDate));
  const [isViewOptionsOpen, setIsViewOptionsOpen] = useState(false);
  const viewOptionsRef = useRef(null);
  const viewButtonRef = useRef(null);
  const [weekOrMonthView, setWeekOrMonthView] = useState("month");
  const [{ start: monthStart, end: monthEnd }, setMonthRange] = useState(getMonthStartEnd(currentDate));

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

  useEffect(() => {
    if (weekOrMonthView === 'week') {
      setCurrentWeekStart(getMonday(currentDate));
    } else {
      setMonthRange(getMonthStartEnd(currentDate));
    }
  }, [currentDate, weekOrMonthView]);

  const getWeekTitle = () => {
    const start = new Date(currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End on Sunday

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = monthNames[start.getMonth()];
    const endMonth = monthNames[end.getMonth()];
    const year = start.getFullYear();

    if (start.getMonth() === end.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
  };

  const getMonthTitle = () => {
	const month = monthNames[monthStart.getMonth()];
	const year = monthStart.getFullYear();
  
	return `${month} ${year}`;
  };
  

  const handlePrev = () => {
    if (weekOrMonthView === 'week') {
      setCurrentWeekStart((prev) => {
        const newStart = new Date(prev);
        newStart.setDate(prev.getDate() - 7);
        return getMonday(newStart);
      });
    } else {
      onPrevMonth();
    }
  };

  const handleNext = () => {
    if (weekOrMonthView === 'week') {
      setCurrentWeekStart((prev) => {
        const newStart = new Date(prev);
        newStart.setDate(prev.getDate() + 7);
        return getMonday(newStart);
      });
    } else {
      onNextMonth();
    }
  };

  const handleViewOptionSelection = (option) => {
    setWeekOrMonthView(option);
    setIsViewOptionsOpen(false);
  };

  return (
    <div className="calendar-header">
		
		<div className='header-titles'>
      <button className="nav-button" onClick={handlePrev}>
        <FaChevronLeft size={24} />
      </button>
	  <button
        className="nav-button"
        onClick={handleNext}
        style={{ marginRight: '24px' }}
      >
        <FaChevronRight size={24} />
      </button>
      <div className="header-title-container">
        <h2>
          {weekOrMonthView === 'week'
            ? getWeekTitle()
            : getMonthTitle()}
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
              onClick={() => handleViewOptionSelection('month')}
            >
              Maand
            </div>
          </div>
        )}
      </div>
      
	  </div>

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
