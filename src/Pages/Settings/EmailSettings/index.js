import React, { useState } from 'react';
import './css/emailSettings.css';
import { withHeader } from '../../../Components/Structural/Header';

const EmailSettings = () => {
  // State variables for email notification settings
  const [aanpassingenDoorKlant, setAanpassingenDoorKlant] = useState('Geen notificatie');
  const [annulatieDoorKlant, setAnnulatieDoorKlant] = useState('Geen notificatie');

  const handleSave = (e) => {
    e.preventDefault();
    // Implement save functionality here
    alert('Email instellingen opgeslagen!');
  };

  return (
    <div className="email-settings-page">
      <h2 className="settings-title">Beheer Email</h2>
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSave} noValidate>

          <div className="form-group">
            <label>Bewerking door klant</label>
            <div className="input-container">
              <select
                name="aanpassingenDoorKlant"
                value={aanpassingenDoorKlant}
                onChange={(e) => setAanpassingenDoorKlant(e.target.value)}
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
                value={annulatieDoorKlant}
                onChange={(e) => setAnnulatieDoorKlant(e.target.value)}
              >
                <option value="Geen notificatie">Geen notificatie</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <button type="submit" className="settings-button">
            Opslaan
          </button>
        </form>
      </div>
    </div>
  );
};

export default withHeader(EmailSettings);
