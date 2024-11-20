// src/components/FormSettings/EmailSettings.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import './css/emailSettings.css';
import { motion } from 'framer-motion';
import { withHeader } from '../../../Components/Structural/Header';
import useNotification from '../../../Components/Notification';
import useApi from '../../../Hooks/useApi';
import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';

const EmailSettings = () => {
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
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('algemeen');
  const [pendingTab, setPendingTab] = useState(null);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  const algemeenRef = useRef();
  const meldingenRef = useRef();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/email-settings`, { noCache: true });
        const data = response || {};
        const mergedData = { ...defaultSettings, ...data };
        setSettings(mergedData);
        setInitialSettings(mergedData);
      } catch (err) {
        console.error('Error fetching email settings:', err);
        triggerNotification('Fout bij het ophalen van email instellingen.', 'error');
        setSettings(defaultSettings);
        setInitialSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [api, triggerNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`${window.baseDomain}api/email-settings`, settings);
      triggerNotification('Instellingen opgeslagen', 'success');
      setInitialSettings(settings);
      return true;
    } catch (err) {
      console.error('Error saving email settings:', err);
      triggerNotification('Fout bij het opslaan', 'error');
      return false;
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings]
  );

  const handleTabClick = async (tabId) => {
    if (isDirty) {
      setPendingTab(tabId);
      setShowUnsavedChangesModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleConfirmDiscardChanges = () => {
    setShowUnsavedChangesModal(false);
    setActiveTab(pendingTab);
    setPendingTab(null);
    // Optionally, reset settings or keep unsaved changes
  };

  const handleSaveAndSwitchTab = async () => {
    const success = await handleSave();
    if (success) {
      setShowUnsavedChangesModal(false);
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleCancelTabChange = () => {
    setShowUnsavedChangesModal(false);
    setPendingTab(null);
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loader component
  }

  return (
    <div className="email-settings-page">
      <NotificationComponent />
      <h2 className="settings-title">Beheer Email</h2>
      <div className="settings-container">
        <div className="settings-tabs">
          <div className="tab-menu">
            <div className="buttons-container">
              <motion.button
                type="button"
                className={`tab-button ${activeTab === 'algemeen' ? 'active' : ''}`}
                onClick={() => handleTabClick('algemeen')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tab-label">Algemeen</span>
                {activeTab === 'algemeen' && (
                  <motion.div
                    layoutId="underline-settings-tabs"
                    className="tab-underline"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
              <motion.button
                type="button"
                className={`tab-button ${activeTab === 'meldingen' ? 'active' : ''}`}
                onClick={() => handleTabClick('meldingen')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tab-label">Meldingen</span>
                {activeTab === 'meldingen' && (
                  <motion.div
                    layoutId="underline-settings-tabs"
                    className="tab-underline"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === 'algemeen' && (
              <GeneralSettings
                ref={algemeenRef}
                settings={settings}
                handleChange={handleChange}
              />
            )}
            {activeTab === 'meldingen' && (
              <NotificationSettings
                ref={meldingenRef}
                settings={settings}
                handleChange={handleChange}
              />
            )}
          </div>
        </div>

        <button type="button" className="settings-button" onClick={handleSave} disabled={!isDirty}>
          Opslaan
        </button>
      </div>

      {showUnsavedChangesModal && (
        <div className="modal unsaved-changes-modal">
          <div className="modal-content">
            <h2 className='secondary-title'>Wijzigingen Niet Opgeslagen</h2>
            <p>Wilt doorgaan zonder op te slaan?</p>
            <div className="modal-buttons">
              <button type="button" className="button cancel-button" onClick={handleCancelTabChange}>Annuleren</button>
              <button type="button" className="button save-and-switch-button" onClick={handleSaveAndSwitchTab}>Opslaan en doorgaan</button>
              <button type="button" className="button discard-button red" onClick={handleConfirmDiscardChanges}>Doorgaan zonder op te slaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withHeader(EmailSettings);
