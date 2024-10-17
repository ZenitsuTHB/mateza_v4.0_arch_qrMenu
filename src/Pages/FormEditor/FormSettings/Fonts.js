// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import useNotification from '../../../Components/Notification/index';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Fonts = forwardRef((props, ref) => {
  const defaultFonts = {
    titleFont: { font: 'Poppins', weight: '400' },
    subtitleFont: { font: 'Poppins', weight: '400' },
    labelFont: { font: 'Poppins', weight: '400' },
    buttonFont: { font: 'Poppins', weight: '400' },
  };

  const resetFonts = {
    titleFont: { font: 'Poppins', weight: '700' },
    subtitleFont: { font: 'Poppins', weight: '500' },
    labelFont: { font: 'Poppins', weight: '500' },
    buttonFont: { font: 'Poppins', weight: '500' },
  };

  const [fontsState, setFontsState] = useState(defaultFonts);
  const [initialFontsState, setInitialFontsState] = useState(defaultFonts);
  const { triggerNotification, NotificationComponent } = useNotification();

  const availableFonts = [
    'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Nunito', 'Raleway', 'Oswald', 'Ubuntu', 'Merriweather',
    'Playfair Display', 'Lora', 'Noto Sans', 'Rubik', 'PT Sans',
    'Work Sans', 'Inter', 'Cabin', 'Nunito Sans', 'Mukta',
    'Fira Sans', 'Josefin Sans', 'Quicksand', 'Bitter',
    'Anton', 'Bebas Neue', 'Dancing Script', 'Lobster', 'Pacifico',
    'Comfortaa', 'Arvo', 'Cairo', 'Heebo', 'Karla', 'Mulish',
    'Righteous', 'Roboto Condensed', 'Satisfy', 'Slabo 27px',
    'Source Sans Pro',
  ];

  const availableFontWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

  const fontCategories = [
    { key: 'titleFont', label: 'Titel' },
    { key: 'subtitleFont', label: 'Subtitel' },
    { key: 'labelFont', label: 'Tekst' },
    { key: 'buttonFont', label: 'Knoppen' },
  ];

  useEffect(() => {
    axios
      .get(window.baseDomain + 'api/fonts/restaurantId123')
      .then((response) => {
        if (response.data && Object.keys(response.data).length > 0) {
          const fetchedFonts = response.data;
          const transformedFonts = {};

          for (const key of Object.keys(fetchedFonts)) {
            const fontValue = fetchedFonts[key];
            if (typeof fontValue === 'string') {
              transformedFonts[key] = { font: fontValue, weight: '400' };
            } else if (fontValue && typeof fontValue === 'object') {
              transformedFonts[key] = fontValue;
            } else {
              transformedFonts[key] = defaultFonts[key];
            }
          }

          setFontsState(transformedFonts);
          setInitialFontsState(transformedFonts);
        } else {
          setFontsState(defaultFonts);
          setInitialFontsState(defaultFonts);
        }
      })
      .catch((error) => {
        console.error('Error fetching fonts:', error);
        setFontsState(defaultFonts);
        setInitialFontsState(defaultFonts);
      });
  }, []);

  useEffect(() => {
    const fontsToImport = Object.values(fontsState)
      .filter(({ font }) => font)
      .map(({ font, weight }) => {
        return `family=${encodeURIComponent(font)}:wght@${weight}`;
      });

    if (fontsToImport.length > 0) {
      const uniqueFontsToImport = [...new Set(fontsToImport)];
      const googleFontsUrl = `https://fonts.googleapis.com/css2?${uniqueFontsToImport.join('&')}&display=swap`;

      // Create or update the link element
      let linkElement = document.getElementById('dynamic-fonts-import');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = 'dynamic-fonts-import';
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
      }
      linkElement.href = googleFontsUrl;
    }
  }, [fontsState]);

  const handleFontSelect = (categoryKey, font) => {
    setFontsState((prev) => ({
      ...prev,
      [categoryKey]: { ...prev[categoryKey], font },
    }));
  };

  const handleWeightSelect = (categoryKey, weight) => {
    setFontsState((prev) => ({
      ...prev,
      [categoryKey]: { ...prev[categoryKey], weight },
    }));
  };

  const handleSave = () => {
    axios
      .put(window.baseDomain + 'api/fonts/restaurantId123', fontsState)
      .then(() => {
        triggerNotification('Lettertypes aangepast', 'success');
        setInitialFontsState(fontsState);
      })
      .catch((error) => {
        console.error('Error saving fonts:', error);
        const errorCode = error.response?.status || 'unknown';
        triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
      });
  };

  const handleReset = () => {
    setFontsState(resetFonts);
    axios
      .put(window.baseDomain + 'api/fonts/restaurantId123', resetFonts)
      .then(() => {
        triggerNotification('Lettertypes gereset naar standaard', 'success');
        setInitialFontsState(resetFonts);
      })
      .catch((error) => {
        console.error('Error resetting fonts:', error);
        const errorCode = error.response?.status || 'unknown';
        triggerNotification(`Fout bij resetten. Code: ${errorCode}`, 'error');
      });
  };

  const isDirty = JSON.stringify(fontsState) !== JSON.stringify(initialFontsState);

  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  return (
    <div className="fonts-container">
      <NotificationComponent />
      {fontCategories.map(({ key, label }) => {
        const selectedFont = fontsState[key]?.font || defaultFonts[key].font;
        const selectedWeight = fontsState[key]?.weight || defaultFonts[key].weight;

        return (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <div className="font-selector">
              <select value={selectedFont} onChange={(e) => handleFontSelect(key, e.target.value)}>
                {availableFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <select value={selectedWeight} onChange={(e) => handleWeightSelect(key, e.target.value)}>
                {availableFontWeights.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="font-preview"
              style={{ fontFamily: `'${selectedFont}', sans-serif`, fontWeight: selectedWeight }}
            >
              Voorbeeld tekst in {selectedFont} ({selectedWeight})
            </div>
          </div>
        );
      })}
      
      <button type="button" className="submit-button reset-button" onClick={handleReset}>
        Reset naar Standaard
      </button>
      <button type="submit" className="submit-button" onClick={handleSave}>
        Opslaan
      </button>
    </div>
  );
});

export default Fonts;
