// src/components/LanguageSelection/LanguageSelection.jsx

import React, { useState } from 'react';
import './css/languageSelection.css';

// Import flag images as ES6 modules
import DutchFlag from '../../Assets/flags/BE.png';
import FrenchFlag from '../../Assets/flags/FR.png';
import EnglishFlag from '../../Assets/flags/EN.png';
import SpanishFlag from '../../Assets/flags/ES.png';
import GermanFlag from '../../Assets/flags/DE.png';
import PlaceholderFlag from '../../Assets/flags/BE.png';

const languages = [
  { code: 'nl', name: 'Nederlands', flag: DutchFlag },
  { code: 'fr', name: 'Français', flag: FrenchFlag },
  { code: 'en', name: 'English', flag: EnglishFlag },
  { code: 'es', name: 'Español', flag: SpanishFlag },
  { code: 'de', name: 'Deutsch', flag: GermanFlag },
];

const LanguageSelection = ({ onSelectLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

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
        <h4 className="language-subtitle">Stap 1/3</h4>
        <h1 className="language-title">Kies een Taal</h1>
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
