// src/components/FormSettings/FormSettings.jsx

import React, { useState, useEffect } from 'react';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    pageTitle: '',
    generalNotification: '',
    pageFont: '',
  });

  const [selectedTheme, setSelectedTheme] = useState(null);
  const [buttonColor, setButtonColor] = useState('#007bff');

  // Load settings from localStorage on mount
  useEffect(() => {
    // Retrieve and set formData
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    if (storedFormData) {
      if (!storedFormData.pageTitle.trim()) {
        // If the stored title is empty, set it to "Reserveer Nu"
        const updatedFormData = { ...storedFormData, pageTitle: 'Reserveer Nu' };
        setFormData(updatedFormData);
        localStorage.setItem('formData', JSON.stringify(updatedFormData));
      } else {
        setFormData(storedFormData);
      }
    } else {
      // If no formData is stored, initialize with default title
      setFormData((prevData) => ({
        ...prevData,
        pageTitle: 'Reserveer Nu',
      }));
      localStorage.setItem('formData', JSON.stringify({
        ...formData,
        pageTitle: 'Reserveer Nu',
      }));
    }

    // Retrieve and set selectedTheme
    const theme = localStorage.getItem('selectedTheme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      setSelectedTheme(parsedTheme);

      // Update buttonColor based on theme
      setButtonColor(parsedTheme.color || '#007bff');
    } else {
      // If no theme is selected, retrieve buttonColor
      const storedButtonColor = localStorage.getItem('buttonColor');
      if (storedButtonColor) {
        setButtonColor(storedButtonColor);
      }
    }
  }, []);

  // Update localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  // Update localStorage whenever selectedTheme changes
  useEffect(() => {
    if (selectedTheme) {
      localStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
      // Also update buttonColor based on the selected theme
      localStorage.setItem('buttonColor', selectedTheme.color || '#007bff');
    }
  }, [selectedTheme]);

  // Update localStorage whenever buttonColor changes independently
  useEffect(() => {
    if (!selectedTheme) {
      localStorage.setItem('buttonColor', buttonColor);
    }
  }, [buttonColor, selectedTheme]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'pageTitle') {
      if (value.trim() === '') {
        // If the user clears the title, set it to "Reserveer Nu"
        setFormData((prevData) => ({
          ...prevData,
          pageTitle: 'Reserveer Nu',
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)

    // Optional: Provide feedback to the user
    alert('Instellingen opgeslagen!');
  };

  return (
    <div>
        {/* Page Title */}
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

        {/* General Notification */}
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

        {/* Theme Selection */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          style={{ backgroundColor: buttonColor }}
        >
          Opslaan
        </button>
    </div>
  );
};

export default Settings;
