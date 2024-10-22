// src/components/Modal/SettingCard.jsx

import React from 'react';

const SettingCard = ({ setting, onSelect }) => {
  return (
    <div
      className="setting-card"
      onClick={() => onSelect(setting)}
    >
      <h4>{setting.title}</h4>
      <p>{setting.toewijzingsmanier}</p>
    </div>
  );
};

export default SettingCard;
