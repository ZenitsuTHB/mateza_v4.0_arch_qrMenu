import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; // Ensure the correct path to your i18n configuration
import './css/languageSelection.css';

// Import flag images as ES6 modules
import DutchFlag from '../../Assets/flags/BE.webp';
import FrenchFlag from '../../Assets/flags/FR.webp';
import EnglishFlag from '../../Assets/flags/EN.webp';
import SpanishFlag from '../../Assets/flags/ES.webp';
import GermanFlag from '../../Assets/flags/DE.webp';
import PlaceholderFlag from '../../Assets/flags/BE.webp';

const languages = [
  { code: 'nl', name: 'Nederlands', flag: DutchFlag, stepText: 'Stap 1/3', titleText: 'Kies een Taal' },
  { code: 'fr', name: 'Français', flag: FrenchFlag, stepText: 'Étape 1/3', titleText: 'Choisissez une Langue' },
  { code: 'en', name: 'English', flag: EnglishFlag, stepText: 'Step 1/3', titleText: 'Choose a Language' },
  { code: 'es', name: 'Español', flag: SpanishFlag, stepText: 'Paso 1/3', titleText: 'Elige un Idioma' },
  { code: 'de', name: 'Deutsch', flag: GermanFlag, stepText: 'Schritt 1/3', titleText: 'Wähle eine Sprache' },
];

const LanguageSelection = ({ onSelectLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentText, setCurrentText] = useState(0); // To rotate text
  const [isVisible, setIsVisible] = useState(true); // For fade effect
  const { t } = useTranslation("accountOnboarding");

  // Cycle through the languages every 2 seconds, with a 1-second fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Start fade-out
      setTimeout(() => {
        setCurrentText((prevText) => (prevText + 1) % languages.length); // Move to next language
        setIsVisible(true); // Start fade-in
      }, 1000); // Wait for fade-out before changing text
    }, 5000); // 2 seconds display, 1 second transition (total 3 seconds)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language.code);
    i18n.changeLanguage(language.code); // Change language globally
    localStorage.setItem('selectedLanguage', language.code); // Save language preference in localStorage
  };

  const handleNext = () => {
    if (selectedLanguage) {
      onSelectLanguage(selectedLanguage);
    } else {
      alert(t('Please select a language.'));
    }
  };

  useEffect(() => {
    // Load saved language preference on component mount
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <div className="language-page language-page-container">
      <div className="language-title-and-selection">
        <h4 className={`language-subtitle ${isVisible ? 'fade-in' : 'fade-out'}`}>
          {languages[currentText].stepText}
        </h4>
        <h1 className={`language-title ${isVisible ? 'fade-in' : 'fade-out'}`}>
          {languages[currentText].titleText}
        </h1>
        <div className="language-selection-container">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
              onClick={() => handleSelectLanguage(language)}
            >
              <img
                src={language.flag}
                alt={`${language.name} flag`}
                className="language-flag"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PlaceholderFlag;
                }}
              />
              <span className="language-name">{language.name}</span>
            </div>
          ))}
        </div>
        {selectedLanguage && (
          <button className="next-button visible" onClick={handleNext}>
            {t('next')}
          </button>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;
