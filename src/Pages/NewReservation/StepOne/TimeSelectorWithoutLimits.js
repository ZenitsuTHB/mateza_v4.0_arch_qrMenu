// src/Pages/NewReservation/TimeSelectorWithoutLimits.jsx

import React, { useState, useEffect, useRef } from 'react';
import './css/timeSelector.css';
import moment from 'moment-timezone';

const TimeSelectorWithoutLimits = ({
  guests, 
  formData,
  handleChange,
  field,
  selectedDate,
  expanded,
  setCurrentExpandedField,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded || false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const timeSelectorRef = useRef(null);

  useEffect(() => {
    if (selectedDate) {
      // In 'zonder_regels' mode, generate all times without constraints
      const allTimes = [];
      const startOfDay = moment(selectedDate).startOf('day').hour(0).minute(0);
      const endOfDay = moment(selectedDate).endOf('day').hour(23).minute(59);
      let currentTime = startOfDay.clone();

      while (currentTime.isBefore(endOfDay)) {
        allTimes.push(currentTime.format('HH:mm'));
        currentTime.add(30, 'minutes'); // Assuming 30-minute intervals
      }

      setAvailableTimes(allTimes);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]);

  const handleTimeSelect = (timeValue) => {
    handleChange({
      target: { name: field.id, value: timeValue },
    });
    setIsExpanded(false);
    if (setCurrentExpandedField) {
      setCurrentExpandedField(null);
    }
  };

  const formatDisplayTime = () => {
    if (formData[field.id]) {
      const selected = availableTimes.find((time) => time === formData[field.id]);
      return selected ? selected : 'Selecteer een tijd';
    }
    return 'Selecteer een tijd';
  };

  if (!field) {
    return null;
  }

  return (
    <div className="form-group time-selector-container" ref={timeSelectorRef}>

      {!selectedDate ? (
        <p className="info-text">Selecteer eerst een datum.</p>
      ) : (
        <>
          <div
            className="time-display"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded && setCurrentExpandedField) {
                setCurrentExpandedField('time');
              }
            }}
          >
            <span>{formatDisplayTime()}</span>
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
            <div className="time-selector">
              {availableTimes.length === 0 ? (
                <div className="no-times">Geen beschikbare tijden.</div>
              ) : (
                <div className="time-options">
                  {availableTimes.map((time, index) => (
                    <div
                      key={index}
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
          )}
        </>
      )}
    </div>
  );
};

export default TimeSelectorWithoutLimits;
