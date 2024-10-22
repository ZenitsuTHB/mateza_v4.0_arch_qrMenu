
import React from 'react';
import ModalContent from './ModalContent';
import './css/modalView.css';

const Modal = ({ onClose, onSave, existingBlock, selectedDate }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModalContent onClose={onClose} onSave={onSave} existingBlock={existingBlock} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Modal;