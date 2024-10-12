// ThemeSelectorModal.js
import React, { useState } from 'react';
import ThemeSquare from './ThemeSquare';
import AddThemeSquare from './AddThemeSquare';
import AddThemeModal from './AddThemeModal';
import '../css/Theme/themeSelectorModal.css';

const initialThemes = [
  { id: 1, title: 'Thema 1', color: '#ff0000', image: 'image1.png' },
  { id: 2, title: 'Thema 2', color: '#00ff00', image: 'image2.png' },
  // Add more themes as needed
];

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
    <div className="theme-selector-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Selecteer een thema</h2>
        <div className="theme-grid">
          {themes.map((theme) => (
            <ThemeSquare key={theme.id} theme={theme} onClick={() => handleThemeClick(theme)} />
          ))}
          <AddThemeSquare onClick={handleAddThemeClick} />
        </div>
      </div>
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
    </div>
  );
};

export default ThemeSelectorModal;
