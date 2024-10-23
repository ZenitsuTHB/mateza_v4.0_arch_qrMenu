import React, { useState } from 'react';
import './css/modalContent.css';

const ModalContent = ({ onClose, onSave, onDelete, existingBlock, selectedDate, onNext }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlock = {
      id: existingBlock ? existingBlock._id : undefined,
      _id: existingBlock ? existingBlock._id : undefined,
      date: selectedDate.toISOString().split('T')[0], // e.g., '2024-01-01'
      title,
      kleurInstelling,
      startTime,
      endTime,
    };
    onSave(newBlock);
  };

  const handleDelete = () => {
    onDelete(existingBlock);
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
          <button
            type="cancel"
            className="standard-button cancel"
            onClick={onClose}
          >
            Terug
          </button>
          {existingBlock && (
            <button
              type="button"
              className="standard-button red"
              onClick={handleDelete}
            >
              Verwijderen
            </button>
          )}
          <button
            type="button"
            className="standard-button blue"
            onClick={onNext}
          >
            Verder
          </button>
        </div>
      </form>
    </>
  );
};

export default ModalContent;
