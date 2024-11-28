// src/Pages/Menu/index.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/menu.css';
import useApi from '../../Hooks/useApi';

const Menu = () => {
  const api = useApi();

  // State for the list of menus
  const [menus, setMenus] = useState([]);

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

  // Fetch the menus at component mount
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/menu', { noCache: true });
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          setMenus([]);
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        setMenus([]);
      }
    };
    fetchMenus();
  }, [api]);

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
          // Success, reset form and fetch menus again
          setFormData({
            name: '',
            startDate: '',
            endDate: '',
            startHour: '',
            endHour: '',
            daysOfWeek: [],
          });
          setErrors({});
          // Fetch menus again
          const data = await api.get(window.baseDomain + 'api/menu', { noCache: true });
          if (Array.isArray(data)) {
            setMenus(data);
          } else {
            setMenus([]);
          }
        } else {
          setErrors({ server: 'Er is een fout opgetreden bij het toevoegen van het menu.' });
        }
      } catch (error) {
        console.error('Error adding menu:', error);
        setErrors({ server: 'Er is een fout opgetreden bij het toevoegen van het menu.' });
      }
    }
  };

  // Render component
  return (
    <div className="menu-component">
      <div className="menu-component__container">
        <form className="menu-component__form" onSubmit={handleSubmit}>
          <div className="menu-component__form-group">
            <label htmlFor="name">Menu Naam</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="menu-component__error">{errors.name}</p>}
          </div>
          <div className="menu-component__form-group">
            <label htmlFor="startDate">Start Datum</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <p className="menu-component__error">{errors.startDate}</p>}
          </div>
          <div className="menu-component__form-group">
            <label htmlFor="endDate">Eind Datum</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <p className="menu-component__error">{errors.endDate}</p>}
          </div>
          <div className="menu-component__form-group">
            <label htmlFor="startHour">Start Uur</label>
            <input
              type="time"
              id="startHour"
              name="startHour"
              value={formData.startHour}
              onChange={handleChange}
            />
            {errors.startHour && <p className="menu-component__error">{errors.startHour}</p>}
          </div>
          <div className="menu-component__form-group">
            <label htmlFor="endHour">Eind Uur</label>
            <input
              type="time"
              id="endHour"
              name="endHour"
              value={formData.endHour}
              onChange={handleChange}
            />
            {errors.endHour && <p className="menu-component__error">{errors.endHour}</p>}
          </div>
          <div className="menu-component__form-group">
            <label>Dagen van de week</label>
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

        <div className="menu-component__list">
          <h3>Menu's</h3>
          {menus.length > 0 ? (
            <ul className="menu-component__menu-list">
              {menus.map((menu) => (
                <li key={menu._id} className="menu-component__menu-item">
                  <h4>{menu.name}</h4>
                  <p>
                    Geldig van {menu.startDate} tot {menu.endDate}
                  </p>
                  <p>
                    Van {menu.startHour} tot {menu.endHour}
                  </p>
                  <p>Dagen: {menu.daysOfWeek.join(', ')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Geen menu's gevonden.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withHeader(Menu);
