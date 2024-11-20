import React, { useState } from 'react';
import './css/generalSettings.css';
import { withHeader } from '../../Components/Structural/Header';

const Settings = () => {
  // State variables for the initial settings
  const [zitplaatsen, setZitplaatsen] = useState(0);
  const [uurOpVoorhand, setUurOpVoorhand] = useState(0);
  const [dagenInToekomst, setDagenInToekomst] = useState(0);
  const [maxGasten, setMaxGasten] = useState(0);
  const [duurReservatie, setDuurReservatie] = useState(0);

  const handleSave = (e) => {
    e.preventDefault();
    // Implement save functionality here
    alert('Instellingen opgeslagen!');
  };

  return (
    <div className="general-settings-page">
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
                value={zitplaatsen}
                onChange={(e) => setZitplaatsen(e.target.value)}
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
                value={uurOpVoorhand}
                onChange={(e) => setUurOpVoorhand(e.target.value)}
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
                value={dagenInToekomst}
                onChange={(e) => setDagenInToekomst(e.target.value)}
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
                value={maxGasten}
                onChange={(e) => setMaxGasten(e.target.value)}
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
                value={duurReservatie}
                onChange={(e) => setDuurReservatie(e.target.value)}
              />
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

export default withHeader(Settings);
