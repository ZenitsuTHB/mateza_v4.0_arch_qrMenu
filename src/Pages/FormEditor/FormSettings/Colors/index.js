// src/components/FormSettings/Colors.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useNotification from '../../../../Components/Notification/index';
import ColorPicker from './ColorPicker';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import useApi from '../../../../Hooks/useApi.js';
import '../../css/FormSettings/formSettings.css';
import '../../css/FormSettings/mobile.css';

const Colors = forwardRef((props, ref) => {
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultAppearanceData = {
    backgroundType: 'solid',
    backgroundColor: '#FFFFFF',
    gradientStartColor: '#FFFFFF',
    gradientEndColor: '#000000',
    animationType: 'none',
    widgetBackgroundColor: '#000000',
    widgetTextColor: '#FFFFFF',
    textColor: '#000000',
    containerColor: '#FFFFFF',
    buttonColor: '#000000',
    buttonTextColor: '#FFFFFF',
  };

  const [appearanceData, setAppearanceData] = useState(defaultAppearanceData);
  const [initialAppearanceData, setInitialAppearanceData] = useState(defaultAppearanceData);
  const [loading, setLoading] = useState(true);
  // Removed the error state as it's no longer used for rendering

  const api = useApi();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/colors/${window.restaurantId}`);
        const data = response || {};

        // Merge fetched data with defaults to ensure all fields are present
        const mergedData = { ...defaultAppearanceData, ...data };

        // Optionally, log if any fields are missing in the fetched data
        const missingFields = Object.keys(defaultAppearanceData).filter(
          (key) => !(key in data)
        );
        if (missingFields.length > 0) {
          console.warn('Missing color fields from server response:', missingFields);
        }

        setAppearanceData(mergedData);
        setInitialAppearanceData(mergedData);
      } catch (err) {
        console.error('Error fetching colors:', err);
        // Set to default data in case of error
        setAppearanceData(defaultAppearanceData);
        setInitialAppearanceData(defaultAppearanceData);
        // Optionally, you can trigger a notification if you want to inform the user silently
        // triggerNotification('Failed to load colors. Using default settings.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [api]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppearanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBackgroundTypeChange = (backgroundType) => {
    setAppearanceData((prevData) => ({
      ...prevData,
      backgroundType,
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`${window.baseDomain}api/colors/${window.restaurantId}`, appearanceData);
      triggerNotification('Kleuren aangepast', 'success');
      setInitialAppearanceData(appearanceData);
    } catch (err) {
      console.error('Error saving colors:', err);
      const errorCode = err.response?.status || 'unknown';
      triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
    }
  };

  const isDirty = JSON.stringify(appearanceData) !== JSON.stringify(initialAppearanceData);

  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  const { backgroundType } = appearanceData;

  if (loading) {
    return <div>Loading...</div>;
  }

  // Removed the error message rendering
  // Always render the form, prefilled with either fetched or default data

  return (
    <div className="colors-container">
      <NotificationComponent />

      <BackgroundTypeSelector
        backgroundType={backgroundType}
        setBackgroundType={handleBackgroundTypeChange}
      />

      {backgroundType === 'solid' && (
        <ColorPicker
          label="Achtergrondkleur"
          name="backgroundColor"
          value={appearanceData.backgroundColor}
          onChange={handleChange}
        />
      )}

      {backgroundType === 'gradient' && (
        <>
          <ColorPicker
            label="Gradient Startkleur"
            name="gradientStartColor"
            value={appearanceData.gradientStartColor}
            onChange={handleChange}
          />
          <ColorPicker
            label="Gradient Eindkleur"
            name="gradientEndColor"
            value={appearanceData.gradientEndColor}
            onChange={handleChange}
          />
        </>
      )}

      <ColorPicker
        label="Widget Achtergrondkleur"
        name="widgetBackgroundColor"
        value={appearanceData.widgetBackgroundColor}
        onChange={handleChange}
      />
      <ColorPicker
        label="Widget Tekstkleur"
        name="widgetTextColor"
        value={appearanceData.widgetTextColor}
        onChange={handleChange}
      />

      <ColorPicker
        label="Tekstkleur"
        name="textColor"
        value={appearanceData.textColor}
        onChange={handleChange}
      />
      <ColorPicker
        label="Containerkleur"
        name="containerColor"
        value={appearanceData.containerColor}
        onChange={handleChange}
      />

      <ColorPicker
        label="Knopkleur"
        name="buttonColor"
        value={appearanceData.buttonColor}
        onChange={handleChange}
      />
      <ColorPicker
        label="Knoptekst kleur"
        name="buttonTextColor"
        value={appearanceData.buttonTextColor}
        onChange={handleChange}
      />

      <button
        type="button"
        className="button-style-3"
        onClick={handleSave}
        disabled={!isDirty}
      >
        Opslaan
      </button>
    </div>
  );
});

export default Colors;
