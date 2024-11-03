// src/components/ReservationForm/ReservationForm.jsx

import React, { useState } from 'react';
import {
  FaUser,
  FaPhone,
  FaInfoCircle,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaEnvelope,
} from 'react-icons/fa';
import FormField from './FormField';
import './css/newReservation.css';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard';
import useApi from '../../Hooks/useApi'; // Import the useApi hook

const NewReservation = () => {
  const api = useApi(); // Initialize the API methods
  const [formData, setFormData] = useState({
    numberOfGuests: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    extraInfo: '',
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateStepOne = () => {
    const errors = {};
    if (!formData.numberOfGuests) {
      errors.numberOfGuests = 'Aantal gasten is verplicht';
    }
    if (!formData.date) {
      errors.date = 'Datum is verplicht';
    }
    if (!formData.time) {
      errors.time = 'Tijd is verplicht';
    }
    return errors;
  };

  const validateStepTwo = () => {
    const errors = {};
    if (!formData.firstName) {
      errors.firstName = 'Voornaam is verplicht';
    }
    if (!formData.lastName) {
      errors.lastName = 'Achternaam is verplicht';
    }
    if (!formData.email) {
      errors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'E-mail is ongeldig';
    }
    if (!formData.phone) {
      errors.phone = 'Telefoonnummer is verplicht';
    }
    return errors;
  };

  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    const stepOneErrors = validateStepOne();
    if (Object.keys(stepOneErrors).length > 0) {
      setErrors(stepOneErrors);
    } else {
      setErrors({});
      setIsModalOpen(true);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const stepTwoErrors = validateStepTwo();
    if (Object.keys(stepTwoErrors).length > 0) {
      setErrors(stepTwoErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      // Prepare the data to be submitted
      const submissionData = {
        numberOfGuests: formData.numberOfGuests,
        date: formData.date,
        time: formData.time,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        extraInfo: formData.extraInfo,
      };

      try {
        // Use the useApi hook's post method
        await api.post(window.baseDomain + 'api/auth-reservations/', submissionData);
        // Handle success (e.g., show a success message or redirect)
        alert('Reservatie succesvol ingediend!');
        setIsModalOpen(false);
        setFormData({
          numberOfGuests: '',
          date: '',
          time: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          extraInfo: '',
        });
      } catch (error) {
        // Handle errors
        if (error.response && error.response.data && error.response.data.message) {
          alert('Er is een fout opgetreden: ' + error.response.data.message);
        } else {
          alert('Er is een fout opgetreden bij het indienen van de reservatie.');
        }
        console.error('Error submitting reservation:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    setErrors({ ...errors, [name]: '' });
  };

  const modalContent = (
    <div>
      <h2 className='modal-title'>Vul uw gegevens in</h2>
      <form className="account-manage-form" onSubmit={handleFinalSubmit} noValidate>
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
        <button type="submit" className="account-manage__button" disabled={isSubmitting}>
          {isSubmitting ? 'Verzenden...' : 'Reserveren'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="profile-page">
      <h2 className="account-manage-title">Reserveren</h2>
      <div className="account-manage-container">
        <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
          <FormField
            label="Aantal gasten"
            name="numberOfGuests"
            type="number"
            placeholder="Aantal gasten"
            value={formData.numberOfGuests}
            onChange={handleChange}
            error={errors.numberOfGuests}
            icon={FaUsers}
          />
          <FormField
            label="Datum"
            name="date"
            type="date"
            placeholder="Datum"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            icon={FaCalendarAlt}
          />
          <FormField
            label="Tijd"
            name="time"
            type="time"
            placeholder="Tijd"
            value={formData.time}
            onChange={handleChange}
            error={errors.time}
            icon={FaClock}
          />
          <button type="submit" className="account-manage__button">
            Verder
          </button>
        </form>
      </div>

      {/* Modal for additional information */}
      {isModalOpen && (
        <ModalWithoutTabs content={modalContent} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default NewReservation;
