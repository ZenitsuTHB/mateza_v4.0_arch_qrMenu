// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import useNotification from '../../../Components/Notification/index';
import WebFont from 'webfontloader';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Fonts = forwardRef((props, ref) => {
  const defaultFonts = {
    titleFont: 'Poppins',
    subtitleFont: 'Poppins',
    labelFont: 'Poppins',
    buttonFont: 'Poppins',
  };

  const [fontsState, setFontsState] = useState(defaultFonts);
  const [initialFontsState, setInitialFontsState] = useState(defaultFonts);
  const { triggerNotification, NotificationComponent } = useNotification();

  const availableFonts = [
    'Poppins', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
    'Courier New', 'Verdana', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  ];

  const fontCategories = [
    { key: 'titleFont', label: 'Titel' },
    { key: 'subtitleFont', label: 'Subtitel' },
    { key: 'labelFont', label: 'Label Tekst' },
    { key: 'buttonFont', label: 'Knop' },
  ];

  useEffect(() => {
    // Fetch fonts settings from server
    axios.get('http://localhost:5000/api/fonts/restaurantId123')
      .then((response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          setFontsState(response.data);
          setInitialFontsState(response.data);
        } else {
          setFontsState(defaultFonts);
          setInitialFontsState(defaultFonts);
        }
      })
      .catch((error) => {
        console.error('Error fetching fonts:', error);
        setFontsState(defaultFonts); // Set defaults if fetch fails
        setInitialFontsState(defaultFonts);
      });
  }, []);

  useEffect(() => {
    const fontsToLoad = Array.from(new Set(Object.values(fontsState)));
    WebFont.load({
      google: { families: fontsToLoad },
      active: () => {},
      inactive: () => { console.error('Failed to load fonts.'); },
    });
  }, [fontsState]);

  const handleFontSelect = (categoryKey, font) => {
    setFontsState((prev) => ({ ...prev, [categoryKey]: font }));
  };

  const handleSave = () => {
    axios.put('http://localhost:5000/api/fonts/restaurantId123', fontsState)
      .then(() => {
        triggerNotification('Lettertypes aangepast', 'success');
        setInitialFontsState(fontsState); // Reset isDirty flag
      })
      .catch((error) => console.error('Error saving fonts:', error));
  };

  // Determine if there are unsaved changes
  const isDirty = JSON.stringify(fontsState) !== JSON.stringify(initialFontsState);

  // Expose isDirty to parent
  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  return (
    <div className="fonts-container">
      <NotificationComponent />
      {fontCategories.map(({ key, label }) => (
        <div className="form-group" key={key}>
          <label>{label}:</label>
          <select
            value={fontsState[key]}
            onChange={(e) => handleFontSelect(key, e.target.value)}
          >
            {availableFonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button type="submit" className="submit-button" onClick={handleSave}>
        Opslaan
      </button>
    </div>
  );
});

export default Fonts;
