import React, { useState } from 'react';
import './css/menu.css';
import { FaInfoCircle } from 'react-icons/fa';

const MenuForm = ({ api, triggerNotification, refreshMenus }) => {
  // State for the form data
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    daysOfWeek: [],
  });

  // State for errors
  const [errors, setErrors] = useState({});

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
      // Post data to api/menu
      try {
        const response = await api.post(window.baseDomain + 'api/menu', formData);
        if (response) {
          // Success, reset form and refresh menus
          setFormData({
            name: '',
            startDate: '',
            endDate: '',
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
        <div className="label-with-tooltip">
          <label>Menu Naam</label>
          <div className="button-with-tooltip">
            <FaInfoCircle />
            <div className="tooltip">
              De naam van het menu.
            </div>
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {errors.name && <p className="menu-component__error">{errors.name}</p>}
      </div>

      {/* Start Datum */}
      <div className="menu-component__form-group">
        <div className="label-with-tooltip">
          <label>Start Datum</label>
          <div className="button-with-tooltip">
            <FaInfoCircle />
            <div className="tooltip">
              De startdatum vanaf wanneer het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="input-container">
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        {errors.startDate && <p className="menu-component__error">{errors.startDate}</p>}
      </div>

      {/* Eind Datum */}
      <div className="menu-component__form-group">
        <div className="label-with-tooltip">
          <label>Eind Datum</label>
          <div className="button-with-tooltip">
            <FaInfoCircle />
            <div className="tooltip">
              De einddatum tot wanneer het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="input-container">
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
        {errors.endDate && <p className="menu-component__error">{errors.endDate}</p>}
      </div>

      {/* Start Uur */}
      <div className="menu-component__form-group">
        <div className="label-with-tooltip">
          <label>Start Uur</label>
          <div className="button-with-tooltip">
            <FaInfoCircle />
            <div className="tooltip">
              Het beginuur waarop het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="input-container">
          <input
            type="time"
            id="startHour"
            name="startHour"
            value={formData.startHour}
            onChange={handleChange}
          />
        </div>
        {errors.startHour && <p className="menu-component__error">{errors.startHour}</p>}
      </div>

      {/* Eind Uur */}
      <div className="menu-component__form-group">
        <div className="label-with-tooltip">
          <label>Eind Uur</label>
          <div className="button-with-tooltip">
            <FaInfoCircle />
            <div className="tooltip">
              Het einduur waarop het menu beschikbaar is.
            </div>
          </div>
        </div>
        <div className="input-container">
          <input
            type="time"
            id="endHour"
            name="endHour"
            value={formData.endHour}
            onChange={handleChange}
          />
        </div>
        {errors.endHour && <p className="menu-component__error">{errors.endHour}</p>}
      </div>

      {/* Dagen van de week */}
      <div className="menu-component__form-group">
        <div className="label-with-tooltip">
          <label>Dagen van de week</label>
          <div className="button-with-tooltip">
            <FaInfoCircle />
            <div className="tooltip">
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
                {day}
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
