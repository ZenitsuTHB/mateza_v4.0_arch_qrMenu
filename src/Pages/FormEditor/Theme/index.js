// ThemeSelectorModal.js
import React, { useState } from 'react';
import ThemeSquare from './Square';
import AddThemeSquare from './AddSquare';
import AddThemeModal from './AddModal';
import '../css/Theme/themeSelectorModal.css';
import '../css/Theme/animations.css';
import '../css/Theme/mobile.css';

import { initialThemes } from './defaultThemes';

const ThemeSelectorModal = ({ onClose, onSelectTheme, onAddTheme }) => {
  const [themes, setThemes] = useState(initialThemes);
  const [showAddThemeModal, setShowAddThemeModal] = useState(false);

  const handleThemeClick = (theme) => {
    onSelectTheme(theme);
    onClose();
  };

  const handleAddThemeClick = () => {
    setShowAddThemeModal(true);
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
                  onAddTheme(newTheme);
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
