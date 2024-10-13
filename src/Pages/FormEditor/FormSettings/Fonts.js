// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, useRef } from 'react';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Fonts = () => {
  const fonts = [
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

  const [selectedFont, setSelectedFont] = useState('');
  const [previewText, setPreviewText] = useState('Dit is een voorbeeldtekst.');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedFont = localStorage.getItem('pageFont');
    if (storedFont) {
      setSelectedFont(storedFont);
      document.body.style.fontFamily = storedFont;
    } else {
      document.body.style.fontFamily = 'inherit';
    }
  }, []);

  useEffect(() => {
    // Update body font when selectedFont changes
    document.body.style.fontFamily = selectedFont || 'inherit';
  }, [selectedFont]);

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    localStorage.setItem('pageFont', font);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlePreviewChange = (e) => {
    setPreviewText(e.target.value);
  };

  return (
    <div>
      <div className="form-group" ref={dropdownRef}>
        <label>Selecteer een Lettertype:</label>
        <div className="custom-select" onClick={toggleDropdown}>
          <div className="selected-option" style={{ fontFamily: selectedFont || 'inherit' }}>
            {selectedFont || 'Selecteer een lettertype'}
            <span className="arrow">{dropdownOpen ? '▲' : '▼'}</span>
          </div>
          {dropdownOpen && (
            <ul className="options-list">
              {fonts.map((font) => (
                <li
                  key={font}
                  className="option-item"
                  style={{ fontFamily: font }}
                  onClick={() => handleFontSelect(font)}
                >
                  {font}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="previewText">Voorbeeldtekst:</label>
        <input
          type="text"
          id="previewText"
          name="previewText"
          value={previewText}
          onChange={handlePreviewChange}
          placeholder="Voer tekst in voor een voorbeeld"
        />
      </div>

      <div className="font-preview" style={{ fontFamily: selectedFont }}>
        {previewText || 'Dit is een voorbeeldtekst.'}
      </div>

      <button type="submit" className="submit-button">
        Opslaan
      </button>
    </div>
  );
};

export default Fonts;
