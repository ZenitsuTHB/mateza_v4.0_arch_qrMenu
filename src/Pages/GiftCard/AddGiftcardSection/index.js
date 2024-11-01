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
    { value: '', label: 'Select Design' },
    { value: 'design1', label: 'Classic' },
    { value: 'design2', label: 'Modern' },
    { value: 'design3', label: 'Festive' },
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
      newErrors.value = 'Please enter a valid amount in Euro.';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.design) {
      newErrors.design = 'Please select a design for the card.';
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
      console.log('Gift Card Created:', formData);
      setSuccessMessage('Gift Card successfully created!');
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
      <h2 className="add-gift-card-section__title">Add New Gift Card</h2>
      <form className="add-gift-card-section__form" onSubmit={handleSubmit} noValidate>
        {/* Value in Euro */}
        <div className="form-group">
          <label htmlFor="value">
            <FaEuroSign /> Value in Euro
          </label>
          <input
            type="number"
            id="value"
            name="value"
            placeholder="e.g., 50"
            value={formData.value}
            onChange={handleChange}
            min="1"
            step="0.01"
          />
          {errors.value && <p className="form-error">{errors.value}</p>}
        </div>

        {/* Recipient First Name */}
        <div className="form-group">
          <label htmlFor="firstName">
            <FaUser /> Recipient First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        {/* Recipient Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">
            <FaUser /> Recipient Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>

        {/* Recipient Email */}
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope /> Recipient Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Select Design for the Card */}
        <div className="form-group">
          <label htmlFor="design">
            <FaImage /> Select Design for the Card
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
        {successMessage && <p className="form-success"><FaCheckIcon /> {successMessage}</p>}

        {/* Create Button */}
        <button type="submit" className="add-gift-card-section__button">
          <FaPlus /> Create!
        </button>
      </form>
    </div>
  );
};

// FaCheckIcon Component for Success Message
const FaCheckIcon = () => <FaPlus />; // Replace with FaCheckCircle or another appropriate icon

export default AddGiftCardSection;
