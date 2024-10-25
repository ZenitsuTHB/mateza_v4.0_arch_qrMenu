// src/components/Modal/SettingsList.jsx

import React, { useState } from 'react';
import './css/settingsList.css';

const SettingsList = ({ settings, onBack, onSave, onCreateNewSetting }) => {
  const [selectedSetting, setSelectedSetting] = useState(null);

  const handleSelectSetting = (index) => {
    setSelectedSetting(index);
  };

  const handleSave = () => {
    if (selectedSetting !== null) {
      onSave(settings[selectedSetting]);
    }
  };

  return (
    <div className="settings-list">
      <h2 className="secondary-title">Instellingen</h2>
      <div
        className="setting-item create-new"
        onClick={onCreateNewSetting}
        style={{ cursor: 'pointer' }}
      >
        <h3>+ Nieuwe Instelling Aanmaken</h3>
      </div>
      <div className="settings-container">
        {settings.map((setting, index) => (
          <div
            key={index}
            className={`setting-item ${selectedSetting === index ? 'selected' : ''}`}
            onClick={() => handleSelectSetting(index)}
          >
            <input
              type="radio"
              checked={selectedSetting === index}
              onChange={() => handleSelectSetting(index)}
            />
            <div className="setting-text">
              <h3>{setting.title}</h3>
              <p>{setting.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="modal-buttons">
        <button
          type="button"
          className="standard-button cancel"
          onClick={onBack}
        >
          Terug
        </button>
        <button
          type="button"
          className="standard-button blue spaced"
          onClick={handleSave}
          disabled={selectedSetting === null}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default SettingsList;
