// src/components/Modal/ModalContent.js

import React, { useState } from 'react';
import useApi from '../../../Hooks/useApi';
import './css/modalContent.css';

const ModalContent = ({ onClose, onSave, existingBlock, selectedDate }) => {
  const api = useApi();

  const formatDateDutch = (date) => {
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];
    const days = [
      'zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName} ${day} ${month} ${year}`;
  };

  const [title, setTitle] = useState(existingBlock ? existingBlock.title : `Tijdsblok (${formatDateDutch(selectedDate)})`);
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '17:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:00');
  const [kleurInstelling, setKleurInstelling] = useState(existingBlock ? existingBlock.kleurInstelling : '#2c909b');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blockData = {
      date: selectedDate.toISOString().split('T')[0], // Date in YYYY-MM-DD format
      title,
      kleurInstelling,
      startTime,
      endTime,
    };
    try {
      let response;
      if (existingBlock) {
        // Editing an existing block, use PUT
        response = await api.put(`${window.baseDomain}api/timeblocks/${existingBlock.id}/`, blockData);
      } else {
        // Adding a new block, use POST
        response = await api.post(`${window.baseDomain}api/timeblocks/`, blockData);
      }
      const savedBlock = response;
      onSave(savedBlock);
    } catch (err) {
      console.error('Error saving time block:', err);
      // Optionally handle the error (e.g., display an error message)
    }
  };

  return (
    <>
      <h2 className="secondary-title">{existingBlock ? 'Blok Bewerken' : 'Blok Toevoegen'}</h2>
      <form onSubmit={handleSubmit}>
        <label className="modal-label">
          Titel:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <div className="time-inputs-container">
          <label className="modal-label time-input">
            Start tijd:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label className="modal-label time-input">
            Eindtijd:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>
        <label className="modal-label">
          Kleur instelling:
          <input
            type="color"
            value={kleurInstelling}
            onChange={(e) => setKleurInstelling(e.target.value)}
            required
          />
        </label>
        <div className="modal-buttons">
          <button type="button" className="modal-button" onClick={onClose}>
            Annuleren
          </button>
          <button type="submit" className="modal-button">
            {existingBlock ? 'Opslaan' : 'Toevoegen'}
          </button>
        </div>
      </form>
    </>
  );
};

export default ModalContent;
