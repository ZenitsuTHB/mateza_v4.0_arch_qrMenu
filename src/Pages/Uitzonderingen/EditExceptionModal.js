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

  useEffect(() => {
    // Update formData when exception prop changes
    setFormData({
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
  }, [exception]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const day = value;
      setFormData((prev) => {
        let daysOfWeek = [...prev.daysOfWeek];
        if (checked) {
          daysOfWeek.push(day);
        } else {
          daysOfWeek = daysOfWeek.filter((d) => d !== day);
        }
        return { ...prev, daysOfWeek };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const shouldShowField = (field) => {
    const { type } = formData;
    if (field === 'toepassing') {
      return type !== 'Sluitingsdag';
    }
    if (field === 'startHour' || field === 'endHour' || field === 'maxSeats') {
      return type === 'Opening' || type === 'Uitzondering';
    }
    if (field === 'startDate' || field === 'endDate') {
      return true;
    }
    if (field === 'daysOfWeek') {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.title.trim()) validationErrors.title = 'Titel is verplicht.';
    if (!formData.type) validationErrors.type = 'Type is verplicht.';
    if (shouldShowField('toepassing') && !formData.toepassing)
      validationErrors.toepassing = 'Toepassing is verplicht.';
    if (shouldShowField('startDate') && !formData.startDate)
      validationErrors.startDate = 'Startdatum is verplicht.';
    if (shouldShowField('endDate') && !formData.endDate)
      validationErrors.endDate = 'Einddatum is verplicht.';
    if (shouldShowField('startHour') && !formData.startHour)
      validationErrors.startHour = 'Startuur is verplicht.';
    if (shouldShowField('endHour') && !formData.endHour)
      validationErrors.endHour = 'Einduur is verplicht.';
    if (shouldShowField('maxSeats') && !formData.maxSeats)
      validationErrors.maxSeats = 'Max. Zitplaatsen is verplicht.';
    if (shouldShowField('daysOfWeek') && formData.daysOfWeek.length === 0)
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare payload, consider 'Sluitingsdag' as 'toepassing' 'Volledige Dag'
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
            {/* Form fields are the same as in ExceptionForm.js */}
            {/* ... */}
            {/* Reuse the same fields and structure */}
            {/* ... */}
            <button type="submit" className="button-style-3">
              Opslaan
            </button>
          </form>
        </div>
      }
    />
  );
};

export default EditExceptionModal;
