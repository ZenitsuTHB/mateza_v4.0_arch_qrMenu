// src/components/FormSettings/FormSettings.jsx

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const FormSettings = () => {
  const [formData, setFormData] = useState({
    pageTitle: '',
    generalNotification: '',
    pageFont: '',
  });

  const [selectedTheme, setSelectedTheme] = useState(null);
  const [buttonColor, setButtonColor] = useState('#007bff'); // Default blue color

  useEffect(() => {
    // Retrieve selectedTheme from localStorage
    const theme = localStorage.getItem('selectedTheme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      setSelectedTheme(parsedTheme);

      // If buttonColor is not set, default to selectedTheme.color
      const storedButtonColor = localStorage.getItem('buttonColor');
      if (storedButtonColor) {
        setButtonColor(storedButtonColor);
      } else {
        setButtonColor(parsedTheme.color || '#007bff'); // Fallback to default blue
      }
    } else {
      // If no theme is selected, use default button color or stored color
      const storedButtonColor = localStorage.getItem('buttonColor');
      if (storedButtonColor) {
        setButtonColor(storedButtonColor);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleButtonColorChange = (e) => {
    const newColor = e.target.value;
    setButtonColor(newColor);
    localStorage.setItem('buttonColor', newColor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Settings:', formData);
    alert('Instellingen succesvol opgeslagen!');
    // You can also save formData to localStorage or send it to a server here
  };

  return (
    <div className="form-settings-page">
      <form className="form-settings-form" onSubmit={handleSubmit}>
        <h2 className="secondary-title">Stel uw Pagina in</h2>

        <div className="form-group">
          <label htmlFor="pageTitle">Titel:</label>
          <input
            type="text"
            id="pageTitle"
            name="pageTitle"
            value={formData.pageTitle}
            onChange={handleChange}
            required
            placeholder="Voer de paginatitel in"
          />
        </div>

        <div className="form-group">
          <label htmlFor="generalNotification">Mededeling:</label>
          <textarea
            id="generalNotification"
            name="generalNotification"
            value={formData.generalNotification}
            onChange={handleChange}
            placeholder="Voer een algemene mededeling in"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Thema:</label>
          {selectedTheme ? (
            <div className="theme-preview">
              <div className="theme-preview-content">
                <div
                  className="theme-preview-left"
                  style={{ backgroundColor: selectedTheme.color }}
                ></div>
                <div className="theme-preview-right">
                  <img src={selectedTheme.image} alt={selectedTheme.title} />
                </div>
              </div>
              <div className="theme-preview-title">{selectedTheme.title}</div>
            </div>
          ) : (
            <p>Geen thema geselecteerd</p>
          )}
        </div>

		<div className="form-group">
          <label htmlFor="buttonColor">Knopkleur:</label>
          <input
            type="color"
            id="buttonColor"
            name="buttonColor"
            value={buttonColor}
            onChange={handleButtonColorChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pageFont">Lettertype:</label>
          <select
            id="pageFont"
            name="pageFont"
            value={formData.pageFont}
            onChange={handleChange}
            required
          >
            <option value="">Selecteer een lettertype</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        

        <button
          type="submit"
          className="submit-button"
        >
          Opslaan
        </button>
      </form>
    </div>
  );
};

export default withHeader(FormSettings);
