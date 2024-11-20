import React, { useState, useEffect, useMemo } from 'react';
import './css/emailSettings.css';
import { withHeader } from '../../../Components/Structural/Header';
import useNotification from '../../../Components/Notification';
import useApi from '../../../Hooks/useApi';

const EmailSettings = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultSettings = {
    aanpassingenDoorKlant: 'Geen notificatie',
    annulatieDoorKlant: 'Geen notificatie',
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
      triggerNotification('Email instellingen opgeslagen!', 'success');
      setInitialSettings(settings);
    } catch (err) {
      console.error('Error saving email settings:', err);
      triggerNotification('Fout bij het opslaan van email instellingen.', 'error');
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="email-settings-page">
      <NotificationComponent />
      <h2 className="settings-title">Beheer Email</h2>
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSave} noValidate>
          <div className="form-group">
            <label>Bewerking door klant</label>
            <div className="input-container">
              <select
                name="aanpassingenDoorKlant"
                value={settings.aanpassingenDoorKlant}
                onChange={handleChange}
              >
                <option value="Geen notificatie">Geen notificatie</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Annulatie door klant</label>
            <div className="input-container">
              <select
                name="annulatieDoorKlant"
                value={settings.annulatieDoorKlant}
                onChange={handleChange}
              >
                <option value="Geen notificatie">Geen notificatie</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <button type="submit" className="settings-button" disabled={!isDirty}>
            Opslaan
          </button>
        </form>
      </div>
    </div>
  );
};

export default withHeader(EmailSettings);
