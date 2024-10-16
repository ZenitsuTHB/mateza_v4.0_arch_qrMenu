import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeSelectorModal from '../Theme/index.js';
import useNotification from '../../../Components/Notification/index.js'; // Adjust the import path as needed
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Settings = () => {
  const defaultSettings = {
    pageTitle: 'Reserveer Nu',
    generalNotification: '',
  };

  const [formData, setFormData] = useState(defaultSettings);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    // Fetch settings from the server
    axios.get('http://localhost:5000/api/settings/restaurantId123')
      .then((response) => {
        if (response.data) {
          const data = response.data;

          // Set formData and other relevant settings from response
          setFormData({
            pageTitle: data.pageTitle || defaultSettings.pageTitle,
            generalNotification: data.generalNotification || '',
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        // If fetch fails, use default settings
        setFormData(defaultSettings);
      });

    // Fetch theme from the server
    axios.get('http://localhost:5000/api/theme/restaurantId123')
      .then((response) => {
        
        setSelectedTheme(response.data);

      })
      .catch((error) => {
        console.error('Error fetching theme:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios.put('http://localhost:5000/api/settings/restaurantId123', formData)
      .then(() => {
        console.log('Settings updated successfully');
      })
      .catch((error) => {
        console.error('Error saving settings:', error);
      });
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
            style={{ cursor: 'pointer' }}
            title="Klik om het thema te wijzigen"
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
        />
      )}
    </div>
  );
};

export default Settings;
