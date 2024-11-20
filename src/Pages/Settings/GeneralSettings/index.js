import React, { useState, useEffect, useMemo } from 'react';
import './css/generalSettings.css';
import { withHeader } from '../../../Components/Structural/Header';
import useApi from '../../../Hooks/useApi';
import useNotification from '../../../Components/Notification';

const Settings = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultSettings = {
    zitplaatsen: 0,
    uurOpVoorhand: 0,
    dagenInToekomst: 0,
    maxGasten: 0,
    duurReservatie: 0,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(window.baseDomain + 'api/general-settings', { noCache: true });
        const data = response || {};
        const mergedData = { ...defaultSettings, ...data };
        setSettings(mergedData);
        setInitialSettings(mergedData);
      } catch (err) {
        console.error('Error fetching general settings:', err);
        triggerNotification('Fout bij het ophalen van instellingen.', 'error');
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
      await api.put(window.baseDomain + 'api/general-settings', settings);
      triggerNotification('Instellingen opgeslagen!', 'success');
      setInitialSettings(settings);
    } catch (err) {
      console.error('Error saving general settings:', err);
      triggerNotification('Fout bij het opslaan van instellingen.', 'error');
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
    <div className="general-settings-page">
      <NotificationComponent />
      <h2 className="settings-title">Beheer Reservaties</h2>
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSave} noValidate>
          <div className="form-group">
            <label>Aantal Zitplaatsen</label>
            <div className="input-container">
              <input
                type="number"
                name="zitplaatsen"
                placeholder="Zitplaatsen"
                value={settings.zitplaatsen}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Min. Uren op Voorhand te Reserveren</label>
            <div className="input-container">
              <input
                type="number"
                name="uurOpVoorhand"
                placeholder="Hoeveel uur op voorhand"
                value={settings.uurOpVoorhand}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Max. Aantal Dagen in de Toekomst te Reserveren</label>
            <div className="input-container">
              <input
                type="number"
                name="dagenInToekomst"
                placeholder="Hoeveel dagen in de toekomst"
                value={settings.dagenInToekomst}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Max. Aantal gasten online boeking</label>
            <div className="input-container">
              <input
                type="number"
                name="maxGasten"
                placeholder="Max gasten online boeking"
                value={settings.maxGasten}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duur Reservatie (min)</label>
            <div className="input-container">
              <input
                type="number"
                name="duurReservatie"
                placeholder="Duur reservatie"
                value={settings.duurReservatie}
                onChange={handleChange}
              />
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

export default withHeader(Settings);
