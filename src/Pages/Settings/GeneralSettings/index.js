import React, { useState, useEffect, useMemo } from 'react';
import './css/generalSettings.css';
import { withHeader } from '../../../Components/Structural/Header';
import useApi from '../../../Hooks/useApi';
import useNotification from '../../../Components/Notification';
import { FaInfoCircle } from 'react-icons/fa'; // Import the info icon

const Settings = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultSettings = {
    zitplaatsen: 0,
    uurOpVoorhand: 0,
    dagenInToekomst: 0,
    maxGasten: 0,
    intervalReservatie: 0,
    showNoticeForMaxGuests: 'Nee', // New field
    noticePhoneNumber: '',         // New field
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [initialSettings, setInitialSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(window.baseDomain + 'api/general-settings', { noCache: true });
        const data = response || {};

        // Ensure intervalReservatie is a number
        const mergedData = { 
          ...defaultSettings, 
          ...data,
          dagenInToekomst: data.dagenInToekomst !== undefined ? Number(data.dagenInToekomst) : defaultSettings.dagenInToekomst,
          intervalReservatie: data.intervalReservatie !== undefined ? Number(data.intervalReservatie) : defaultSettings.intervalReservatie,
        };

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
    let parsedValue = value;

    if (name === 'intervalReservatie' || 'dagenInToekomst') {
      parsedValue = value === '' ? '' : Number(value);
      if (isNaN(parsedValue)) {
        parsedValue = 0; // Default or handle as needed
      }
    }


    setSettings((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(window.baseDomain + 'api/general-settings', settings);
      triggerNotification('Instellingen opgeslagen', 'success');
      setInitialSettings(settings);
    } catch (err) {
      console.error('Error saving general settings:', err);
      triggerNotification('Fout bij het opslaan', 'error');
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings]
  );

  return (
    <div className="general-settings-page">
      <NotificationComponent />
      <h2 className="settings-title">Beheer Reservaties</h2>
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSave} noValidate>
          {/* Aantal Zitplaatsen */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Aantal Zitplaatsen</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het maximum aantal gasten die kunnen boeken in uw restaurant indien geen uitzondering van toepassing is.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="zitplaatsen"
                placeholder="Zitplaatsen"
                value={settings.zitplaatsen}
                onChange={handleChange}
                min="0"
                max="10000"
              />
            </div>
          </div>

          {/* Min. Uren op Voorhand te Reserveren */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Min. Uren op Voorhand te Reserveren</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het minimum aantal uren dat klanten vooraf moeten reserveren.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="uurOpVoorhand"
                placeholder="Hoeveel uur op voorhand"
                value={settings.uurOpVoorhand}
                onChange={handleChange}
                min="0"
                max="400"
              />
            </div>
          </div>

          {/* Max. Aantal Dagen in de Toekomst te Reserveren */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Max. Aantal Dagen in de Toekomst te Reserveren</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het maximale aantal dagen in de toekomst tot wanneer klanten kunnen reserveren.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="dagenInToekomst"
                placeholder="Hoeveel dagen in de toekomst"
                value={settings.dagenInToekomst}
                onChange={handleChange}
                min="0"
                max="400"
              />
            </div>
          </div>

          {/* Duur Reservatie (min) */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Interval Reservatie (min)</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het interval tussen reservaties.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="intervalReservatie"
                placeholder="Duur reservatie"
                value={settings.intervalReservatie}
                onChange={handleChange}
                min="5"
                max="10000"
                step="1"
              />
            </div>
          </div>

          {/* Max. Aantal Gasten per Online Boeking */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Max. Aantal Gasten per Online Boeking</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Het maximale aantal gasten per online reservering.
                </div>
              </div>
            </div>
            <div className="input-container">
              <input
                type="number"
                name="maxGasten"
                placeholder="Max gasten online boeking"
                value={settings.maxGasten}
                onChange={handleChange}
                min="0"
                max="1000"
                step="1"
              />
            </div>
          </div>

          {/* Show Notice for Exceeding Max Guests */}
          <div className="form-group">
            <div className="label-with-tooltip">
              <label>Vraag om te Bellen bij Meer Gasten</label>
              <div className="button-with-tooltip">
                <FaInfoCircle />
                <div className="tooltip">
                  Wanneer iemand een groter aantal gasten kiest dan bepaald in het bovenstaande veld kan u vragen om te bellen.
                </div>
              </div>
            </div>
            <div className="input-container">
              <select
                name="showNoticeForMaxGuests"
                value={settings.showNoticeForMaxGuests}
                onChange={handleChange}
              >
                <option value="Ja">Ja</option>
                <option value="Nee">Nee</option>
              </select>
            </div>
          </div>

          {settings.showNoticeForMaxGuests === 'Ja' && (
            <div className="form-group">
              <div className="label-with-tooltip">
                <label>Telefoonnummer</label>
                <div className="button-with-tooltip">
                  <FaInfoCircle />
                  <div className="tooltip">
                    Het telefoonnummer dat wordt getoond in de melding die vraagt om te bellen voor uitgebreidere reservaties.
                  </div>
                </div>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="noticePhoneNumber"
                  placeholder="Telefoonnummer"
                  value={settings.noticePhoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button type="submit" className="settings-button" disabled={!isDirty}>
            Opslaan
          </button>
        </form>
      </div>
    </div>
  );
};

export default withHeader(Settings);
