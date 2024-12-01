// src/Pages/Uitzonderingen/ExceptionCalendar.js

import React, { useState, useEffect } from 'react';
import './css/exceptions.css';

const ExceptionCalendar = ({ exceptions, onDateClick, activeTab }) => {
  const [calendarData, setCalendarData] = useState([]);

  const daysOfWeekShort = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const months = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
  ];

  useEffect(() => {
    generateCalendar();
  }, [exceptions, activeTab]);

  const generateCalendar = () => {
    const today = new Date();
    let monthToDisplay = today.getMonth();
    let yearToDisplay = today.getFullYear();

    if (activeTab === 'next') {
      monthToDisplay = (monthToDisplay + 1) % 12;
      if (monthToDisplay === 0) yearToDisplay += 1;
    } else if (activeTab === 'all') {
      // For 'all', display the current month
    }

    const firstDayOfMonth = new Date(yearToDisplay, monthToDisplay, 1);
    const daysInMonth = new Date(yearToDisplay, monthToDisplay + 1, 0).getDate();

    const startDay = firstDayOfMonth.getDay() || 7; // Adjust for Sunday as 7
    const weeks = [];
    let dayCounter = 1 - (startDay - 1);

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 1; day <= 7; day++) {
        if (dayCounter > 0 && dayCounter <= daysInMonth) {
          const dateObj = new Date(yearToDisplay, monthToDisplay, dayCounter);
          const dateStr = dateObj.toISOString().split('T')[0];

          // Determine the exceptions on this date
          const dateExceptions = exceptions.filter((exception) => {
            const startDate = new Date(exception.startDate);
            const endDate = new Date(exception.endDate);
            return dateObj >= startDate && dateObj <= endDate;
          });

          // Determine the highest priority exception type
          let exceptionType = null;
          if (dateExceptions.length > 0) {
            const typePriority = ['Opening', 'Uitzondering', 'Sluitingsdag'];
            for (const type of typePriority) {
              if (dateExceptions.some((ex) => ex.type === type)) {
                exceptionType = type;
                break;
              }
            }
          }

          days.push(
            <td key={dayCounter} className="exceptions-page__calendar-cell">
              <div
                className={`exceptions-page__calendar-day ${
                  exceptionType ? `tag-${exceptionType.toLowerCase()}` : ''
                }`}
                onClick={() => onDateClick(dateStr)}
              >
                {dayCounter}
              </div>
            </td>
          );
        } else {
          days.push(<td key={`${week}-${day}`} className="exceptions-page__calendar-cell empty"></td>);
        }
        dayCounter++;
      }
      weeks.push(<tr key={week}>{days}</tr>);
    }

    setCalendarData({
      weeks,
      month: months[monthToDisplay],
      year: yearToDisplay,
    });
  };

  return (
    <div className="exceptions-page__calendar">
      <h3>
        {calendarData.month} {calendarData.year}
      </h3>
      <table className="exceptions-page__calendar-table">
        <thead>
          <tr>
            {daysOfWeekShort.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{calendarData.weeks}</tbody>
      </table>
      <div className="exceptions-page__calendar-legend">
        <span>
          <span className="exceptions-page__calendar-legend-box tag-opening"></span> Opening
        </span>
        <span>
          <span className="exceptions-page__calendar-legend-box tag-uitzondering"></span> Uitzondering
        </span>
        <span>
          <span className="exceptions-page__calendar-legend-box tag-sluitingsdag"></span> Sluitingsdag
        </span>
      </div>
    </div>
  );
};

export default ExceptionCalendar;
