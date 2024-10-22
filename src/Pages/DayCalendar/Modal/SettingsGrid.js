// src/components/Modal/SettingsGrid.jsx

import React from 'react';
import SettingCard from './SettingCard';
import './css/settingsGrid.css';

const SettingsGrid = ({ settings, onSelect }) => {
  return (
    <div className="settings-grid">
      {Array.isArray(settings) && settings.length > 0 ? (
        settings.map((setting) => (
          <SettingCard
            key={setting._id}
            setting={setting}
            onSelect={onSelect}
          />
        ))
      ) : (
        <p>No settings found.</p>
      )}
    </div>
  );
};

export default SettingsGrid;
