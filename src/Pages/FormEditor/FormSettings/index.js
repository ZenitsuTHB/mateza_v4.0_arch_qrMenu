// src/components/FormSettings/FormSettings.jsx

import React, { useState, useEffect } from 'react';
import '../css/FormSettings/formSettings.css';
import { withHeader } from '../../../Components/Structural/Header/index.js';

const FormSettings = () => {
  const [formData, setFormData] = useState({
    pageTitle: '',
    generalNotification: '',
    pageFont: '',
  });

  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    // Retrieve the selected theme from localStorage
    const theme = localStorage.getItem('selectedTheme');
    if (theme) {
      setSelectedTheme(JSON.parse(theme));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form Settings:', formData);
    alert('Instellingen succesvol opgeslagen!');
    // Optionally, save settings to localStorage or backend
  };

  return (
    <div className="form-settings-page">
      <form className="form-settings-form" onSubmit={handleSubmit}>
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
            {/* Add more fonts as needed */}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Opslaan
        </button>
      </form>
    </div>
  );
};

export default withHeader(FormSettings);
