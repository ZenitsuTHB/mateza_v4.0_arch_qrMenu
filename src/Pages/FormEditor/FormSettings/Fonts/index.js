// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import useNotification from '../../../../Components/Notification/index';
import '../../css/FormSettings/formSettings.css';
import '../../css/FormSettings/mobile.css';
import { sansSerifFonts, serifFonts, fontWeights } from './fontsConfig';

const Fonts = forwardRef((props, ref) => {
  const defaultFonts = {
    titleFont: { font: 'Poppins', weight: '400' },
    subtitleFont: { font: 'Poppins', weight: '400' },
    labelFont: { font: 'Poppins', weight: '400' },
    buttonFont: { font: 'Poppins', weight: '400' },
  };

  // Reset fonts are now the same as defaultFonts
  const resetFonts = defaultFonts;

  const [fontsState, setFontsState] = useState(defaultFonts);
  const [initialFontsState, setInitialFontsState] = useState(defaultFonts);
  const { triggerNotification, NotificationComponent } = useNotification();

  const fontCategories = [
    { key: 'titleFont', label: 'Titel' },
    { key: 'subtitleFont', label: 'Subtitel' },
    { key: 'labelFont', label: 'Tekst' },
    { key: 'buttonFont', label: 'Knoppen' },
  ];

  const fontLabels = {
    'Montserrat': '(populair)',
    'Comfortaa': '(aanbevolen)',
  };

  useEffect(() => {
    axios
      .get(`${window.baseDomain}api/fonts/` + window.restaurantId)
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
    // Collect all fonts and weights used to import them
    const fontWeightMap = {};

    Object.values(fontsState)
      .filter(({ font }) => font)
      .forEach(({ font, weight }) => {
        if (!fontWeightMap[font]) {
          fontWeightMap[font] = new Set();
        }
        fontWeightMap[font].add(weight);
      });

    const fontsToImport = Object.entries(fontWeightMap).map(([font, weightsSet]) => {
      const weightsArray = Array.from(weightsSet);
      return `family=${encodeURIComponent(font)}:wght@${weightsArray.join(';')}`;
    });

    if (fontsToImport.length > 0) {
      const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontsToImport.join('&')}&display=swap`;

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
    // Reset the weight to default if the current weight is not available for the new font
    const availableWeights = fontWeights[font] || ['400'];
    const currentWeight = fontsState[categoryKey]?.weight || '400';
    const newWeight = availableWeights.includes(currentWeight) ? currentWeight : availableWeights[0];

    setFontsState((prev) => ({
      ...prev,
      [categoryKey]: { font: font, weight: newWeight },
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
      .put(`${window.baseDomain}api/fonts/` + window.restaurantId, fontsState)
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
      .put(`${window.baseDomain}api/fonts/` + window.restaurantId, resetFonts)
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

        const availableWeights = fontWeights[selectedFont] || ['400'];

        return (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <div className="font-selector">
              <select value={selectedFont} onChange={(e) => handleFontSelect(key, e.target.value)}>
                <optgroup label="Modern">
                  {sansSerifFonts.map((font) => (
                    <option key={font} value={font}>
                      {font} {fontLabels[font] || ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Klassiek">
                  {serifFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </optgroup>
              </select>
              <select value={selectedWeight} onChange={(e) => handleWeightSelect(key, e.target.value)}>
                {availableWeights.map((weight) => (
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
