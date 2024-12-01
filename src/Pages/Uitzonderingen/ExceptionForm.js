// src/Pages/Uitzonderingen/ExceptionForm.js

import React, { useState } from 'react';
import './css/exceptions.css';

const ExceptionForm = ({ api, triggerNotification, refreshExceptions }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Opening',
    toepassing: 'Volledige Dag',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    maxSeats: '',
    daysOfWeek: ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
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

  const shouldShowField = (field) => {
    const { type } = formData;
    if (field === 'toepassing') {
      return type !== 'Sluitingsdag';
    }
    if (field === 'startHour' || field === 'endHour' || field === 'maxSeats') {
      return type === 'Opening' || type === 'Uitzondering';
    }
    if (field === 'startDate' || field === 'endDate') {
      return true;
    }
    if (field === 'daysOfWeek') {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.title.trim()) validationErrors.title = 'Titel is verplicht.';
    if (!formData.type) validationErrors.type = 'Type is verplicht.';
    if (shouldShowField('toepassing') && !formData.toepassing)
      validationErrors.toepassing = 'Toepassing is verplicht.';
    if (shouldShowField('startDate') && !formData.startDate)
      validationErrors.startDate = 'Startdatum is verplicht.';
    if (shouldShowField('endDate') && !formData.endDate)
      validationErrors.endDate = 'Einddatum is verplicht.';
    if (shouldShowField('startHour') && !formData.startHour)
      validationErrors.startHour = 'Startuur is verplicht.';
    if (shouldShowField('endHour') && !formData.endHour)
      validationErrors.endHour = 'Einduur is verplicht.';
    if (shouldShowField('maxSeats') && !formData.maxSeats)
      validationErrors.maxSeats = 'Max. Zitplaatsen is verplicht.';
    if (shouldShowField('daysOfWeek') && formData.daysOfWeek.length === 0)
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload, consider 'Sluitingsdag' as 'toepassing' 'Volledige Dag'
    const payload = {
      title: formData.title,
      type: formData.type,
      toepassing: formData.type === 'Sluitingsdag' ? 'Volledige Dag' : formData.toepassing,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startHour: formData.startHour,
      endHour: formData.endHour,
      maxSeats: formData.maxSeats,
      daysOfWeek: formData.daysOfWeek,
    };

    try {
      const response = await api.post(`${window.baseDomain}api/uitzonderingen`, payload);
      if (response) {
        setFormData({
          title: '',
          type: 'Opening',
          toepassing: 'Volledige Dag',
          startDate: '',
          endDate: '',
          startHour: '',
          endHour: '',
          maxSeats: '',
          daysOfWeek: ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
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
          className="exceptions-page__input"
        >
          <option value="Opening">Opening</option>
          <option value="Sluiting">Sluiting</option>
          <option value="Sluitingsdag">Sluitingsdag</option>
          <option value="Uitzondering">Uitzondering</option>
        </select>
        {errors.type && <p className="exceptions-page__error">{errors.type}</p>}
      </div>

      {shouldShowField('toepassing') && (
        <div className="exceptions-page__form-group">
          <label>Toepassing</label>
          <select
            name="toepassing"
            value={formData.toepassing}
            onChange={handleChange}
            className="exceptions-page__input"
          >
            <option value="Volledige Dag">Volledige Dag</option>
            <option value="Ontbijt">Ontbijt</option>
            <option value="Lunch">Lunch</option>
            <option value="Diner">Diner</option>
          </select>
          {errors.toepassing && <p className="exceptions-page__error">{errors.toepassing}</p>}
        </div>
      )}

      {shouldShowField('startDate') && (
        <div className="exceptions-page__form-group">
          <label>Start Datum</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="exceptions-page__input"
          />
          {errors.startDate && <p className="exceptions-page__error">{errors.startDate}</p>}
        </div>
      )}

      {shouldShowField('endDate') && (
        <div className="exceptions-page__form-group">
          <label>Einde Datum</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="exceptions-page__input"
          />
          {errors.endDate && <p className="exceptions-page__error">{errors.endDate}</p>}
        </div>
      )}

      {shouldShowField('startHour') && (
        <div className="exceptions-page__form-group">
          <label>Start Uur</label>
          <input
            type="time"
            name="startHour"
            value={formData.startHour}
            onChange={handleChange}
            className="exceptions-page__input"
          />
          {errors.startHour && <p className="exceptions-page__error">{errors.startHour}</p>}
        </div>
      )}

      {shouldShowField('endHour') && (
        <div className="exceptions-page__form-group">
          <label>Eind Uur</label>
          <input
            type="time"
            name="endHour"
            value={formData.endHour}
            onChange={handleChange}
            className="exceptions-page__input"
          />
          {errors.endHour && <p className="exceptions-page__error">{errors.endHour}</p>}
        </div>
      )}

      {shouldShowField('maxSeats') && (
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
      )}

      {shouldShowField('daysOfWeek') && (
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
