import React, { useState } from 'react';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard';
import useApi from '../../Hooks/useApi';
import ReservationStepOne from './StepOne';
import ReservationStepTwoModal from './ReservationStepTwoModal';
import ReservationSummary from './ReservationSummary'; // Import the new component
import { withHeader } from '../../Components/Structural/Header';

const NewReservationAdmin = () => {
  const api = useApi();

  // Form state
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

  // Error state
  const [errors, setErrors] = useState({});

  // Modal and submission states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false); // New state variable

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

  // Handle submission of Step One
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

  // Handle final submission of the reservation
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
        await api.post(`${window.baseDomain}api/auth-reservations/`, submissionData);
        setIsModalOpen(false);
        setReservationSubmitted(true); // Set the new state variable to true
      } catch (error) {
        // ... existing error handling ...
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle form field changes
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
          {reservationSubmitted ? (
            <ReservationSummary
              formData={formData}
              onNewReservation={() => {
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
                setReservationSubmitted(false);
              }}
            />
          ) : (
            <>
              <ReservationStepOne
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleStepOneSubmit={handleStepOneSubmit}
                setFormData={setFormData}
              />

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withHeader(NewReservationAdmin);
