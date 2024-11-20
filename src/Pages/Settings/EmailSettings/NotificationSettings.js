// src/components/EmailSettings/NotificationSettings.jsx

import React from 'react';

const NotificationSettings = ({ settings, handleChange, handleSave, isDirty }) => {
  return (
    <form className="settings-form" onSubmit={handleSave} noValidate>
      {/* Bewerking door klant */}
      <div className="form-group">
        <label>Bewerking door klant</label>
        <div className="input-container">
          <select
            name="aanpassingenDoorKlant"
            value={settings.aanpassingenDoorKlant}
            onChange={handleChange}
          >
            <option value="Geen notificatie">Geen notificatie</option>
            <option value="email">Verwittigingsemail</option>
          </select>
        </div>
      </div>

      {/* Annulatie door klant */}
      <div className="form-group">
        <label>Annulatie door klant</label>
        <div className="input-container">
          <select
            name="annulatieDoorKlant"
            value={settings.annulatieDoorKlant}
            onChange={handleChange}
          >
            <option value="Geen notificatie">Geen notificatie</option>
            <option value="email">Verwittigingsemail</option>
          </select>
        </div>
      </div>

      <button type="submit" className="settings-button" disabled={!isDirty}>
        Opslaan
      </button>
    </form>
  );
};

export default NotificationSettings;
