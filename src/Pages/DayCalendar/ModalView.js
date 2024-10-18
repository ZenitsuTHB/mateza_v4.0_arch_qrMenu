// src/components/Modal/Modal.jsx

import React, { useState, useEffect } from 'react';
import './css/modalView.css';

const Modal = ({ onClose, onSave, existingBlock }) => {
  const [title, setTitle] = useState(existingBlock ? existingBlock.title : '');
  const [color, setColor] = useState(existingBlock ? existingBlock.color : '#ff0000');
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '00:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '01:00');

  useEffect(() => {
    if (existingBlock) {
      setTitle(existingBlock.title);
      setColor(existingBlock.color);
      setStartTime(existingBlock.startTime);
      setEndTime(existingBlock.endTime);
    }
  }, [existingBlock]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlock = {
      id: existingBlock ? existingBlock.id : Date.now(),
      title,
      color,
      startTime,
      endTime,
    };

    onSave(newBlock);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{existingBlock ? 'Edit Time Block' : 'Add Time Block'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              step="300"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              step="300"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="submit" className="modal-button">
              {existingBlock ? 'Save' : 'Add'}
            </button>
            <button type="button" className="modal-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
