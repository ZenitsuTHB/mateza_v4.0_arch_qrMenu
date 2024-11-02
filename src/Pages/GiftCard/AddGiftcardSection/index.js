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
    // Add more designs as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear specific field error on change
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
      <h2 className="add-gift-card-section__title">Nieuwe Cadeaubon Toevoegen</h2>
      <form className="add-gift-card-section__form" onSubmit={handleSubmit} noValidate>
        {/* Waarde in Euro */}
        <div className="form-group">
          <label htmlFor="value">
            <FaEuroSign /> Waarde in Euro
          </label>
          <input
            type="number"
            id="value"
            name="value"
            placeholder="bijv., 50"
            value={formData.value}
            onChange={handleChange}
            min="1"
            step="0.01"
          />
          {errors.value && <p className="form-error">{errors.value}</p>}
        </div>

        {/* Voornaam Ontvanger */}
        <div className="form-group">
          <label htmlFor="firstName">
            <FaUser /> Voornaam Ontvanger
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Voornaam"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        {/* Achternaam Ontvanger */}
        <div className="form-group">
          <label htmlFor="lastName">
            <FaUser /> Achternaam Ontvanger
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Achternaam"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>

        {/* E-mail Ontvanger */}
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope /> E-mail Ontvanger
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@voorbeeld.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Selecteer Ontwerp voor de Kaart */}
        <div className="form-group">
          <label htmlFor="design">
            <FaImage /> Selecteer Ontwerp voor de Kaart
          </label>
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
          {errors.design && <p className="form-error">{errors.design}</p>}
        </div>

        {/* Success Message */}
        {successMessage && <p className="form-success"><FaPlus /> {successMessage}</p>}

        {/* Create Button */}
        <button type="submit" className="button-style-3">
        	Aanmaken
        </button>
      </form>
    </div>
  );
};


export default AddGiftCardSection;
