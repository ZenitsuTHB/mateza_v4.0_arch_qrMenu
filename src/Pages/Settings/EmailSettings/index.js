// src/components/EmailSettings/EmailSettingsTabs.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import './css/emailSettings.css';
import { withHeader } from '../../../Components/Structural/Header';
import useNotification from '../../../Components/Notification';
import useApi from '../../../Hooks/useApi';
import AlgemeenSettings from './GeneralSettings';
import MeldingenSettings from './NotificationSettings';

const EmailSettingsTabs = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultSettings = {
    aanpassingenDoorKlant: 'Geen notificatie',
    annulatieDoorKlant: 'Geen notificatie',
    antwoordEmail: '',
    groetNaam: '',
    emailInhoud: '',
    toonTabel: 'Toon tabel',
    reservatieBewerken: 'Reservatie Bewerken Toestaan',
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('algemeen');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(window.baseDomain + 'api/email-settings', { noCache: true });
        const data = response || {};
        const mergedData = { ...defaultSettings, ...data };
        setSettings(mergedData);
        setInitialSettings(mergedData);
      } catch (err) {
        console.error('Error fetching email settings:', err);
        triggerNotification('Fout bij het ophalen van email instellingen.', 'error');
        setSettings(defaultSettings);
        setInitialSettings(defaultSettings);
      }
    };

    fetchSettings();
  }, [api]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(window.baseDomain + 'api/email-settings', settings);
      triggerNotification('Instellingen opgeslagen', 'success');
      setInitialSettings(settings);
    } catch (err) {
      console.error('Error saving email settings:', err);
      triggerNotification('Fout bij het opslaan', 'error');
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings]
  );

  const tabs = [
    { id: 'algemeen', label: 'Algemeen', title: 'Email' },
    { id: 'meldingen', label: 'Meldingen', title: 'Email' },
  ];

  const handleTabClick = (tabId, tabTitle) => {
    setActiveTab(tabId);
  };

  return (
    <div className="email-settings-page">
      <NotificationComponent />
      <h2 className="settings-title">
        {tabs.find((tab) => tab.id === activeTab).title}
      </h2>

      <div className="settings-tabs">
        <div className="tab-menu">
          <div className="buttons-container">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tab-label">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline-settings-tabs"
                    className="tab-underline"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'algemeen' && (
            <AlgemeenSettings
              settings={settings}
              handleChange={handleChange}
              handleSave={handleSave}
              isDirty={isDirty}
            />
          )}
          {activeTab === 'meldingen' && (
            <MeldingenSettings
              settings={settings}
              handleChange={handleChange}
              handleSave={handleSave}
              isDirty={isDirty}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default withHeader(EmailSettingsTabs);
