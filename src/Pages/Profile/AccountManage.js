// src/components/Profile/AccountManage.jsx

import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaHome, FaCity, FaMapPin } from 'react-icons/fa';
import useNotification from '../../Components/Notification';
import './css/accountManage.css';

const AccountManage = () => {
  const { triggerNotification, NotificationComponent } = useNotification();

  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    telefoonnummer: '',
    straat: '',
    huisnummer: '',
    stad: '',
    postcode: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load saved account data from localStorage or another source
    const savedData = localStorage.getItem('accountData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: '' });
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.voornaam.trim()) {
      newErrors.voornaam = 'Voornaam is verplicht.';
    }

    if (!formData.achternaam.trim()) {
      newErrors.achternaam = 'Achternaam is verplicht.';
    }

    if (!formData.telefoonnummer.trim()) {
      newErrors.telefoonnummer = 'Telefoonnummer is verplicht.';
    } else if (!/^\+?\d{10,15}$/.test(formData.telefoonnummer)) {
      newErrors.telefoonnummer = 'Voer een geldig telefoonnummer in.';
    }

    if (!formData.straat.trim()) {
      newErrors.straat = 'Straat is verplicht.';
    }

    if (!formData.huisnummer.trim()) {
      newErrors.huisnummer = 'Huisnummer is verplicht.';
    }

    if (!formData.stad.trim()) {
      newErrors.stad = 'Stad is verplicht.';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is verplicht.';
    } else if (!/^\d{4}\s?[A-Za-z]{2}$/.test(formData.postcode)) {
      newErrors.postcode = 'Voer een geldige postcode in.';
    }

    return newErrors;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Save to localStorage or send to server
      localStorage.setItem('accountData', JSON.stringify(formData));
      triggerNotification('Account succesvol bijgewerkt', 'success');
      setSuccessMessage('Account succesvol bijgewerkt!');
      setErrors({});
    }
  };

  return (
    <div className="account-manage-container">
      <NotificationComponent />
      <h2 className="secondary-title">Account beheren</h2>
      <form className="account-manage-form" onSubmit={handleSave} noValidate>
        {/* Voornaam */}
        <div className="form-group">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="voornaam"
              placeholder="Voornaam"
              value={formData.voornaam}
              onChange={handleChange}
              aria-label="Voornaam"
            />
          </div>
          {errors.voornaam && <p className="form-error">{errors.voornaam}</p>}
        </div>

        {/* Achternaam */}
        <div className="form-group">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="achternaam"
              placeholder="Achternaam"
              value={formData.achternaam}
              onChange={handleChange}
              aria-label="Achternaam"
            />
          </div>
          {errors.achternaam && <p className="form-error">{errors.achternaam}</p>}
        </div>

        {/* Telefoonnummer */}
        <div className="form-group">
          <div className="input-container">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="telefoonnummer"
              placeholder="Telefoonnummer"
              value={formData.telefoonnummer}
              onChange={handleChange}
              aria-label="Telefoonnummer"
            />
          </div>
          {errors.telefoonnummer && <p className="form-error">{errors.telefoonnummer}</p>}
        </div>

        {/* Straat en Huisnummer */}
        <div className="form-row">
          <div className="form-group half-width">
            <div className="input-container">
              <FaHome className="input-icon" />
              <input
                type="text"
                name="straat"
                placeholder="Straat"
                value={formData.straat}
                onChange={handleChange}
                aria-label="Straat"
              />
            </div>
            {errors.straat && <p className="form-error">{errors.straat}</p>}
          </div>

          <div className="form-group half-width">
            <div className="input-container">
              <FaHome className="input-icon" />
              <input
                type="text"
                name="huisnummer"
                placeholder="Huisnummer"
                value={formData.huisnummer}
                onChange={handleChange}
                aria-label="Huisnummer"
              />
            </div>
            {errors.huisnummer && <p className="form-error">{errors.huisnummer}</p>}
          </div>
        </div>

        {/* Stad en Postcode */}
        <div className="form-row">
          <div className="form-group half-width">
            <div className="input-container">
              <FaCity className="input-icon" />
              <input
                type="text"
                name="stad"
                placeholder="Stad"
                value={formData.stad}
                onChange={handleChange}
                aria-label="Stad"
              />
            </div>
            {errors.stad && <p className="form-error">{errors.stad}</p>}
          </div>

          <div className="form-group half-width">
            <div className="input-container">
              <FaMapPin className="input-icon" />
              <input
                type="text"
                name="postcode"
                placeholder="Postcode"
                value={formData.postcode}
                onChange={handleChange}
                aria-label="Postcode"
              />
            </div>
            {errors.postcode && <p className="form-error">{errors.postcode}</p>}
          </div>
        </div>

        {successMessage && (
          <p className="form-success">
            {successMessage}
          </p>
        )}

        <button type="submit" className="account-manage__button">
          Opslaan
        </button>
      </form>
    </div>
  );
};

export default AccountManage;
