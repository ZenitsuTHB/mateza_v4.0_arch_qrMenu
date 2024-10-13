// src/components/NewReservation/NewReservation.jsx

import React, { useState } from 'react';
import './css/newReservation.css';
import './css/mobile.css';

const NewReservation = () => {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    telefoonnummer: '',
    datum: '',
    tijd: '',
    aantalPersonen: '',
    opmerkingen: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For aantalPersonen, ensure only numbers are entered
    if (name === 'aantalPersonen') {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Reserveringsgegevens:', formData);
    alert('Reservering succesvol gemaakt!');
    // Reset form
    setFormData({
      naam: '',
      email: '',
      telefoonnummer: '',
      datum: '',
      tijd: '',
      aantalPersonen: '',
      opmerkingen: '',
    });
  };

  return (
    <div className="new-reservation-page">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <h2>Nieuwe Reservering</h2>

        <div className="form-group">
          <label htmlFor="naam">Naam:</label>
          <input
            type="text"
            id="naam"
            name="naam"
            value={formData.naam}
            onChange={handleChange}
            required
            placeholder="Uw naam"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Uw e-mailadres"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefoonnummer">Telefoonnummer:</label>
          <input
            type="tel"
            id="telefoonnummer"
            name="telefoonnummer"
            value={formData.telefoonnummer}
            onChange={handleChange}
            required
            placeholder="Uw telefoonnummer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="datum">Datum:</label>
          <input
            type="date"
            id="datum"
            name="datum"
            value={formData.datum}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tijd">Tijd:</label>
          <input
            type="time"
            id="tijd"
            name="tijd"
            value={formData.tijd}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="aantalPersonen">Aantal Personen:</label>
          <input
            type="number"
            id="aantalPersonen"
            name="aantalPersonen"
            value={formData.aantalPersonen}
            onChange={handleChange}
            required
            min="1"
            placeholder="Bijvoorbeeld: 4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="opmerkingen">Opmerkingen:</label>
          <textarea
            id="opmerkingen"
            name="opmerkingen"
            value={formData.opmerkingen}
            onChange={handleChange}
            placeholder="Eventuele opmerkingen of speciale verzoeken"
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Reserveren
        </button>
      </form>
    </div>
  );
};

export default NewReservation;
