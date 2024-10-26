// src/components/Modal/ModalContent.jsx

import React, { useState } from 'react';
import { formatDateKey } from '../Utils/dateFormat';
import './css/modalContent.css';

const ModalContent = ({ onClose, onSave, onDelete, existingBlock, selectedDate }) => {
  const formatDateDutch = (date) => {
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const [title, setTitle] = useState(existingBlock ? existingBlock.title : `Tijdsblok (${formatDateDutch(selectedDate)})`);
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '17:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:00');
  const [kleurInstelling, setKleurInstelling] = useState(existingBlock ? existingBlock.kleurInstelling : '#2c909b');
  const [zitplaatsen, setZitplaatsen] = useState(existingBlock ? existingBlock.zitplaatsen : 1); // New state for zitplaatsen

  const handleSubmit = (e, continueToSettings = false) => {
    e.preventDefault();

    // Validate zitplaatsen to ensure it's a positive number
    if (zitplaatsen < 1) {
      alert('Zitplaatsen moet een positief getal zijn.');
      return;
    }

    const newBlock = {
      id: existingBlock ? existingBlock._id : undefined,
      _id: existingBlock ? existingBlock._id : undefined,
      date: formatDateKey(selectedDate),
      title,
      kleurInstelling,
      startTime,
      endTime,
      zitplaatsen, // Include zitplaatsen in the newBlock
    };
    onSave(newBlock, continueToSettings);
  };

  const handleDelete = () => {
    onDelete(existingBlock);
  };

  return (
    <>
      <h2 className="secondary-title">{existingBlock ? 'Blok Bewerken' : 'Blok Toevoegen'}</h2>
      <form onSubmit={(e) => handleSubmit(e, false)}>
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
            Start:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label className="modal-label time-input">
            Einde:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>
        {/* New Zitplaatsen Input */}
        <label className="modal-label">
          Max Capaciteit Gasten:
          <input
            type="number"
            value={zitplaatsen}
            onChange={(e) => setZitplaatsen(Number(e.target.value))}
            min="1"
            required
          />
        </label>
        <label className="modal-label">
          Kleur:
          <input
            type="color"
            value={kleurInstelling}
            onChange={(e) => setKleurInstelling(e.target.value)}
            required
          />
        </label>
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
