import React, { useState } from 'react';
import ModalContent from './ModalContent';
import SettingsList from './SettingsList';
import './css/modalView.css';

const Modal = ({ onClose, onSave, onDelete, existingBlock, selectedDate }) => {
  const [isSettingsView, setIsSettingsView] = useState(false);

  // Dummy settings data
  const settings = [
    { title: 'Setting 1', subtitle: 'Subtitle for setting 1' },
    { title: 'Setting 2', subtitle: 'Subtitle for setting 2' },
    { title: 'Setting 3', subtitle: 'Subtitle for setting 3' },
    { title: 'Setting 4', subtitle: 'Subtitle for setting 4' },
  ];

  const handleNext = () => {
    setIsSettingsView(true);
  };

  const handleBack = () => {
    setIsSettingsView(false);
  };

  const handleSave = (blockData) => {
    setIsSettingsView(false); // Optional, you can decide whether to return to the form view after save
    onSave(blockData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isSettingsView ? (
          <SettingsList
            settings={settings}
            onBack={handleBack}
            onSave={handleSave}
          />
        ) : (
          <ModalContent
            onClose={onClose}
            onSave={handleSave}
            onDelete={onDelete}
            existingBlock={existingBlock}
            selectedDate={selectedDate}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
