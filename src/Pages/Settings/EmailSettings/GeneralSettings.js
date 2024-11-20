// src/components/EmailSettings/AlgemeenSettings.jsx

import React from 'react';

const GeneralSettings = ({ settings, handleChange, handleSave, isDirty }) => {
  return (
    <form className="settings-form" onSubmit={handleSave} noValidate>

	  <div className="form-group">
        <label>Naam Verstuurder</label>
        <div className="input-container">
          <input
            type="text"
            name="groetNaam"
            value={settings.groetNaam}
            onChange={handleChange}
            placeholder="Voer de groet naam in"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Antwoorden Doorsturen naar Email</label>
        <div className="input-container">
          <input
            type="email"
            name="antwoordEmail"
            value={settings.antwoordEmail}
            onChange={handleChange}
            placeholder="Voer het antwoord emailadres in"
            required
          />
        </div>
      </div>

      {/* Email Inhoud */}
      <div className="form-group">
        <label>Email Inhoud</label>
        <label className="label-small">
          Vanwege de GDPR zijn promoties verboden in dit soort mails*
        </label>
        <div className="input-container">
          <textarea
            name="emailInhoud"
            value={settings.emailInhoud}
            onChange={handleChange}
            placeholder="Voer de email inhoud in"
            required
          />
        </div>
      </div>


      {/* Toon Tabel */}
      <div className="form-group">
        <label>Reservatieoverzicht Tabel Weergave</label>
        <div className="input-container">
          <select
            name="toonTabel"
            value={settings.toonTabel}
            onChange={handleChange}
          >
            <option value="Toon tabel">Toon tabel</option>
            <option value="Zonder tabel">Zonder tabel</option>
          </select>
        </div>
      </div>

      {/* Reservatie Bewerken */}
      <div className="form-group">
        <label>Reservatie Bewerken</label>
        <div className="input-container">
          <select
            name="reservatieBewerken"
            value={settings.reservatieBewerken}
            onChange={handleChange}
          >
            <option value="Reservatie Bewerken Toestaan">
              Reservatie Bewerken Toestaan
            </option>
            <option value="Niet Toestaan om Reservatie te Bewerken">
              Niet Toestaan om Reservatie te Bewerken
            </option>
          </select>
        </div>
      </div>

      <button type="submit" className="settings-button" disabled={!isDirty}>
        Opslaan
      </button>
    </form>
  );
};

export default GeneralSettings;
