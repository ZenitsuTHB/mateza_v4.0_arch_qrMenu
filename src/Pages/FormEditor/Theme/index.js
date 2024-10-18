// src/components/Theme/ThemeSelectorModal.jsx

import React, { useState } from 'react';
import ThemeSquare from './Square';
import AddThemeSquare from './AddSquare';
import AddThemeModal from './AddModal';
import useApi from '../../../Hooks/useApi'; // Adjust the import path as necessary

import '../css/Theme/themeSelectorModal.css';
import '../css/Theme/animations.css';
import '../css/Theme/mobile.css';

import { initialThemes } from './defaultThemes';

const ThemeSelectorModal = ({ onClose, onSuccess }) => {
  const [themes, setThemes] = useState(initialThemes);
  const [showAddThemeModal, setShowAddThemeModal] = useState(false);
  const api = useApi(); // Initialize the useApi hook

  /**
   * Handles the click event on a theme square.
   * Saves the selected theme to the backend, notifies the parent component,
   * and closes the modal.
   *
   * @param {Object} theme - The selected theme object.
   */
  const handleThemeClick = async (theme) => {
    try {
      await saveThemeToBackend(theme);
      onSuccess(theme); // Pass the selected theme back to the parent
      onClose();
    } catch (error) {
      // Optional: Implement user-facing error handling here (e.g., notifications)
      console.error('Failed to save the selected theme:', error);
    }
  };

  /**
   * Opens the Add Theme Modal.
   */
  const handleAddThemeClick = () => {
    setShowAddThemeModal(true);
  };

  /**
   * Saves the selected theme and its background color to the backend.
   *
   * @param {Object} theme - The theme object to save.
   */
  const saveThemeToBackend = async (theme) => {
    const themeData = {
      id: theme.id,
      title: theme.title,
      color: theme.color,
      image: theme.image,
    };

    const themeColor = { backgroundColor: theme.color };

    try {
      // Save the theme data
      await api.put(
        `${window.baseDomain}api/theme/${window.restaurantId}`,
        themeData
      );
      console.log('Theme saved successfully');

      // Update the background color
      await api.put(
        `${window.baseDomain}api/colors/${window.restaurantId}/background-color`,
        themeColor
      );
      console.log('Background color updated successfully');
    } catch (error) {
      // Handle errors for both requests
      console.error('Error saving theme or updating background color:', error);
      throw error; // Propagate the error to be handled in handleThemeClick
    }
  };

  /**
   * Handles the saving of a new theme from the AddThemeModal.
   *
   * @param {Object} newTheme - The new theme object to add.
   */
  const handleSaveNewTheme = (newTheme) => {
    setThemes([...themes, newTheme]);
    setShowAddThemeModal(false);
  };

  return (
    <div className="theme-page">
      <div className="theme-selector-modal">
        {/* Overlay to capture clicks outside the modal content */}
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          {/* Close Button */}
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>

          {/* Modal Title */}
          <h2 className="style-title">Kies een Stijl</h2>

          {/* Theme Grid */}
          <div className="theme-grid">
            {/* Conditionally render the AddThemeModal */}
            {showAddThemeModal && (
              <AddThemeModal
                onClose={() => setShowAddThemeModal(false)}
                onSave={handleSaveNewTheme}
              />
            )}

            {/* Add Theme Square */}
            <AddThemeSquare onClick={handleAddThemeClick} />

            {/* Render Theme Squares */}
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
