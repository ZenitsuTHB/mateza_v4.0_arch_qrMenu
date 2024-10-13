// src/components/FormSettings/FormSettings.jsx

import React, { useState, useEffect } from 'react';
import ThemeSelectorModal from '../Theme/index.js';
import useNotification from '../../../Components/Notification/index.js'; // Adjust the import path as needed
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
  const [showThemeModal, setShowThemeModal] = useState(false); // State to control modal visibility

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', JSON.stringify(theme));

    setButtonColor(theme.color);
    localStorage.setItem('buttonColor', theme.color);
  };

  const handleAddTheme = (newTheme) => {
    handleSelectTheme(newTheme);
  };

  useEffect(() => {
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    if (storedFormData) {
      if (!storedFormData.pageTitle.trim()) {
        const updatedFormData = { ...storedFormData, pageTitle: 'Reserveer Nu' };
        setFormData(updatedFormData);
        localStorage.setItem('formData', JSON.stringify(updatedFormData));
      } else {
        setFormData(storedFormData);
      }
    } else {
      const initialFormData = { ...formData, pageTitle: 'Reserveer Nu' };
      setFormData(initialFormData);
      localStorage.setItem('formData', JSON.stringify(initialFormData));
    }

    const theme = localStorage.getItem('selectedTheme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      setSelectedTheme(parsedTheme);

      localStorage.setItem('backgroundColor', parsedTheme.color);
      localStorage.setItem('buttonColor', parsedTheme.color);
    } else {
      const storedButtonColor = localStorage.getItem('buttonColor');
      if (storedButtonColor) {
        setButtonColor(storedButtonColor);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (selectedTheme) {
      localStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
      localStorage.setItem('backgroundColor', selectedTheme.color || '#007bff');
      localStorage.setItem('buttonColor', selectedTheme.color || '#007bff');
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (!selectedTheme) {
      localStorage.setItem('backgroundColor', buttonColor);
      localStorage.setItem('buttonColor', buttonColor);
    }
  }, [buttonColor, selectedTheme]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'pageTitle' && value.trim() === '') {
      setFormData((prevData) => ({
        ...prevData,
        pageTitle: 'Reserveer Nu',
      }));
    }
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="pageTitle">Titel:</label>
        <input
          type="text"
          id="pageTitle"
          name="pageTitle"
          value={formData.pageTitle}
          onChange={handleChange}
          onBlur={handleBlur}
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
          <div
            className="theme-preview clickable"
            onClick={() => setShowThemeModal(true)}
            style={{ cursor: 'pointer' }} // Change cursor to pointer on hover
            title="Klik om het thema te wijzigen" // Tooltip for better UX
          >
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

      <button
        type="submit"
        className="submit-button"
      >
        Opslaan
      </button>

      {showThemeModal && (
        <ThemeSelectorModal
          onClose={() => setShowThemeModal(false)}
          onSelectTheme={handleSelectTheme}
          onAddTheme={handleAddTheme}
        />
      )}
    </div>
  );
};

export default Settings;
