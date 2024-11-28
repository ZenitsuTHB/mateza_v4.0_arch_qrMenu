// src/Pages/Menu/MenuForm.js

import React, { useState } from 'react';
import './css/menu.css';
import { FaInfoCircle } from 'react-icons/fa';
import DatePik$ from '../ReservationsList/Filters/DatePickerComponent'; // Adjust the path if necessary

const MenuForm = ({ api, triggerNotification, refreshMenus }) => {
  // State for the form data
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    startHour: '',
    endHour: '',
    daysOfWeek: [],
  });

  // State for errors
  const [errors, setErrors] = useState({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Handle form input changes
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

  // Handle date changes using DatePickerComponent
  const handleStartDateChange = (date) => {
    setFormData({ ...formData, startDate: date });
    setIsDatePickerOpen(false);
  };

  const handleEndDateChange = (date) => {
    setFormData({ ...formData, endDate: date });
    setIsDatePickerOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = 'Menu naam is verplicht.';
    }
    if (!formData.startDate) {
      validationErrors.startDate = 'Startdatum is verplicht.';
    }
    if (!formData.endDate) {
      validationErrors.endDate = 'Einddatum is verplicht.';
    }
    if (!formData.startHour) {
      validationErrors.startHour = 'Startuur is verplicht.';
    }
    if (!formData.endHour) {
      validationErrors.endHour = 'Einduur is verplicht.';
    }
    if (formData.daysOfWeek.length === 0) {
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Prepare data for API
      const payload = {
        name: formData.name,
        startDate: formData.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        endDate: formData.endDate.toISOString().split('T')[0],
        startHour: formData.startHour,
        endHour: formData.endHour,
        daysOfWeek: formData.daysOfWeek,
      };

      // Post data to api/menu
      try {
        const response = await api.post(window.baseDomain + 'api/menu', payload);
        if (response) {
          // Success, reset form and refresh menus
          setFormData({
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            startHour: '',
            endHour: '',
            daysOfWeek: [],
          });
          setErrors({});
          triggerNotification('Menu succesvol toegevoegd', 'success');
          // Refresh menus
          refreshMenus();
        } else {
          setErrors({ server: 'Er is een fout opgetreden bij het toevoegen van het menu.' });
          triggerNotification('Fout bij het toevoegen van het menu', 'error');
        }
      } catch (error) {
        console.error('Error adding menu:', error);
        setErrors({ server: 'Er is een fout opgetreden bij het toevoegen van het menu.' });
        triggerNotification('Fout bij het toevoegen van het menu', 'error');
      }
    }
  };

  return (
    <form className="menu-component__form" onSubmit={handleSubmit}>
      {/* Menu Naam */}
      <div className="menu-component__form-group">
        <div className="menu-component__label-with-tooltip">
          <label>Menu Naam</label>
          <div className="menu-component__button-with-tooltip">
            <FaInfoCircle />
            <div className="menu-component__tooltip">
              De naam van het menu.
            </div>
          </div>
        </div>
        <div className="menu-component__input-container">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Menu Naam"
          />
        </div>
        {errors.name && <p className="menu-component__error">{errors.name}</p>}
      </div>

      {/* Start Datum */}
      <div className="menu-component__form-group">
        <div className="menu-component__label-with-tooltip">
          <label>Start Datum</label>
          <div className="menu-component__button-with-tooltip">
            <FaInfoCircle />
            <div className="menu-component__tooltip">
              De startdatum vanaf wanneer het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="menu-component__input-container">
          <DatePickerComponent
            selectedDate={formData.startDate}
            setSelectedDate={(date) => setFormData({ ...formData, startDate: date })}
            isDatePickerOpen={false}
            setIsDatePickerOpen={() => {}}
            handleDateChange={handleStartDateChange}
          />
          {/* Alternatively, you can toggle DatePickerComponent's visibility as needed */}
        </div>
        {errors.startDate && <p className="menu-component__error">{errors.startDate}</p>}
      </div>

      {/* Eind Datum */}
      <div className="menu-component__form-group">
        <div className="menu-component__label-with-tooltip">
          <label>Eind Datum</label>
          <div className="menu-component__button-with-tooltip">
            <FaInfoCircle />
            <div className="menu-component__tooltip">
              De einddatum tot wanneer het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="menu-component__input-container">
          <DatePickerComponent
            selectedDate={formData.endDate}
            setSelectedDate={(date) => setFormData({ ...formData, endDate: date })}
            isDatePickerOpen={false}
            setIsDatePickerOpen={() => {}}
            handleDateChange={handleEndDateChange}
          />
        </div>
        {errors.endDate && <p className="menu-component__error">{errors.endDate}</p>}
      </div>

      {/* Start Uur */}
      <div className="menu-component__form-group">
        <div className="menu-component__label-with-tooltip">
          <label>Start Uur</label>
          <div className="menu-component__button-with-tooltip">
            <FaInfoCircle />
            <div className="menu-component__tooltip">
              Het beginuur waarop het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="menu-component__input-container">
          <input
            type="time"
            id="startHour"
            name="startHour"
            value={formData.startHour}
            onChange={handleChange}
            placeholder="Start Uur"
          />
        </div>
        {errors.startHour && <p className="menu-component__error">{errors.startHour}</p>}
      </div>

      {/* Eind Uur */}
      <div className="menu-component__form-group">
        <div className="menu-component__label-with-tooltip">
          <label>Eind Uur</label>
          <div className="menu-component__button-with-tooltip">
            <FaInfoCircle />
            <div className="menu-component__tooltip">
              Het einduur waarop het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="menu-component__input-container">
          <input
            type="time"
            id="endHour"
            name="endHour"
            value={formData.endHour}
            onChange={handleChange}
            placeholder="Eind Uur"
          />
        </div>
        {errors.endHour && <p className="menu-component__error">{errors.endHour}</p>}
      </div>

      {/* Dagen van de week */}
      <div className="menu-component__form-group">
        <div className="menu-component__label-with-tooltip">
          <label>Dagen van de week</label>
          <div className="menu-component__button-with-tooltip">
            <FaInfoCircle />
            <div className="menu-component__tooltip">
              Selecteer de dagen waarop het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="menu-component__checkbox-group">
          {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(
            (day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  name="daysOfWeek"
                  value={day}
                  checked={formData.daysOfWeek.includes(day)}
                  onChange={handleChange}
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            )
          )}
        </div>
        {errors.daysOfWeek && <p className="menu-component__error">{errors.daysOfWeek}</p>}
      </div>

      <button type="submit" className="menu-component__submit-button">
        Menu Toevoegen
      </button>
      {errors.server && <p className="menu-component__error">{errors.server}</p>}
    </form>
  );
};

export default MenuForm;
