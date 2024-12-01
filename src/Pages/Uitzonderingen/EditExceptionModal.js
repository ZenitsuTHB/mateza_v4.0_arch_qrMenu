// src/Pages/Uitzonderingen/EditExceptionModal.js

import React, { useState } from 'react';
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
    title: exception.title || '',
    type: exception.type || 'Opening',
    toepassing: exception.toepassing || 'Volledige Dag',
    startDate: exception.startDate || '',
    endDate: exception.endDate || '',
    startHour: exception.startHour || '',
    endHour: exception.endHour || '',
    maxSeats: exception.maxSeats || '',
    daysOfWeek: exception.daysOfWeek || ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
  });

  const [errors, setErrors] = useState({});

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'daysOfWeek') {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Titel is verplicht.';
    if (!formData.type) validationErrors.type = 'Type is verplicht.';
    if (formData.type !== 'Sluitingsdag' && !formData.toepassing)
      validationErrors.toepassing = 'Toepassing is verplicht.';

    if (!formData.startDate) validationErrors.startDate = 'Startdatum is verplicht.';
    if (!formData.endDate) validationErrors.endDate = 'Einddatum is verplicht.';

    if ((formData.type === 'Opening' || formData.type === 'Uitzondering') && !formData.startHour)
      validationErrors.startHour = 'Startuur is verplicht.';
    if ((formData.type === 'Opening' || formData.type === 'Uitzondering') && !formData.endHour)
      validationErrors.endHour = 'Einduur is verplicht.';

    if ((formData.type === 'Opening' || formData.type === 'Uitzondering') && !formData.maxSeats)
      validationErrors.maxSeats = 'Max. Zitplaatsen is verplicht.';

    if (formData.daysOfWeek.length === 0)
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload
    const payload = {
      title: formData.title,
      type: formData.type,
      toepassing: formData.type === 'Sluitingsdag' ? 'Volledige Dag' : formData.toepassing,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startHour: formData.startHour,
      endHour: formData.endHour,
      maxSeats: formData.maxSeats,
      daysOfWeek: formData.daysOfWeek,
    };

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
            {/* ... (same content as in ExceptionForm.js, adjusted for editing) */}
            {/* For brevity, the form fields are not repeated here */}
          </form>
        </div>
      }
    />
  );
};

export default EditExceptionModal;
