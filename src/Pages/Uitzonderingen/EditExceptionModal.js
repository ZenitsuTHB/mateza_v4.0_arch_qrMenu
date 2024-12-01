// src/Pages/Uitzonderingen/EditExceptionModal.js

import React, { useState, useEffect } from 'react';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard';
import './css/exceptions.css';

const EditExceptionModal = ({
  isVisible,
  exception,
  api,
  triggerNotification,
  refreshExceptions,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    toepassing: '',
    date: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    maxSeats: '',
    daysOfWeek: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Populate form data with existing exception data
    setFormData({
      title: exception.title || '',
      type: exception.type === 'Sluitingsdag' ? (exception.startDate === exception.endDate ? 'Sluitingsdag' : 'Sluitingsdagen') : exception.type,
      toepassing: exception.toepassing || '',
      date: exception.startDate === exception.endDate ? exception.startDate : '',
      startDate: exception.startDate || '',
      endDate: exception.endDate || '',
      startHour: exception.startHour || '',
      endHour: exception.endHour || '',
      maxSeats: exception.maxSeats || '',
      daysOfWeek: exception.daysOfWeek || [],
    });
  }, [exception]);

  // Handle field changes (same as in ExceptionForm.js)
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    if (inputType === 'checkbox' && name === 'daysOfWeek') {
      const day = value;
      setFormData((prevFormData) => {
        let daysOfWeek = [...prevFormData.daysOfWeek];
        if (checked) {
          daysOfWeek.push(day);
        } else {
          daysOfWeek = daysOfWeek.filter((d) => d !== day);
        }
        return { ...prevFormData, daysOfWeek };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  // Handle form submission (similar to ExceptionForm.js)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    // ... (same validation logic as in ExceptionForm.js)

    // (Validation code omitted for brevity)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload
    let payload = {
      title: formData.title,
      type: 'Sluitingsdag' === formData.type || 'Sluitingsdagen' === formData.type ? 'Sluitingsdag' : formData.type,
      toepassing:
        formData.type === 'Sluitingsdag' || formData.type === 'Sluitingsdagen'
          ? 'Volledige Dag'
          : formData.toepassing,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startHour: formData.startHour,
      endHour: formData.endHour,
      maxSeats: formData.maxSeats,
      daysOfWeek: formData.daysOfWeek,
    };

    // Handle Sluitingsdag (single date)
    if (formData.type === 'Sluitingsdag') {
      payload.startDate = formData.date;
      payload.endDate = formData.date;
    }

    try {
      const response = await api.put(`${window.baseDomain}api/uitzonderingen/${exception._id}`, payload);
      if (response) {
        triggerNotification('Uitzondering succesvol bijgewerkt', 'success');
        refreshExceptions();
        onClose();
      } else {
        triggerNotification('Fout bij het bijwerken van de uitzondering', 'error');
      }
    } catch (error) {
      console.error('Error updating exception:', error);
      triggerNotification('Fout bij het bijwerken van de uitzondering', 'error');
    }
  };

  if (!isVisible) return null;

  return (
    <ModalWithoutTabs
      onClose={onClose}
      content={
        <div className="exceptions-page__edit-modal">
          <form className="exceptions-page__form" onSubmit={handleSubmit}>
            {/* Form fields (same as in ExceptionForm.js) */}
            {/* ... (include the same form fields with the handleChange and formData values) */}
            {/* For brevity, the form fields are not repeated here */}
          </form>
        </div>
      }
    />
  );
};

export default EditExceptionModal;
