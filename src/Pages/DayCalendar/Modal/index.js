// src/components/Modal/Modal.jsx

import React, { useState } from 'react';
import useApi from '../../../Hooks/useApi';
import './css/modalView.css';
import './css/mobile.css';

const Modal = ({ onClose, onSave, existingBlock, selectedDate }) => {
  const api = useApi();

  // State variables for basic inputs
  const [title, setTitle] = useState(existingBlock ? existingBlock.title : '');
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '00:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:59');
  const [kleurInstelling, setKleurInstelling] = useState(existingBlock ? existingBlock.kleurInstelling : '#ff0000');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlock = {
      id: existingBlock ? existingBlock.id : Date.now(),
      date: selectedDate.toDateString(),
      title,
      kleurInstelling,
      startTime,
      endTime,
    };
    onSave(newBlock);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
            <label className="modal-label">
              Start tijd:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>
            <label className="modal-label">
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
      </div>
    </div>
  );
};

export default Modal;
