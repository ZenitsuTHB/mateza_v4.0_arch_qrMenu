// src/components/FormSettings/Settings.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import useNotification from '../../../../Components/Notification/index.js';
import useApi from '../../../../Hooks/useApi.js';
import SettingsForm from './SettingsForm.js';
import ThemePreview from './ThemePreview.js';
import AlignmentSelector from './AlignmentSelector.js';
import '../../css/FormSettings/formSettings.css';
import '../../css/FormSettings/mobile.css';

const Settings = forwardRef((props, ref) => {
  const defaultSettings = {
    pageTitle: 'Reserveer Nu',
    generalNotification: '',
    alignment: 'fullScreenColor',
  };

  const [formData, setFormData] = useState(defaultSettings);
  const [initialFormData, setInitialFormData] = useState(defaultSettings);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const { triggerNotification, NotificationComponent } = useNotification();
  const api = useApi();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsResponse = await api.get(`${window.baseDomain}api/settings/`);
        if (settingsResponse) {
          const data = settingsResponse;
          const newFormData = {
            pageTitle: data.pageTitle || defaultSettings.pageTitle,
            generalNotification: data.generalNotification || '',
            alignment: data.alignment || defaultSettings.alignment,
          };
          setFormData(newFormData);
          setInitialFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setFormData(defaultSettings);
        setInitialFormData(defaultSettings);
      }
    };

    const fetchTheme = async () => {
      try {
        const themeResponse = await api.get(`${window.baseDomain}api/theme/`);
        setSelectedTheme(themeResponse);
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchSettings();
    fetchTheme();
  }, [api]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const setAlignment = useCallback((alignmentValue) => {
    setFormData((prevData) => ({
      ...prevData,
      alignment: alignmentValue,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await api.put(`${window.baseDomain}api/settings/`, formData);
      triggerNotification('Instellingen aangepast', 'success');
      setInitialFormData(formData);
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorCode = error.response?.status || 'unknown';
      triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
    }
  }, [api, formData, triggerNotification]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'pageTitle' && value.trim() === '') {
      setFormData((prevData) => ({
        ...prevData,
        pageTitle: 'Reserveer Nu',
      }));
    }
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialFormData),
    [formData, initialFormData]
  );

  useImperativeHandle(
    ref,
    () => ({
      isDirty,
    }),
    [isDirty]
  );

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

export default Settings;
