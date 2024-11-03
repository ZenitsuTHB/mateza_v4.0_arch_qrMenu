// src/components/Profile/AccountManage.jsx

import React, { useState } from 'react';
import { FaUser, FaPhone, FaHome, FaCity, FaMapPin, FaUtensils } from 'react-icons/fa'; // Added FaUtensils
import useNotification from '../../Components/Notification';
import './css/accountManage.css';

const AccountManage = ({ accountData, setAccountData, api }) => {
  const { triggerNotification, NotificationComponent } = useNotification();

  const [formData, setFormData] = useState({
    voornaam: accountData.voornaam || '',
    achternaam: accountData.achternaam || '',
    telefoonnummer: accountData.telefoonnummer || '',
    straat: accountData.straat || '',
    huisnummer: accountData.huisnummer || '',
    stad: accountData.stad || '',
    postcode: accountData.postcode || '',
    bio: accountData.bio || '',
    imageId: accountData.imageId || '',
    naamRestaurant: accountData.naamRestaurant || '', // Updated naamRestaurant
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: '' });
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
    } if (!/^[1-9]\d{3}$/.test(formData.postcode)) {
		newErrors.postcode = 'Voer een geldige Belgische postcode in.';
	  }

    if (!formData.naamRestaurant.trim()) { // Validation remains
      newErrors.naamRestaurant = 'Naam restaurant is verplicht.';
    }

    // Add more validations if necessary

    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setLoading(true);
        let responseData;
        // Determine whether to POST or PUT based on whether account exists
        if (accountData._id) {
          responseData = await api.put(window.baseDomain + 'api/account', formData);
          triggerNotification('Account bijgewerkt', 'success');
        } else {
          responseData = await api.post(window.baseDomain + 'api/account', formData);
          triggerNotification('Gegevens toegevoegd', 'success');
        }
        setLoading(false);
        setAccountData(responseData); // Update the central account data
      } catch (error) {
        setLoading(false);
        triggerNotification('Fout bij het opslaan van accountgegevens', 'error');
      }
    }
  };

  return (
    <div className="profile-page">
      <h2 className="account-manage-title">Account beheren</h2>

      <div className="account-manage-container">
        <NotificationComponent />
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

          {/* Naam Restaurant */}
          <div className="form-group">
            <div className="input-container">
              <FaUtensils className="input-icon" /> {/* Added icon for Naam restaurant */}
              <input
                type="text"
                name="naamRestaurant"
                placeholder="Naam restaurant"
                value={formData.naamRestaurant}
                onChange={handleChange}
                aria-label="Naam restaurant"
              />
            </div>
            {errors.naamRestaurant && <p className="form-error">{errors.naamRestaurant}</p>}
          </div>

          <button type="submit" className="account-manage__button" disabled={loading}>
            {loading ? 'Opslaan...' : 'Opslaan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountManage;
