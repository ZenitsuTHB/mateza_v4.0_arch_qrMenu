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

        <button
          type="submit"
          className="submit-button"
        >
          Opslaan
        </button>
        </div>
      
  );
};

export default Settings;
