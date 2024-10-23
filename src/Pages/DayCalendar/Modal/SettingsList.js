import React from 'react';
import './css/settingsList.css';

const SettingsList = ({ settings, onBack, onSave }) => {
  return (
    <div className="settings-list">
      <h2 className="secondary-title">Instellingen</h2>
      <div className="settings-container">
        {settings.map((setting, index) => (
          <div key={index} className="setting-item">
            <h3>{setting.title}</h3>
            <p>{setting.subtitle}</p>
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
          className="standard-button blue"
          onClick={onSave}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default SettingsList;
