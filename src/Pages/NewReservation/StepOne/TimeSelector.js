// src/components/NewReservation/TimeSelector.jsx

import React, { useState, useEffect } from 'react';
import './css/timeSelector.css'; // Create this CSS file for styling
import moment from 'moment-timezone';

const TimeSelector = ({ formData, handleChange, field, selectedDate }) => {
  const [availableTimes, setAvailableTimes] = useState({});
  const [expandedPeriod, setExpandedPeriod] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      // Generate available times based on the selected date
      generateAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const generateAvailableTimes = (date) => {
    // Example logic: Generate times for demonstration purposes
    // Replace this with actual API calls to fetch available times for the date

    // Let's assume the restaurant is open from 8 AM to 10 PM
    // Morning: 8 AM - 12 PM
    // Afternoon: 12 PM - 5 PM
    // Evening: 5 PM - 10 PM

    const times = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    const selectedMoment = moment(date).tz('Europe/Amsterdam').startOf('day');

    for (let hour = 8; hour <= 21; hour++) {
      const time = selectedMoment.clone().add(hour, 'hours');
      const timeString = time.format('HH:mm');

      // For demonstration, make times every hour
      // You can adjust the interval as needed

      // For example, exclude certain times
      if (hour !== 13 && hour !== 18) {
        if (hour >= 8 && hour < 12) {
          times.morning.push(timeString);
        } else if (hour >= 12 && hour < 17) {
          times.afternoon.push(timeString);
        } else if (hour >= 17 && hour <= 21) {
          times.evening.push(timeString);
        }
      }
    }

    setAvailableTimes(times);
  };

  const handlePeriodClick = (period) => {
    setExpandedPeriod((prev) => (prev === period ? null : period));
  };

  const handleTimeSelect = (time) => {
    handleChange({
      target: { name: field.id, value: time },
    });
  };

  if (!field) {
    return null; // Handle case when field is not provided
  }

  return (
    <div className="form-group">
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>

      {!selectedDate ? (
        <p className="info-text">Selecteer eerst een datum.</p>
      ) : (
        <div className="time-selector">
          {['morning', 'afternoon', 'evening'].map((period) => {
            // Determine if the period has available times
            const timesInPeriod = availableTimes[period];
            if (!timesInPeriod || timesInPeriod.length === 0) {
              return null; // Skip periods with no available times
            }

            // Map period to Dutch labels
            const periodLabels = {
              morning: 'Ochtend',
              afternoon: 'Middag',
              evening: 'Avond',
            };

            return (
              <div key={period} className="time-period">
                <div
                  className="time-period-header"
                  onClick={() => handlePeriodClick(period)}
                >
                  <span>{periodLabels[period]}</span>
                  <span className="arrow">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      style={{
                        transform:
                          expandedPeriod === period
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
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
                {expandedPeriod === period && (
                  <div className="time-options">
                    {timesInPeriod.map((time) => (
                      <div
                        key={time}
                        className={`time-option ${
                          formData[field.id] === time ? 'selected' : ''
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
