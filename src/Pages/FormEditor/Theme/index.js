// ThemeSelectorModal.js
import React, { useState } from 'react';
import ThemeSquare from './Square';
import AddThemeSquare from './AddSquare';
import AddThemeModal from './AddModal';
import '../css/Theme/themeSelectorModal.css';
import '../css/Theme/animations.css';
import '../css/Theme/mobile.css';

import image1 from '../../../Assets/themes/small/1.webp';
import image2 from '../../../Assets/themes/small/2.webp';
import image3 from '../../../Assets/themes/small/3.webp';
import image4 from '../../../Assets/themes/small/4.webp';
import image5 from '../../../Assets/themes/small/5.webp';
import image6 from '../../../Assets/themes/small/6.webp';
import image7 from '../../../Assets/themes/small/7.webp';
import image8 from '../../../Assets/themes/small/8.webp';
import image9 from '../../../Assets/themes/small/9.webp';
import image10 from '../../../Assets/themes/small/10.webp';
import image11 from '../../../Assets/themes/small/11.webp';
import image12 from '../../../Assets/themes/small/12.webp';
import image13 from '../../../Assets/themes/small/13.webp';
import image14 from '../../../Assets/themes/small/14.webp';
import image15 from '../../../Assets/themes/small/15.webp';
import image16 from '../../../Assets/themes/small/16.webp';
import image17 from '../../../Assets/themes/small/17.webp';
import image18 from '../../../Assets/themes/small/18.webp';
import image19 from '../../../Assets/themes/small/19.webp';
import image20 from '../../../Assets/themes/small/20.webp';
import image21 from '../../../Assets/themes/small/21.webp';
import image22 from '../../../Assets/themes/small/22.webp';
import image23 from '../../../Assets/themes/small/23.webp';
import image24 from '../../../Assets/themes/small/24.webp';
import image25 from '../../../Assets/themes/small/25.webp';

const initialThemes = [
  { id: 1, title: 'Oceaan Bries', color: '#5DADE2', image: image1 },
  { id: 2, title: 'Zandstrand', color: '#F0E68C', image: image23 },
  { id: 3, title: 'Zonsondergang Oranje', color: '#FF7F50', image: image6 },
  { id: 4, title: 'Pastel Dromen', color: '#F8C8DC', image: image7 },
  { id: 5, title: 'Diep Blauw', color: '#154360', image: image8 },
  { id: 6, title: 'Bordeaux Geluk', color: '#7D3C98', image: image20 },
  { id: 7, title: 'Bosfluistering', color: '#229954', image: image13 },
  { id: 8, title: 'Gouden Uur', color: '#F4D03F', image: image14 },
  { id: 9, title: 'Koraalrif', color: '#FF6F61', image: image18 },
  { id: 10, title: 'Lavendelveld', color: '#AF7AC5', image: image11 },
  { id: 11, title: 'Middernacht Blauw', color: '#34495E', image: image3 },
  { id: 12, title: 'Palisander', color: '#B03A2E', image: image22 },
  { id: 13, title: 'Verse Munt', color: '#48C9B0', image: image4 },
  { id: 14, title: 'Herfstbladeren', color: '#D35400', image: image10 },
  { id: 15, title: 'Romig Beige', color: '#F5CBA7', image: image25 },
  { id: 16, title: 'Leigrijs', color: '#7F8C8D', image: image19 },
  { id: 17, title: 'Blozend Roze', color: '#F1948A', image: image17 },
  { id: 18, title: 'Smaragd Eiland', color: '#1ABC9C', image: image9 },
  { id: 19, title: 'Chocolade Genot', color: '#6E2C00', image: image16 },
  { id: 20, title: 'Zonnebloem', color: '#F1C40F', image: image5 },
  { id: 21, title: 'Diep Paars', color: '#4A235A', image: image21 },
  { id: 22, title: 'Blauwgroene Twist', color: '#117A65', image: image12 },
  { id: 23, title: 'Gebrand Oranje', color: '#D35400', image: image2 },
  { id: 24, title: 'Zachte Perzik', color: '#FAD7A0', image: image24 },
  { id: 25, title: 'Koningsblauw', color: '#2E86C1', image: image15 },
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
    <div className="theme-page">
    <div className="theme-selector-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2 className="style-title">Stijlen</h2>
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
            <ThemeSquare key={theme.id} theme={theme} onClick={() => handleThemeClick(theme)} />
          ))}
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default ThemeSelectorModal;
