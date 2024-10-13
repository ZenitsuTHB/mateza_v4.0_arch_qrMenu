// src/components/AppearanceSettings/AppearanceSettings.jsx

import React, { useState, useEffect } from 'react';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Colors = () => {
  const [appearanceData, setAppearanceData] = useState({
    textColor: '#000000',
    backgroundColor: '',
    containerColor: '#FFFFFF',
    buttonColor: '',
    buttonTextColor: '#FFFFFF',
  });

  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    const theme = localStorage.getItem('selectedTheme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      setSelectedTheme(parsedTheme);

      setAppearanceData((prevData) => ({
        ...prevData,
        backgroundColor: parsedTheme.color || '#007bff',
        buttonColor: parsedTheme.color || '#007bff',
      }));
    }

    const storedTextColor = localStorage.getItem('textColor');
    const storedBackgroundColor = localStorage.getItem('backgroundColor');
    const storedContainerColor = localStorage.getItem('containerColor');
    const storedButtonColor = localStorage.getItem('buttonColor');
    const storedButtonTextColor = localStorage.getItem('buttonTextColor');

    setAppearanceData((prevData) => ({
      ...prevData,
      textColor: storedTextColor || prevData.textColor,
      backgroundColor: storedBackgroundColor || prevData.backgroundColor,
      containerColor: storedContainerColor || prevData.containerColor,
      buttonColor: storedButtonColor || prevData.buttonColor,
      buttonTextColor: storedButtonTextColor || prevData.buttonTextColor,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppearanceData({
      ...appearanceData,
      [name]: value,
    });

    localStorage.setItem(name, value);
  };

  return (
    <div>
        <div className="form-group">
          <label htmlFor="textColor">Tekstkleur:</label>
          <input
            type="color"
            id="textColor"
            name="textColor"
            value={appearanceData.textColor}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="backgroundColor">Achtergrondkleur:</label>
          <input
            type="color"
            id="backgroundColor"
            name="backgroundColor"
            value={appearanceData.backgroundColor}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="containerColor">Containerkleur:</label>
          <input
            type="color"
            id="containerColor"
            name="containerColor"
            value={appearanceData.containerColor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="buttonColor">Knopkleur:</label>
          <input
            type="color"
            id="buttonColor"
            name="buttonColor"
            value={appearanceData.buttonColor}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="buttonTextColor">Knoptekstkleur:</label>
          <input
            type="color"
            id="buttonTextColor"
            name="buttonTextColor"
            value={appearanceData.buttonTextColor}
            onChange={handleChange}
          />
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

export default Colors;
