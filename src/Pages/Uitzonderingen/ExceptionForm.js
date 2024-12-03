// src/Pages/Uitzonderingen/ExceptionForm.js

import React, { useState, useEffect, useRef } from 'react';
import './css/exceptions.css';
import { shifts } from './constants';

const ExceptionForm = ({ api, triggerNotification, refreshExceptions }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    timeframe: '',
    date: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    maxSeats: '',
    daysOfWeek: [],
  });

  const daysOfWeekMap = {
    maandag: 'Monday',
    dinsdag: 'Tuesday',
    woensdag: 'Wednesday',
    donderdag: 'Thursday',
    vrijdag: 'Friday',
    zaterdag: 'Saturday',
    zondag: 'Sunday',
  };

  const [errors, setErrors] = useState({});
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Focus shift when start date is selected
  useEffect(() => {
    if (formData.startDate && !formData.endDate && endDateRef.current) {
      endDateRef.current.focus();
      // Animation to guide user
      endDateRef.current.classList.add('highlight-animation');
      setTimeout(() => {
        endDateRef.current.classList.remove('highlight-animation');
      }, 2000);
    }
  }, [formData.startDate]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    if (inputType === 'checkbox' && name === 'daysOfWeek') {
      const day = value;
      setFormData((prevFormData) => {
        let daysOfWeek = [...prevFormData.daysOfWeek];
        if (checked) {
          daysOfWeek.push(day);
        } else {
          daysOfWeek = daysOfWeek.filter((d) => d !== day);
        }
        return { ...prevFormData, daysOfWeek };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  // Validation helper functions
  const isDateInPast = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    // Adjust for CEST timezone if necessary
    return date < now;
  };

  const isStartDateAfterEndDate = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    return startDate > endDate;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Titel is verplicht.';
    if (!formData.type) validationErrors.type = 'Type is verplicht.';
    if (formData.type !== 'Sluitingsdag' && formData.type !== 'Sluitingsdagen' && !formData.timeframe)
      validationErrors.timeframe = 'Toepassing is verplicht.';

    if (formData.type === 'Sluitingsdag' && !formData.date)
      validationErrors.date = 'Datum is verplicht.';
    if (formData.type === 'Sluitingsdagen' && !formData.startDate)
      validationErrors.startDate = 'Startdatum is verplicht.';
    if (formData.type === 'Sluitingsdagen' && !formData.endDate)
      validationErrors.endDate = 'Einddatum is verplicht.';

    if (
      (formData.type === 'Opening' ||
        formData.type === 'Uitzondering' ||
        formData.type === 'Sluiting') &&
      !formData.startDate
    )
      validationErrors.startDate = 'Startdatum is verplicht.';
    if (
      (formData.type === 'Opening' ||
        formData.type === 'Uitzondering' ||
        formData.type === 'Sluiting') &&
      !formData.endDate
    )
      validationErrors.endDate = 'Einddatum is verplicht.';
    if (
      (formData.type === 'Opening' || formData.type === 'Uitzondering') &&
      !formData.startHour
    )
      validationErrors.startHour = 'Startuur is verplicht.';
    if (
      (formData.type === 'Opening' || formData.type === 'Uitzondering') &&
      !formData.endHour
    )
      validationErrors.endHour = 'Einduur is verplicht.';
    if (
      (formData.type === 'Opening' || formData.type === 'Uitzondering') &&
      !formData.maxSeats
    )
      validationErrors.maxSeats = 'Max. Zitplaatsen is verplicht.';

    if (
      formData.daysOfWeek.length === 0 &&
      formData.type !== '' &&
      formData.type !== 'Sluitingsdag'
    )
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    // Additional date validations
    if (formData.startDate && isDateInPast(formData.startDate))
      validationErrors.startDate = 'Startdatum mag niet in het verleden liggen.';
    if (formData.endDate && isDateInPast(formData.endDate))
      validationErrors.endDate = 'Einddatum mag niet in het verleden liggen.';
    if (
      formData.startDate &&
      formData.endDate &&
      isStartDateAfterEndDate(formData.startDate, formData.endDate)
    ) {
      validationErrors.startDate = 'Startdatum mag niet na de einddatum liggen.';
      validationErrors.endDate = 'Einddatum mag niet voor de startdatum liggen.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload
    let payload = {
      title: formData.title,
      type: ['Sluitingsdag', 'Sluitingsdagen'].includes(formData.type)
        ? 'Sluiting'
        : formData.type,
      timeframe:
        formData.type === 'Sluitingsdag' || formData.type === 'Sluitingsdagen'
          ? 'Volledige Dag'
          : formData.timeframe,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startHour: formData.startHour,
      endHour: formData.endHour,
      maxSeats: formData.maxSeats,
      daysOfWeek: formData.daysOfWeek,
    };

    // Handle Sluitingsdag (single date)
    if (formData.type === 'Sluitingsdag') {
      payload.startDate = formData.date;
      payload.endDate = formData.date;
      payload.daysOfWeek = []; // Clear daysOfWeek for Sluitingsdag
    }

    // Remove daysOfWeek for Sluitingsdag
    if (formData.type === 'Sluitingsdag') {
      delete payload.daysOfWeek;
    }

    payload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value != null && value !== '')
  );

    try {
      const response = await api.post(`${window.baseDomain}api/exceptions`, payload);
      if (response) {
        setFormData({
          title: '',
          type: '',
          timeframe: '',
          date: '',
          startDate: '',
          endDate: '',
          startHour: '',
          endHour: '',
          maxSeats: '',
          daysOfWeek: [],
        });
        setErrors({});
        triggerNotification('Uitzondering succesvol toegevoegd', 'success');
        refreshExceptions();
      } else {
        triggerNotification('Fout bij het toevoegen van de uitzondering', 'error');
      }
    } catch (error) {
      console.error('Error adding exception:', error);
      triggerNotification('Fout bij het toevoegen van de uitzondering', 'error');
    }
  };

  // Generate time options based on 'Toepassing'
  const getTimeOptions = (shift) => {
    const options = [];
    const startTime = shifts[shift].start;
    const endTime = shifts[shift].end;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTimeObj = new Date();
    endTimeObj.setHours(endHour, endMinute, 0, 0);

    while (currentTime <= endTimeObj) {
      const timeStr = currentTime.toTimeString().substring(0, 5);
      options.push(timeStr);
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return options;
  };

  return (
    <form className="exceptions-page__form" onSubmit={handleSubmit}>
      <div className="exceptions-page__form-group">
        <label>Titel</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titel"
          className="exceptions-page__input"
        />
        {errors.title && <p className="exceptions-page__error">{errors.title}</p>}
      </div>

      <div className="exceptions-page__form-group">
        <label>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="exceptions-page__select"
        >
          <option value="">Selecteer Type</option>
          <option value="Opening">Opening</option>
          <option value="Sluiting">Sluiting</option>
          <option value="Sluitingsdag">Sluitingsdag</option>
          <option value="Sluitingsdagen">Sluitingsdagen</option>
          <option value="Uitzondering">Uitzondering</option>
        </select>
        {errors.type && <p className="exceptions-page__error">{errors.type}</p>}
      </div>

      {formData.type && formData.type !== 'Sluitingsdag' && formData.type !== 'Sluitingsdagen' && (
        <div className="exceptions-page__form-group">
          <label>Toepassing</label>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="exceptions-page__select"
          >
            <option value="">Selecteer Toepassing</option>
            <option value="breakfast">Ochtend</option>
            <option value="lunch">Middag</option>
            <option value="dinner">Avond</option>
          </select>
          {errors.timeframe && <p className="exceptions-page__error">{errors.timeframe}</p>}
        </div>
      )}

      {formData.type === 'Sluitingsdag' && (
        <div className="exceptions-page__form-group">
          <label>Datum</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="exceptions-page__input"
            min={getTodayDateString()}
          />
          {errors.date && <p className="exceptions-page__error">{errors.date}</p>}
        </div>
      )}

      {formData.type === 'Sluitingsdagen' && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Datum</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={startDateRef}
              min={getTodayDateString()}
            />
            {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Datum</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={endDateRef}
              min={getTodayDateString()}
            />
            {errors.endDate && <p className="exceptions-page__error">{errors.endDate}</p>}
          </div>
        </>
      )}

      {(formData.type === 'Opening' ||
        formData.type === 'Uitzondering' ||
        formData.type === 'Sluiting') && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Datum</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={startDateRef}
              min={getTodayDateString()}
            />
            {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Datum</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="exceptions-page__input"
              ref={endDateRef}
              min={getTodayDateString()}
            />
            {errors.endDate && <p className="exceptions-page__error">{errors.endDate}</p>}
          </div>
        </>
      )}

      {(formData.type === 'Opening' || formData.type === 'Uitzondering') && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Uur</label>
            <select
              name="startHour"
              value={formData.startHour}
              onChange={handleChange}
              className="exceptions-page__select"
            >
              <option value="">Selecteer Start Uur</option>
              {formData.timeframe &&
                getTimeOptions(formData.timeframe).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </select>
            {errors.startHour && <p className="exceptions-page__error">{errors.startHour}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Uur</label>
            <select
              name="endHour"
              value={formData.endHour}
              onChange={handleChange}
              className="exceptions-page__select"
            >
              <option value="">Selecteer Eind Uur</option>
              {formData.timeframe &&
                getTimeOptions(formData.timeframe).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </select>
            {errors.endHour && <p className="exceptions-page__error">{errors.endHour}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Max. Zitplaatsen</label>
            <input
              type="number"
              name="maxSeats"
              value={formData.maxSeats}
              onChange={handleChange}
              className="exceptions-page__input"
            />
            {errors.maxSeats && <p className="exceptions-page__error">{errors.maxSeats}</p>}
          </div>
        </>
      )}

      {/* Dagen van de week - Not shown for Sluitingsdag */}
      {formData.type && formData.type !== 'Sluitingsdag' && (
        <div className="exceptions-page__form-group">
          <label>Dagen van de week</label>
          <div className="exceptions-page__checkbox-group">
            {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(
              (day) => (
                <label key={day} className="exceptions-page__checkbox-label">
                  <input
                    type="checkbox"
                    name="daysOfWeek"
                    value={day}
                    checked={formData.daysOfWeek.includes(day)}
                    onChange={handleChange}
                    className="exceptions-page__checkbox"
                  />
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
              )
            )}
          </div>
          {errors.daysOfWeek && <p className="exceptions-page__error">{errors.daysOfWeek}</p>}
        </div>
      )}

      <button type="submit" className="button-style-3">
        Opslaan
      </button>
    </form>
  );
};

export default ExceptionForm;
