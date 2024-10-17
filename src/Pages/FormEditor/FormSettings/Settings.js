// src/components/FormSettings/Settings.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import useNotification from '../../../Components/Notification/index.js';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';
import SettingsForm from './SettingsForm';
import ThemePreview from './ThemePreview';
import AlignmentSelector from './AlignmentSelector';

const Settings = forwardRef((props, ref) => {
  const defaultSettings = {
    pageTitle: 'Reserveer Nu',
    generalNotification: '',
    alignment: 'fullScreenColor', // Default alignment
  };

  const [formData, setFormData] = useState(defaultSettings);
  const [initialFormData, setInitialFormData] = useState(defaultSettings);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const { triggerNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    // Fetch settings data
    axios.get(`${window.baseDomain}api/settings/restaurantId123`)
      .then((response) => {
        if (response.data) {
          const data = response.data;
          const newFormData = {
            pageTitle: data.pageTitle || defaultSettings.pageTitle,
            generalNotification: data.generalNotification || '',
            alignment: data.alignment || defaultSettings.alignment,
          };
          setFormData(newFormData);
          setInitialFormData(newFormData);
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        setFormData(defaultSettings);
        setInitialFormData(defaultSettings);
      });

    // Fetch theme data
    axios.get(`${window.baseDomain}api/theme/restaurantId123`)
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

  const setAlignment = (alignmentValue) => {
    setFormData((prevData) => ({
      ...prevData,
      alignment: alignmentValue,
    }));
  };

  const handleSave = () => {
    axios.put(`${window.baseDomain}api/settings/restaurantId123`, formData)
      .then(() => {
        triggerNotification('Instellingen aangepast', 'success');
        setInitialFormData(formData);
      })
      .catch((error) => {
        console.error('Error saving settings:', error);
        const errorCode = error.response?.status || 'unknown';
        triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
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

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);

  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  return (
    <div>
      <NotificationComponent />

      <SettingsForm
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

      <AlignmentSelector
        alignment={formData.alignment}
        setAlignment={setAlignment}
      />

      <ThemePreview
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        triggerNotification={triggerNotification}
      />

      <button
        type="submit"
        className="submit-button"
        onClick={handleSave}
      >
        Opslaan
      </button>
    </div>
  );
});

export default Settings;
