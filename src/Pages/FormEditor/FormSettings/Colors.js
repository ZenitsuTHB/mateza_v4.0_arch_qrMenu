// src/components/FormSettings/Colors.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import useNotification from '../../../Components/Notification/index';
import ColorPicker from './ColorPicker';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Colors = forwardRef((props, ref) => {
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultAppearanceData = {
    backgroundType: 'solid', // Default to solid background
    backgroundColor: '#FFFFFF',
    gradientStartColor: '#FFFFFF',
    gradientEndColor: '#000000',
    animationType: 'none',
    // ... other existing color settings
    widgetBackgroundColor: '#000000',
    widgetTextColor: '#FFFFFF',
    textColor: '#000000',
    containerColor: '#FFFFFF',
    buttonColor: '#000000',
    buttonTextColor: '#FFFFFF',
  };

  const [appearanceData, setAppearanceData] = useState(defaultAppearanceData);
  const [initialAppearanceData, setInitialAppearanceData] = useState(defaultAppearanceData);

  useEffect(() => {
    axios.get(`${window.baseDomain}api/colors/restaurantId123`)
      .then((response) => {
        if (response.data) {
          setAppearanceData(response.data);
          setInitialAppearanceData(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching colors:', error);
        setAppearanceData(defaultAppearanceData);
        setInitialAppearanceData(defaultAppearanceData);
      });
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

  const handleSave = () => {
    axios.put(`${window.baseDomain}api/colors/restaurantId123`, appearanceData)
      .then(() => {
        triggerNotification('Kleuren aangepast', 'success');
        setInitialAppearanceData(appearanceData);
      })
      .catch((error) => {
        console.error('Error saving colors:', error);
        const errorCode = error.response?.status || 'unknown';
        triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
      });
  };

  const isDirty = JSON.stringify(appearanceData) !== JSON.stringify(initialAppearanceData);

  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  const { backgroundType } = appearanceData;

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
          {/* Optionally, add inputs for gradient direction, etc. */}
        </>
      )}

      {backgroundType === 'animated' && (
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

      {/* Existing ColorPickers */}
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
      {/* Other existing color pickers */}
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
      >
        Opslaan
      </button>
    </div>
  );
});

export default Colors;
