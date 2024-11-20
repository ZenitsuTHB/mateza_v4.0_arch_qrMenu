import React from 'react';

const GeneralSettings = ({ settings, handleChange, handleSave, isDirty }) => {
  // Default options for Start Greeting
  const startGreetingOptions = [
    'Dag',
    'Hallo',
    'Hey',
    'Beste',
    'Geachte',
  ];

  // Default options for End Greeting
  const endGreetingOptions = [
    'Met vriendelijke groeten,',
    'Hartelijk bedankt,',
    'Tot snel!',
    'Warme groeten,',
  ];

  // Check if the current startGreeting is among the default options
  const isStartGreetingInOptions = startGreetingOptions.includes(
    settings.startGreeting
  );

  // Check if the current endGreeting is among the default options
  const isEndGreetingInOptions = endGreetingOptions.includes(
    settings.endGreeting
  );

  return (
    <form className="settings-form" onSubmit={handleSave} noValidate>
      {/* Naam Verstuurder */}
      <div className="form-group">
        <label>Naam</label>
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

      {/* Antwoorden Doorsturen naar Email */}
      <div className="form-group">
        <label>Reply Antwoorden Naar</label>
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

      {/* Startgroet */}
      <div className="form-group">
        <label>Startgroet</label>
        <div className="input-container">
          <select
            name="startGreeting"
            value={settings.startGreeting}
            onChange={handleChange}
            required
          >
            {startGreetingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {!isStartGreetingInOptions && (
              <option value={settings.startGreeting}>
                {settings.startGreeting}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Email Inhoud */}
      <div className="form-group">
        <label>Email Inhoud</label>
        <br></br>
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

      {/* Eindgroet */}
      <div className="form-group">
        <label>Eindgroet</label>
        <div className="input-container">
          <select
            name="endGreeting"
            value={settings.endGreeting}
            onChange={handleChange}
            required
          >
            {endGreetingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {!isEndGreetingInOptions && (
              <option value={settings.endGreeting}>
                {settings.endGreeting}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Reservatieoverzicht Tabel Weergave */}
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

      {/* Opslaan Button */}
      <button type="submit" className="settings-button" disabled={!isDirty}>
        Opslaan
      </button>
    </form>
  );
};

export default GeneralSettings;
