// src/components/ReservationForm/NewReservationAdmin.jsx

import React, { useState } from 'react';
import './css/newReservationAdmin.css';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard';
import useApi from '../../Hooks/useApi';
import ReservationStepOne from './ReservationStepOne';
import ReservationStepTwoModal from './ReservationStepTwoModal';
import { withHeader } from '../../Components/Structural/Header';
import useFetchRestaurantData from './Hooks/useFetchRestaurantData';

const NewReservationAdmin = () => {
  const api = useApi();
  const restaurantData = useFetchRestaurantData();
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

  const dummyTimeblocks = [
    {
      date: '2023-10-20',
      startTime: '09:00',
      endTime: '17:00',
    },
    {
      date: '2023-10-21',
      startTime: '10:00',
      endTime: '18:00',
    },
    {
      date: '2023-10-22',
      startTime: '11:00',
      endTime: '16:00',
    },
  ];

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
        await api.post('api/auth-reservations/', submissionData);
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
    setErrors({ ...errors, [name]: '' });
  };

  return (
    <div className="new-reservation-admin-component">
      <div className="profile-page">
        <h2 className="account-manage-title">Admin Reservaties</h2>
        <div className="account-manage-container">
          <ReservationStepOne
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleStepOneSubmit={handleStepOneSubmit}
            setFormData={setFormData}
            timeblocks={dummyTimeblocks}
          />
        </div>

        {isModalOpen && (
          <ModalWithoutTabs
            content={
              <ReservationStepTwoModal
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleFinalSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            }
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default withHeader(NewReservationAdmin);
