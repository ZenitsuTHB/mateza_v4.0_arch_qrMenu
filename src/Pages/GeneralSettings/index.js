import React, { useState } from 'react';
import './css/generalSettings.css';

const Settings = () => {
  // State variables for the initial settings
  const [zitplaatsen, setZitplaatsen] = useState(0);
  const [uurOpVoorhand, setUurOpVoorhand] = useState(0);
  const [dagenInToekomst, setDagenInToekomst] = useState(0);
  const [maxGasten, setMaxGasten] = useState(0);
  const [duurReservatie, setDuurReservatie] = useState(0);

  // State variables for the notification settings
  const notificationOptions = ['Geen notificatie', 'Email', 'Email & online platform'];

  const [reservatiesSettings, setReservatiesSettings] = useState({
    'Nieuwe reservaties': 'Email',
    'Nieuwe onbevestigde reservaties': 'Email',
    'Aanpassingen door klant': 'Email',
    'Bericht van de klant': 'Email',
    'Annulatie door klant': 'Email',
  });

  const [beoordelingenSetting, setBeoordelingenSetting] = useState('Mobiele app');

  const handleReservatiesChange = (label, value) => {
    setReservatiesSettings((prevSettings) => ({
      ...prevSettings,
      [label]: value,
    }));
  };

  const handleSave = () => {
    // Implement save functionality here
    alert('Settings saved!');
  };

  return (
    <div className="settings-container">
      <h1>Instellingen</h1>
      <div className="settings-section">
        <label>Zitplaatsen</label>
        <input
          type="number"
          value={zitplaatsen}
          onChange={(e) => setZitplaatsen(e.target.value)}
        />

        <label>Hoeveel uur op voorhand</label>
        <input
          type="number"
          value={uurOpVoorhand}
          onChange={(e) => setUurOpVoorhand(e.target.value)}
        />

        <label>Hoeveel dagen in de toekomst</label>
        <input
          type="number"
          value={dagenInToekomst}
          onChange={(e) => setDagenInToekomst(e.target.value)}
        />

        <label>Max gasten online boeking</label>
        <input
          type="number"
          value={maxGasten}
          onChange={(e) => setMaxGasten(e.target.value)}
        />

        <label>Duur reservatie</label>
        <input
          type="number"
          value={duurReservatie}
          onChange={(e) => setDuurReservatie(e.target.value)}
        />
      </div>

      <section className="notification-settings">
        <h2>
          <i className="bell-icon"></i> Instellingen Notificaties
        </h2>

        <div className="section">
          <h3>Reservaties</h3>
          {Object.keys(reservatiesSettings).map((label) => (
            <div className="row" key={label}>
              <label>{label}</label>
              <select
                value={reservatiesSettings[label]}
                onChange={(e) => handleReservatiesChange(label, e.target.value)}
              >
                {notificationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Beoordelingen</h3>
          <div className="row">
            <label>Nieuwe beoordelingen van klant</label>
            <select
              value={beoordelingenSetting}
              onChange={(e) => setBeoordelingenSetting(e.target.value)}
            >
              <option value="Mobiele app">Mobiele app</option>
              {/* Add more options if needed */}
            </select>
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>
          Opslaan
        </button>
      </section>
    </div>
  );
};

export default Settings;
