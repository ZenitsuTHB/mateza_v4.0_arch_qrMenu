import React, { useState, useEffect } from 'react';
import './css/languageSelection.css';

// Import flag images as ES6 modules
import DutchFlag from '../../Assets/flags/BE.png';
import FrenchFlag from '../../Assets/flags/FR.png';
import EnglishFlag from '../../Assets/flags/EN.png';
import SpanishFlag from '../../Assets/flags/ES.png';
import GermanFlag from '../../Assets/flags/DE.png';
import PlaceholderFlag from '../../Assets/flags/BE.png';

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
  };

  const handleNext = () => {
    if (selectedLanguage) {
      onSelectLanguage(selectedLanguage);
    } else {
      alert('Please select a language.');
    }
  };

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
            Volgende
          </button>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;
