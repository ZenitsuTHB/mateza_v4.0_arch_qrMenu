// ThemeSelectorModal.js
import React, { useState } from 'react';
import ThemeSquare from './Square';
import AddThemeSquare from './AddSquare';
import AddThemeModal from './AddModal';
import axios from 'axios';

import '../css/Theme/themeSelectorModal.css';
import '../css/Theme/animations.css';
import '../css/Theme/mobile.css';

import { initialThemes } from './defaultThemes';

const ThemeSelectorModal = ({ onClose, onSuccess }) => {
  const [themes, setThemes] = useState(initialThemes);
  const [showAddThemeModal, setShowAddThemeModal] = useState(false);

  const handleThemeClick = (theme) => {
    saveThemeToBackend(theme);
    onClose();
  };

  const handleAddThemeClick = () => {
    setShowAddThemeModal(true);
  };

  const saveThemeToBackend = (theme) => {
    const themeData = {
      title: theme.title,
      color: theme.color,
      image: theme.image,
    };
  
    axios.put(window.baseDomain + 'api/theme/restaurantId123', themeData)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        console.error('Error saving selected theme:', error);
      });
  };
  

  return (
    <div className="theme-page">
      <div className="theme-selector-modal">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <button className="modal-close-button" onClick={onClose}>×</button>
          <h2 className="style-title">Kies een Stijl</h2>
          <div className="theme-grid">
            {showAddThemeModal && (
              <AddThemeModal
                onClose={() => setShowAddThemeModal(false)}
                onSave={(newTheme) => {
                  setThemes([...themes, newTheme]);
                  setShowAddThemeModal(false);
                }}
              />
            )}
            <AddThemeSquare onClick={handleAddThemeClick} />
            {themes.map((theme) => (
              <ThemeSquare
                key={theme.id}
                theme={theme}
                onClick={() => handleThemeClick(theme)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectorModal;
