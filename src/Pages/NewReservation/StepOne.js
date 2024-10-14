// src/components/NewReservation/StepOne.jsx

import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Calendar from './Calendar';

const StepOne = ({
  title,
  formData,
  handleChange,
  setCurrentStep,
  fields,
}) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    // Fetch available dates from your API or define them statically
    // Ensure dates are in 'YYYY-MM-DD' format and consider CEST timezone

    // Example of generating dates for the next year
    const today = moment().tz('Europe/Amsterdam').startOf('day');
    const oneYearLater = today.clone().add(1, 'year');
    const dates = [];

    let date = today.clone();
    while (date.isSameOrBefore(oneYearLater, 'day')) {
      // For demonstration, make weekdays available
      if (date.day() !== 0 && date.day() !== 6) {
        dates.push(date.format('YYYY-MM-DD'));
      }
      date.add(1, 'day');
    }

    setAvailableDates(dates);
  }, []);

  const handleDateSelect = (date) => {
    // Convert selected date to CEST timezone
    const dateInCEST = moment(date).tz('Europe/Amsterdam');
    handleChange({
      target: { name: 'datum', value: dateInCEST.format('YYYY-MM-DD') },
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  return (
    <form className="reservation-form" onSubmit={handleNext}>
      <h2>{title}</h2>
      <h3 className="subtitle">Stap 1/3</h3>

      {/* Calendar component for date selection */}
      <div className="form-group">
        <label htmlFor="datum">
          Datum<span className="required">*</span>
        </label>
        <Calendar
          availableDates={availableDates}
          selectedDate={
            formData.datum
              ? moment(formData.datum, 'YYYY-MM-DD')
                  .tz('Europe/Amsterdam')
                  .toDate()
              : null
          }
          onSelectDate={handleDateSelect}
        />
      </div>

      {/* Render other form fields */}
      {fields
        .filter(
          (field) => field.id === 'tijd' || field.id === 'aantalPersonen'
        )
        .map((field) => (
          <div className="form-group" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder || ''}
              ></textarea>
            ) : (
              <input
                type={field.type === 'input' ? 'text' : field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder || ''}
                min={field.min || undefined}
              />
            )}
          </div>
        ))}

      <button type="submit" className="submit-button">
        Volgende
      </button>
    </form>
  );
};

export default StepOne;
