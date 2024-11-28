// src/Pages/NewReservation/ReservationStepTwo.jsx

import React from 'react';
import FormField from './FormField';
import { FaUser, FaPhone, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './css/reservationsStepTwo.css'; // Ensure you have this CSS file

const ReservationStepTwo = ({
  formData,
  errors,
  handleChange,
  isSubmitting,
}) => {
  return (
    <div className="reservation-step-two">
      <div className="account-manage-form" noValidate>
        
        {/* Name Fields Container */}
        <div className="name-fields">
          <FormField
            label="Voornaam"
            name="firstName"
            placeholder="Voornaam"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            icon={FaUser}
          />
          <FormField
            label="Achternaam"
            name="lastName"
            placeholder="Achternaam"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            icon={FaUser}
          />
        </div>
        
        {/* Other Form Fields */}
        <FormField
          label="E-mail"
          name="email"
          type="email"
          placeholder="E-mailadres"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={FaEnvelope}
        />
        <FormField
          label="Telefoonnummer"
          name="phone"
          type="tel"
          placeholder="Telefoonnummer"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={FaPhone}
        />
        <FormField
          label="Extra info"
          name="extraInfo"
          type="textarea"
          placeholder="Extra informatie"
          value={formData.extraInfo}
          onChange={handleChange}
          error={errors.extraInfo}
          icon={FaInfoCircle}
        />
      </div>
    </div>
  );
};

export default ReservationStepTwo;
