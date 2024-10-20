// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useApi from '../../../../Hooks/useApi';
import useNotification from '../../../../Components/Notification/index';
import { sansSerifFonts, serifFonts, fontWeights } from './fontsConfig';
import FontCategorySelector from './FontSelector';
import useDynamicFontLoader from '../../../../Hooks/useFontLoader';
import './css/fonts.css';

const Fonts = forwardRef((props, ref) => {
  const defaultFonts = {
    titleFont: { font: 'Poppins', weight: '400' },
    subtitleFont: { font: 'Poppins', weight: '400' },
    labelFont: { font: 'Poppins', weight: '400' },
    buttonFont: { font: 'Poppins', weight: '400' },
  };

  const resetFonts = defaultFonts;

  const [fontsState, setFontsState] = useState(defaultFonts);
  const [initialFontsState, setInitialFontsState] = useState(defaultFonts);
  const { triggerNotification, NotificationComponent } = useNotification();
  const api = useApi();

  const fontCategories = [
    { key: 'titleFont', label: 'Titel' },
    { key: 'subtitleFont', label: 'Subtitel' },
    { key: 'labelFont', label: 'Tekst' },
    { key: 'buttonFont', label: 'Knoppen' },
  ];

  const fontLabels = {
    Montserrat: '(populair)',
    Comfortaa: '(aanbevolen)',
  };

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const endpoint = `${window.baseDomain}api/fonts/`;
        const response = await api.get(endpoint);

        if (response && Object.keys(response).length > 0) {
          const fetchedFonts = response;
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
      } catch (error) {
        console.error('Error fetching fonts:', error);
        triggerNotification('Fout bij het ophalen van lettertypes.', 'error');
        setFontsState(defaultFonts);
        setInitialFontsState(defaultFonts);
      }
    };

    fetchFonts();
  }, [api]);

  useDynamicFontLoader(fontsState);

  const handleFontSelect = (categoryKey, font) => {
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

  const handleSave = async () => {
    try {
      const endpoint = `${window.baseDomain}api/fonts/`;
      await api.put(endpoint, fontsState);
      triggerNotification('Lettertypes aangepast', 'success');
      setInitialFontsState(fontsState);
    } catch (error) {
      console.error('Error saving fonts:', error);
      const errorCode = error.response?.status || 'unknown';
      triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
    }
  };

  const handleReset = async () => {
    try {
      const endpoint = `${window.baseDomain}api/fonts/`;
      await api.put(endpoint, resetFonts);
      setFontsState(resetFonts);
      triggerNotification('Lettertypes gereset naar standaard', 'success');
      setInitialFontsState(resetFonts);
    } catch (error) {
      console.error('Error resetting fonts:', error);
      const errorCode = error.response?.status || 'unknown';
      triggerNotification(`Fout bij resetten. Code: ${errorCode}`, 'error');
    }
  };

  const isDirty = JSON.stringify(fontsState) !== JSON.stringify(initialFontsState);

  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  return (
    <div className="fonts-container">
      <NotificationComponent />
      {fontCategories.map(({ key, label }) => (
        <FontCategorySelector
          key={key}
          categoryKey={key}
          label={label}
          fontsState={fontsState}
          defaultFonts={defaultFonts}
          handleFontSelect={handleFontSelect}
          handleWeightSelect={handleWeightSelect}
          sansSerifFonts={sansSerifFonts}
          serifFonts={serifFonts}
          fontLabels={fontLabels}
        />
      ))}

      <button type="button" className="button-style-3 reset-button" onClick={handleReset}>
        Reset naar Standaard
      </button>
      <button type="submit" className="button-style-3" onClick={handleSave} disabled={!isDirty}>
        Opslaan
      </button>
    </div>
  );
});

export default Fonts;
