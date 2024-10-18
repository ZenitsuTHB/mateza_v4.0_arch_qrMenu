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
  const [error, setError] = useState(null);

  const api = useApi();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const data = await api.get(`${window.baseDomain}api/colors/${window.restaurantId}`);
        setAppearanceData(data);
        setInitialAppearanceData(data);
      } catch (err) {
        console.error('Error fetching colors:', err);
        setAppearanceData(defaultAppearanceData);
        setInitialAppearanceData(defaultAppearanceData);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

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

  if (error) {
    return <div>Error fetching colors. Please try again later.</div>;
  }

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
        className="submit-button"
        onClick={handleSave}
        disabled={!isDirty}
      >
        Opslaan
      </button>
    </div>
  );
});

export default Colors;
