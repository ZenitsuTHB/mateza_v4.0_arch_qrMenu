import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeSelectorModal from '../Theme/index.js';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Settings = () => {

  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false); // State to control modal visibility

  const defaultSettings = {
    pageTitle: 'Reserveer Nu',
    generalNotification: '',
    pageFont: 'Poppins',
  };


  const handleAddTheme = (newTheme) => {
    handleSelectTheme(newTheme);
  };

  useEffect(() => {
    // Fetch settings from server
    axios.get('http://localhost:5000/api/settings/restaurantId123')
      .then((response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          setFormData(response.data);
        } else {
          setFormData(defaultSettings);
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        setFormData(defaultSettings); // Set defaults if fetch fails
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    axios.put('http://localhost:5000/api/settings/restaurantId123', formData)
      .then(() => {
        console.log('Settings updated successfully');
      })
      .catch((error) => console.error('Error saving settings:', error));
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
        onClick={handleSave}
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
