// src/components/GiftCard/AddGiftCardSection/index.js

import React, { useState } from 'react';
import './css/addGiftCardSection.css';
import { FaEuroSign, FaUser, FaEnvelope, FaImage, FaPlus } from 'react-icons/fa';

const AddGiftCardSection = () => {
  const [formData, setFormData] = useState({
    value: '',
    firstName: '',
    lastName: '',
    email: '',
    design: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const giftCardDesigns = [
    { value: '', label: 'Selecteer Ontwerp' },
    { value: 'design1', label: 'Klassiek' },
    { value: 'design2', label: 'Modern' },
    { value: 'design3', label: 'Feestelijk' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.value || isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Voer een geldig bedrag in Euro in.';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Voornaam is verplicht.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Achternaam is verplicht.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in.';
    }

    if (!formData.design) {
      newErrors.design = 'Selecteer een ontwerp voor de kaart.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Handle form submission (e.g., API call)
      console.log('Cadeaubon Aangemaakt:', formData);
      setSuccessMessage('Cadeaubon succesvol aangemaakt!');
      // Reset form
      setFormData({
        value: '',
        firstName: '',
        lastName: '',
        email: '',
        design: '',
      });
      setErrors({});
    }
  };

  return (
    <div className="add-gift-card-section">
      <h2 className="add-gift-card-section__title">Cadeaubon Toevoegen</h2>
      <form className="add-gift-card-section__form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <div className="input-container">
            <FaEuroSign className="input-icon" />
            <input
              type="number"
              id="value"
              name="value"
              placeholder="Waarde in Euro, bijv. 50"
              value={formData.value}
              onChange={handleChange}
              min="1"
              step="0.01"
            />
          </div>
          {errors.value && <p className="form-error">{errors.value}</p>}
        </div>

        {/* Name Fields on the Same Row */}
       
			 <div className="form-group">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Voornaam Ontvanger"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="form-error">{errors.firstName}</p>}
          </div>
		  </div>

		  <div className="form-group">
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Achternaam Ontvanger"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="form-error">{errors.lastName}</p>}
          </div>
		  </div>

		  <div className="form-group">

          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@voorbeeld.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <div className="input-container select-container">
            <FaImage className="input-icon" />
            <select
              id="design"
              name="design"
              value={formData.design}
              onChange={handleChange}
            >
              {giftCardDesigns.map((design) => (
                <option key={design.value} value={design.value}>
                  {design.label}
                </option>
              ))}
            </select>
          </div>
          {errors.design && <p className="form-error">{errors.design}</p>}
        </div>

        {successMessage && (
          <p className="form-success">
            <FaPlus /> {successMessage}
          </p>
        )}

        <button type="submit" className="add-gift-card-section__button">
          Aanmaken
        </button>
      </form>
    </div>
  );
};

export default AddGiftCardSection;
