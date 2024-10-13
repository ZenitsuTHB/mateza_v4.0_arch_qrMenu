// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, useRef } from 'react';
import WebFont from 'webfontloader';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Fonts = () => {
  const availableFonts = [
    'Poppins',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
  ];

  // Define font categories
  const fontCategories = [
    { key: 'titleFont', label: 'Titel' },
    { key: 'subtitleFont', label: 'Subtitel' },
    { key: 'labelFont', label: 'Label Tekst' },
    { key: 'buttonFont', label: 'Knop' },
  ];

  // Initialize state for each font category
  const [fontsState, setFontsState] = useState({
    titleFont: 'Poppins',
    subtitleFont: 'Poppins',
    labelFont: 'Poppins',
    buttonFont: 'Poppins',
  });

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({
    titleFont: false,
    subtitleFont: false,
    labelFont: false,
    buttonFont: false,
  });

  const dropdownRefs = {
    titleFont: useRef(null),
    subtitleFont: useRef(null),
    labelFont: useRef(null),
    buttonFont: useRef(null),
  };

  // Load fonts from localStorage on mount
  useEffect(() => {
    const storedFonts = { ...fontsState };
    fontCategories.forEach(({ key }) => {
      const storedFont = localStorage.getItem(key);
      if (storedFont) {
        storedFonts[key] = storedFont;
      }
    });
    setFontsState(storedFonts);
  }, []); // Empty dependency array ensures this runs once on mount

  // Load selected fonts using WebFont loader
  useEffect(() => {
    const fontsToLoad = Array.from(new Set(Object.values(fontsState))); // Remove duplicates
    WebFont.load({
      google: {
        families: fontsToLoad,
      },
      active: () => {
        // Fonts loaded
      },
      inactive: () => {
        console.error('Failed to load fonts.');
      },
    });
  }, [fontsState]);

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      fontCategories.forEach(({ key }) => {
        if (
          dropdownRefs[key].current &&
          !dropdownRefs[key].current.contains(event.target)
        ) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle font selection
  const handleFontSelect = (categoryKey, font) => {
    setFontsState((prev) => ({
      ...prev,
      [categoryKey]: font,
    }));
    localStorage.setItem(categoryKey, font);
    setDropdownOpen((prev) => ({ ...prev, [categoryKey]: false })); // Close the dropdown
  };

  // Toggle dropdown
  const toggleDropdown = (categoryKey) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  return (
    <div className="fonts-container">
      {fontCategories.map(({ key, label }) => (
        <div className="form-group" key={key} ref={dropdownRefs[key]}>
          <label>{label}:</label>
          <div className="custom-select">
            <div
              className={`selected-option ${dropdownOpen[key] ? 'open' : ''}`}
              style={{ fontFamily: fontsState[key] }}
              onClick={() => toggleDropdown(key)}
            >
              {fontsState[key] === 'Poppins'
                ? 'Poppins (standaard)'
                : fontsState[key]}
              <span className="arrow">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  style={{
                    transform: dropdownOpen[key]
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path
                    d="M7 10l5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>
            </div>
            {dropdownOpen[key] && (
              <ul className="options-list">
                {availableFonts.map((font) => (
                  <li
                    key={font}
                    className="option-item"
                    style={{ fontFamily: font }}
                    onClick={() => handleFontSelect(key, font)}
                  >
                    {font === 'Poppins' ? 'Poppins (standaard)' : font}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Opslaan
      </button>
    </div>
  );
};

export default Fonts;
