// src/components/Modal/ModalContent.jsx

import React, { useState, useEffect } from 'react';
import './css/modalContent.css';
import { FaCalendarWeek } from 'react-icons/fa';

const ModalContent = ({
  formData,
  setFormData,
  onSave,
  onDelete,
  existingBlock,
  selectedDate,
}) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const isMessageHidden = localStorage.getItem('hideWeeklyScheduleMessage');
    if (isMessageHidden === 'true') {
      setShowMessage(false);
    }
  }, []);

  const formatDateDutch = (date) => {
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const handleSubmit = (e, continueToSettings = false) => {
    e.preventDefault();
    onSave(continueToSettings);
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'zitplaatsen' ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handlePermanentCloseMessage = () => {
    setShowMessage(false);
    localStorage.setItem('hideWeeklyScheduleMessage', 'true');
  };

  return (
    <>
      <h2 className="secondary-title">
        {existingBlock ? 'Tijdsblok Bewerken' : 'Tijdsblok Toevoegen'}
      </h2>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <label className="modal-label">
          Titel:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <div className="time-inputs-container">
          <label className="modal-label time-input">
            Start:
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </label>
          <label className="modal-label time-input">
            Einde:
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        {/*
        <label className="modal-label">
          Max Capaciteit Gasten:
          <input
            type="number"
            name="zitplaatsen"
            value={formData.zitplaatsen}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <label className="modal-label">
          Kleur:
          <input
            type="color"
            name="kleurInstelling"
            value={formData.kleurInstelling}
            onChange={handleChange}
            required
          />
        </label>*/}
        
        {showMessage && (
          <div className="weekly-schedule-container">
            <FaCalendarWeek className="weekly-schedule-icon" />
            <div className="weekly-schedule-message">
              <span>
                <strong>Bovenstaande instellingen betreffen het huidige tijdsblok.</strong> U kunt een tijdsblok herhalen en openingsuren instellen in Schema.
              </span>
              <span className="close-message" onClick={handleCloseMessage}>
                Verbergen
              </span>
              <span className="close-message left-margin" onClick={handlePermanentCloseMessage}>
                Sluiten
              </span>
            </div>
          </div>
        )}

        <div className="modal-buttons">
          {existingBlock && (
            <button
              type="button"
              className="standard-button red spaced"
              onClick={handleDelete}
            >
              Verwijderen
            </button>
          )}
          <button
            type="button"
            className="standard-button blue spaced"
            onClick={(e) => handleSubmit(e, true)}
          >
            Opslaan
          </button>
        </div>
      </form>
    </>
  );
};

export default ModalContent;
