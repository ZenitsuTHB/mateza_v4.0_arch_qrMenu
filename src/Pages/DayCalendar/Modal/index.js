// src/components/Modal/index.js

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

  const handleSave = (blockData, continueToSettings = false) => {
    onSave(blockData);
    if (continueToSettings) {
      setIsSettingsView(true);
    }
  };

  const handleCreateNewSetting = () => {
    setIsSettingsView(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isSettingsView ? (
          <SettingsList
            settings={settings}
            onBack={handleBack}
            onSave={handleSave}
            onCreateNewSetting={handleCreateNewSetting}
          />
        ) : (
          <ModalContent
            onClose={onClose}
            onSave={handleSave}
            onDelete={onDelete}
            existingBlock={existingBlock}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
