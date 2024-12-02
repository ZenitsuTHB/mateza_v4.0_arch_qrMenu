// src/Pages/Uitzonderingen/components/ExceptionForm.js

import React, { useState } from 'react';
import './css/exceptionForm.css';
import { shifts } from './constants';

const ExceptionForm = ({ api, triggerNotification, refreshExceptions }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    toepassing: '',
    date: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    maxSeats: '',
    daysOfWeek: [],
  });

  const [errors, setErrors] = useState({});
  const [startHourOptions, setStartHourOptions] = useState([]);
  const [endHourOptions, setEndHourOptions] = useState([]);

  // Function to generate time options
  const generateTimeOptions = (start, end) => {
    const options = [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
      const timeString = current.toTimeString().substr(0, 5);
      options.push(timeString);
      current.setMinutes(current.getMinutes() + 15);
    }

    return options;
  };

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
    } else if (name === 'toepassing') {
      const toepassing = value;
      if (shifts[toepassing]) {
        const options = generateTimeOptions(shifts[toepassing].start, shifts[toepassing].end);
        setStartHourOptions(options);
        setEndHourOptions(options);
        setFormData({
          ...formData,
          [name]: value,
          startHour: '', // Reset startHour and endHour when toepassing changes
          endHour: '',
        });
      } else {
        setStartHourOptions([]);
        setEndHourOptions([]);
        setFormData({
          ...formData,
          [name]: value,
          startHour: '',
          endHour: '',
        });
      }
      setErrors({ ...errors, [name]: '' });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }

    // Shift focus to endDate after selecting startDate
    if (name === 'startDate') {
      setTimeout(() => {
        document.getElementById('endDate')?.focus();
      }, 100);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Titel is verplicht.';
    if (!formData.type) validationErrors.type = 'Type is verplicht.';
    if (formData.type !== 'Sluitingsdag' && formData.type !== 'Sluitingsdagen' && !formData.toepassing)
      validationErrors.toepassing = 'Toepassing is verplicht.';

    // Date Validations
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight

    let startDateObj, endDateObj, dateObj;

    if (formData.type === 'Sluitingsdag') {
      if (!formData.date) validationErrors.date = 'Datum is verplicht.';
      else {
        dateObj = new Date(formData.date);
        if (dateObj < today) validationErrors.date = 'Datum kan niet in het verleden liggen.';
      }
    } else {
      if (!formData.startDate) validationErrors.startDate = 'Startdatum is verplicht.';
      if (!formData.endDate) validationErrors.endDate = 'Einddatum is verplicht.';

      if (formData.startDate) startDateObj = new Date(formData.startDate);
      if (formData.endDate) endDateObj = new Date(formData.endDate);

      if (startDateObj && startDateObj < today)
        validationErrors.startDate = 'Startdatum kan niet in het verleden liggen.';
      if (endDateObj && endDateObj < today)
        validationErrors.endDate = 'Einddatum kan niet in het verleden liggen.';
      if (startDateObj && endDateObj && startDateObj > endDateObj)
        validationErrors.startDate = 'Startdatum kan niet na de einddatum liggen.';
    }

    if ((formData.type === 'Opening' || formData.type === 'Uitzondering') && !formData.startHour)
      validationErrors.startHour = 'Startuur is verplicht.';
    if ((formData.type === 'Opening' || formData.type === 'Uitzondering') && !formData.endHour)
      validationErrors.endHour = 'Einduur is verplicht.';
    if ((formData.type === 'Opening' || formData.type === 'Uitzondering') && !formData.maxSeats)
      validationErrors.maxSeats = 'Max. Zitplaatsen is verplicht.';

    if (formData.daysOfWeek.length === 0 && formData.type !== '' && formData.type !== 'Sluitingsdag')
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    // Time Validations
    if (formData.startHour && formData.endHour) {
      const startHourObj = new Date(`1970-01-01T${formData.startHour}:00`);
      const endHourObj = new Date(`1970-01-01T${formData.endHour}:00`);
      if (startHourObj >= endHourObj) {
        validationErrors.endHour = 'Einduur moet na startuur liggen.';
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload
    let payload = {
      title: formData.title,
      type: ['Sluitingsdag', 'Sluitingsdagen'].includes(formData.type) ? 'Sluiting' : formData.type,
      toepassing:
        formData.type === 'Sluitingsdag' || formData.type === 'Sluitingsdagen'
          ? 'Volledige Dag'
          : formData.toepassing,
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

    try {
      const response = await api.post(`${window.baseDomain}api/uitzonderingen`, payload);
      if (response) {
        setFormData({
          title: '',
          type: '',
          toepassing: '',
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
            name="toepassing"
            value={formData.toepassing}
            onChange={handleChange}
            className="exceptions-page__select"
          >
            <option value="">Selecteer Toepassing</option>
            {/* Exclude "Volledige Dag" for types 'Opening', 'Uitzondering', 'Sluiting' */}
            <option value="Ontbijt">Ontbijt</option>
            <option value="Lunch">Lunch</option>
            <option value="Diner">Diner</option>
          </select>
          {errors.toepassing && <p className="exceptions-page__error">{errors.toepassing}</p>}
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
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="exceptions-page__input"
            />
            {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Datum</label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="exceptions-page__input"
            />
            {errors.endDate && <p className="exceptions-page__error">{errors.endDate}</p>}
          </div>
        </>
      )}

      {(formData.type === 'Opening' || formData.type === 'Uitzondering' || formData.type === 'Sluiting') && (
        <>
          <div className="exceptions-page__form-group">
            <label>Start Datum</label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="exceptions-page__input"
            />
            {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
          </div>

          <div className="exceptions-page__form-group">
            <label>Eind Datum</label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="exceptions-page__input"
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
              {startHourOptions.map((time) => (
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
              {endHourOptions.map((time) => (
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
