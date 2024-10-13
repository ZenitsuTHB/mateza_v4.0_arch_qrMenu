// src/components/Theme/ThemeSelectorModal.js

import React, { useState, useEffect } from 'react';
import ThemeSquare from './Square';
import AddThemeSquare from './AddSquare';
import AddThemeModal from './AddModal';
import '../css/Theme/themeSelectorModal.css';
import '../css/Theme/animations.css';
import '../css/Theme/mobile.css';

import { initialThemes } from './defaultThemes';
import useNotification from '../../../Components/Notification/index.js'; // Adjust the import path as needed

const ThemeSelectorModal = ({ onClose }) => {
  const [themes, setThemes] = useState(initialThemes);
  const [showAddThemeModal, setShowAddThemeModal] = useState(false);
  const { triggerNotification } = useNotification();

  // Load themes from localStorage on mount (optional)
  useEffect(() => {
    const storedThemes = localStorage.getItem('customThemes');
    if (storedThemes) {
      setThemes(JSON.parse(storedThemes));
    }
  }, []);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customThemes', JSON.stringify(themes));
  }, [themes]);

  const handleThemeClick = (theme) => {
    // Set selected theme in localStorage
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
    localStorage.setItem('backgroundColor', theme.color);
    localStorage.setItem('buttonColor', theme.color);
    // Add more theme-related properties to localStorage as needed

    // Trigger success notification
    triggerNotification('Thema geselecteerd', 'success');

    // Close the modal
    onClose();
  };

  const handleAddTheme = (newTheme) => {
    // Add the new theme to the themes state
    setThemes((prevThemes) => [...prevThemes, newTheme]);

    // Optionally, persist the new theme to a backend or additional storage

    // Trigger success notification
    triggerNotification('Nieuw thema toegevoegd', 'success');
  };

  return (
    <div className="theme-page">
      <div className="theme-selector-modal">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
          <h2 className="style-title">Kies een Stijl</h2>
          <div className="theme-grid">
            {showAddThemeModal && (
              <AddThemeModal
                onClose={() => setShowAddThemeModal(false)}
                onSave={(newTheme) => {
                  handleAddTheme(newTheme);
                  setShowAddThemeModal(false);
                }}
              />
            )}
            <AddThemeSquare onClick={() => setShowAddThemeModal(true)} />
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
