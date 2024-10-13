// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect } from 'react';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Fonts = () => {
  const [fonts] = useState([
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
  ]);

  const [selectedFont, setSelectedFont] = useState('');
  const [previewText, setPreviewText] = useState('Dit is een voorbeeldtekst.');

  useEffect(() => {
    if (selectedFont) {
      
		document.body.style.fontFamily = selectedFont;
    } else {
      document.body.style.fontFamily = 'inherit';
    }

    // Retrieve stored font from localStorage
    const storedFont = localStorage.getItem('pageFont');
    if (storedFont) {
      setSelectedFont(storedFont);
    }
  }, [selectedFont]);

  const handleFontChange = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    localStorage.setItem('pageFont', font);
  };

  const handlePreviewChange = (e) => {
    setPreviewText(e.target.value);
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="pageFont">Selecteer een Lettertype:</label>
        <select
          id="pageFont"
          name="pageFont"
          value={selectedFont}
          onChange={handleFontChange}
          required
        >
          <option value="">Selecteer een lettertype</option>
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
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

      <button
        type="submit"
        className="submit-button"
      >
        Opslaan
      </button>
    </div>
  );
};

export default Fonts;
