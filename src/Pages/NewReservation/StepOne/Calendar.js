
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import 'moment/locale/nl';
import './css/calendar.css';

moment.locale('nl');

const Calendar = ({ availableDates, selectedDate, onSelectDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const calendarRef = useRef(null);

  const maxDate = moment().tz('Europe/Amsterdam').add(1, 'year').endOf('day');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    let firstWeekStart = today.clone().startOf('isoWeek');
    while (isWeekInPast(firstWeekStart)) {
      firstWeekStart.add(1, 'week');
    }
    setStartDate(firstWeekStart);
  }, []);

  const isWeekInPast = (weekStartDate) => {
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    const weekEndDate = weekStartDate.clone().add(6, 'days').endOf('day');
    return weekEndDate.isBefore(today);
  };

  const generateCalendarDays = (startDate) => {
    const days = [];
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    const twoWeeksFromStart = startDate.clone().add(13, 'days');

    let date = startDate.clone();
    while (date.isSameOrBefore(twoWeeksFromStart, 'day')) {
      days.push({
        date: date.clone(),
        isPast: date.isBefore(today, 'day'),
        isFuture: date.isAfter(maxDate, 'day'),
        isAvailable: availableDates.includes(date.format('YYYY-MM-DD')),
      });
      date.add(1, 'day');
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day.isAvailable && !day.isPast && !day.isFuture) {
      onSelectDate(day.date.toDate());
      setIsExpanded(false);
    }
  };

  const handlePrevWeek = () => {
    const newStartDate = startDate.clone().subtract(1, 'week');
    if (isWeekInPast(newStartDate)) {
      return;
    }
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = startDate.clone().add(1, 'week');
    setStartDate(newStartDate);
  };

  const isSameDay = (date1, date2) => {
    return date1.isSame(date2, 'day');
  };

  const formatDisplayDate = () => {
    return selectedDate
      ? moment(selectedDate)
          .tz('Europe/Amsterdam')
          .format('DD MMMM YYYY')
      : 'Selecteer een datum';
  };

  const days = startDate ? generateCalendarDays(startDate) : [];

  return (
    <div className="calendar-container" ref={calendarRef}>
      <div
        className="calendar-display"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{formatDisplayDate()}</span>
        <span className="arrow">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path
              d="M7 10l5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
      </div>
      {isExpanded && (
        <div className="calendar">
          <div className="calendar-header">
            <button type="button" onClick={handlePrevWeek}>
              &lt;
            </button>
            <span>
              {startDate.format('DD MMM')} -{' '}
              {startDate.clone().add(13, 'days').format('DD MMM YYYY')}
            </span>
            <button type="button" onClick={handleNextWeek}>
              &gt;
            </button>
          </div>
          <div className="calendar-weeks-wrapper">
            <table className="calendar-table">
              <thead>
                <tr>
                  {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 2 }).map((_, weekIndex) => (
                  <tr key={weekIndex}>
                    {days
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map((dayObj, index) => {
                        const isSelected =
                          selectedDate &&
                          isSameDay(
                            dayObj.date,
                            moment(selectedDate).tz('Europe/Amsterdam')
                          );
                        const classNames = [];
                        if (dayObj.isPast || dayObj.isFuture) {
                          classNames.push('gray-out');
                        } else if (dayObj.isAvailable) {
                          classNames.push('available');
                        } else {
                          classNames.push('unavailable');
                        }
                        if (isSelected) {
                          classNames.push('selected');
                        }

                        return (
                          <td
                            key={index}
                            className={classNames.join(' ')}
                            onClick={() => handleDateClick(dayObj)}
                            style={{ '--animation-order': index + weekIndex * 7 }}
                          >
                            <div className="day-square">
                              {dayObj.date.date()}
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
