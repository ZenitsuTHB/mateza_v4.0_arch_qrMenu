// src/components/Profile/AccountManage.jsx

import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaHome, FaCity, FaMapPin, FaUtensils } from 'react-icons/fa';
import useNotification from '../../Components/Notification';
import './css/accountManage.css';

const AccountManage = ({ accountData, setAccountData, api }) => {
  const { triggerNotification, NotificationComponent } = useNotification();

  const [formData, setFormData] = useState({
    first_name: accountData.first_name || '',
    last_name: accountData.last_name || '',
    phone_number: accountData.phone_number || '',
    street: accountData.street || '',
    house_number: accountData.house_number || '',
    city: accountData.city || '',
    postal_code: accountData.postal_code || '',
    bio: accountData.bio || '',
    imageId: accountData.imageId || '',
    restaurant_name: accountData.restaurant_name || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update formData when accountData changes
  useEffect(() => {
    setFormData({
      first_name: accountData.first_name || '',
      last_name: accountData.last_name || '',
      phone_number: accountData.phone_number || '',
      street: accountData.street || '',
      house_number: accountData.house_number || '',
      city: accountData.city || '',
      postal_code: accountData.postal_code || '',
      bio: accountData.bio || '',
      imageId: accountData.imageId || '',
      restaurant_name: accountData.restaurant_name || '',
    });
  }, [accountData]);

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

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Voornaam is verplicht.';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Achternaam is verplicht.';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Telefoonnummer is verplicht.';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Voer een geldig telefoonnummer in.';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Straat is verplicht.';
    }

    if (!formData.house_number.trim()) {
      newErrors.house_number = 'Huisnummer is verplicht.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Stad is verplicht.';
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postcode is verplicht.';
    } 
    if (!/^[1-9]\d{3}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Voer een geldige Belgische postcode in.';
    }

    if (!formData.restaurant_name.trim()) {
      newErrors.restaurant_name = 'Naam restaurant is verplicht.';
    }
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
		if (accountData._id) {
		  responseData = await api.put(`${window.baseDomain}api/account`, formData);
		  triggerNotification('Account bijgewerkt', 'success');
		} else {
		  responseData = await api.post(`${window.baseDomain}api/account`, formData);
		  triggerNotification('Gegevens toegevoegd', 'success');
		}
		setLoading(false);
	  } catch (error) {
		setLoading(false);
		triggerNotification('Fout bij het opslaan', 'error');
	  }
	}
  };  

  return (
    <div className="profile-page">
      <h2 className="account-manage-title">Account beheren</h2>

      <div className="account-manage-container">
        <NotificationComponent />
        <form className="account-manage-form" onSubmit={handleSave} noValidate>
          {/* First Name */}
          <div className="form-group">
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="first_name"
                placeholder="Voornaam"
                value={formData.first_name}
                onChange={handleChange}
                aria-label="Voornaam"
              />
            </div>
            {errors.first_name && <p className="form-error">{errors.first_name}</p>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="last_name"
                placeholder="Achternaam"
                value={formData.last_name}
                onChange={handleChange}
                aria-label="Achternaam"
              />
            </div>
            {errors.last_name && <p className="form-error">{errors.last_name}</p>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <div className="input-container">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone_number"
                placeholder="Telefoonnummer"
                value={formData.phone_number}
                onChange={handleChange}
                aria-label="Telefoonnummer"
              />
            </div>
            {errors.phone_number && <p className="form-error">{errors.phone_number}</p>}
          </div>

          {/* Street and House Number */}
          <div className="form-row">
            <div className="form-group half-width">
              <div className="input-container">
                <FaHome className="input-icon" />
                <input
                  type="text"
                  name="street"
                  placeholder="Straat"
                  value={formData.street}
                  onChange={handleChange}
                  aria-label="Straat"
                />
              </div>
              {errors.street && <p className="form-error">{errors.street}</p>}
            </div>

            <div className="form-group half-width">
              <div className="input-container">
                <FaHome className="input-icon" />
                <input
                  type="text"
                  name="house_number"
                  placeholder="Huisnummer"
                  value={formData.house_number}
                  onChange={handleChange}
                  aria-label="Huisnummer"
                />
              </div>
              {errors.house_number && <p className="form-error">{errors.house_number}</p>}
            </div>
          </div>

          {/* City and Postal Code */}
          <div className="form-row">
            <div className="form-group half-width">
              <div className="input-container">
                <FaCity className="input-icon" />
                <input
                  type="text"
                  name="city"
                  placeholder="Stad"
                  value={formData.city}
                  onChange={handleChange}
                  aria-label="Stad"
                />
              </div>
              {errors.city && <p className="form-error">{errors.city}</p>}
            </div>

            <div className="form-group half-width">
              <div className="input-container">
                <FaMapPin className="input-icon" />
                <input
                  type="text"
                  name="postal_code"
                  placeholder="Postcode"
                  value={formData.postal_code}
                  onChange={handleChange}
                  aria-label="Postcode"
                />
              </div>
              {errors.postal_code && <p className="form-error">{errors.postal_code}</p>}
            </div>
          </div>

          {/* Restaurant Name */}
          <div className="form-group">
            <div className="input-container">
              <FaUtensils className="input-icon" />
              <input
                type="text"
                name="restaurant_name"
                placeholder="Naam restaurant"
                value={formData.restaurant_name}
                onChange={handleChange}
                aria-label="Naam restaurant"
              />
            </div>
            {errors.restaurant_name && <p className="form-error">{errors.restaurant_name}</p>}
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
