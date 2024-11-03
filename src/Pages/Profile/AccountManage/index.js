// src/components/Profile/AccountManage.jsx

import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaHome, FaCity, FaMapPin, FaUtensils } from 'react-icons/fa';
import useNotification from '../../../Components/Notification';
import { validateAccountData } from './Utils/validationUtils';
import FormField from './FormField';
import './css/accountManage.css';
import './css/mobile.css';

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

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateAccountData(formData);

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
          <FormField
            label="Voornaam"
            name="first_name"
            placeholder="Voornaam"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            icon={FaUser}
          />
          <FormField
            label="Achternaam"
            name="last_name"
            placeholder="Achternaam"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            icon={FaUser}
          />
          <FormField
            label="Telefoonnummer"
            name="phone_number"
            type="tel"
            placeholder="Telefoonnummer"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
            icon={FaPhone}
          />
          <div className="form-row">
            <FormField
              label="Straat"
              name="street"
              placeholder="Straat"
              value={formData.street}
              onChange={handleChange}
              error={errors.street}
              icon={FaHome}
              halfWidth={true}
            />
            <FormField
              label="Huisnummer"
              name="house_number"
              placeholder="Huisnummer"
              value={formData.house_number}
              onChange={handleChange}
              error={errors.house_number}
              icon={FaHome}
              halfWidth={true}
            />
          </div>
          <div className="form-row">
            <FormField
              label="Stad"
              name="city"
              placeholder="Stad"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              icon={FaCity}
              halfWidth={true}
            />
            <FormField
              label="Postcode"
              name="postal_code"
              placeholder="Postcode"
              value={formData.postal_code}
              onChange={handleChange}
              error={errors.postal_code}
              icon={FaMapPin}
              halfWidth={true}
            />
          </div>
          <FormField
            label="Naam restaurant"
            name="restaurant_name"
            placeholder="Naam restaurant"
            value={formData.restaurant_name}
            onChange={handleChange}
            error={errors.restaurant_name}
            icon={FaUtensils}
          />
          <button type="submit" className="account-manage__button" disabled={loading}>
            {loading ? 'Opslaan...' : 'Opslaan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountManage;
