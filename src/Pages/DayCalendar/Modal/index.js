// src/components/Modal/Modal.jsx

import React, { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';
import TimeInput from './TimeInput';
import ColorPicker from './ColorPicker';
import './css/modalView.css';

const Modal = ({ onClose, onSave, existingBlock, selectedDate }) => {
  const api = useApi();

  // State variables for basic inputs
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '00:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:59');
  const [kleurInstelling, setKleurInstelling] = useState(existingBlock ? existingBlock.kleurInstelling : '#ff0000');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlock = {
      id: existingBlock ? existingBlock.id : Date.now(),
      date: selectedDate.toDateString(),
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
          <TimeInput label="Start tijd" value={startTime} onChange={setStartTime} />
          <TimeInput label="Eindtijd" value={endTime} onChange={setEndTime} />
          <ColorPicker label="Kleur instelling" value={kleurInstelling} onChange={setKleurInstelling} />
          <div className="modal-buttons">
            <button type="submit" className="modal-button">
              {existingBlock ? 'Opslaan' : 'Toevoegen'}
            </button>
            <button type="button" className="modal-button" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
