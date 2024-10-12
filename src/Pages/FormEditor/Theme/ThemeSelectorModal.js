// ThemeSelectorModal.js
import React, { useState } from 'react';
import ThemeSquare from './ThemeSquare';
import AddThemeSquare from './AddThemeSquare';
import AddThemeModal from './AddThemeModal';
import '../css/Theme/themeSelectorModal.css';

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
  { id: 1, title: 'Ocean Breeze', color: '#5DADE2', image: image1 },
  { id: 2, title: 'Sandy Beach', color: '#F0E68C', image: image2 },
  { id: 3, title: 'Sunset Orange', color: '#FF7F50', image: image3 },
  { id: 4, title: 'Pastel Dreams', color: '#F8C8DC', image: image4 },
  { id: 5, title: 'Deep Blue', color: '#154360', image: image5 },
  { id: 6, title: 'Bordeaux Bliss', color: '#7D3C98', image: image6 },
  { id: 7, title: 'Forest Whisper', color: '#229954', image: image7 },
  { id: 8, title: 'Golden Hour', color: '#F4D03F', image: image8 },
  { id: 9, title: 'Coral Reef', color: '#FF6F61', image: image9 },
  { id: 10, title: 'Lavender Field', color: '#AF7AC5', image: image10 },
  { id: 11, title: 'Midnight Blue', color: '#34495E', image: image11 },
  { id: 12, title: 'Rosewood', color: '#B03A2E', image: image12 },
  { id: 13, title: 'Mint Fresh', color: '#48C9B0', image: image13 },
  { id: 14, title: 'Autumn Leaves', color: '#D35400', image: image14 },
  { id: 15, title: 'Creamy Beige', color: '#F5CBA7', image: image15 },
  { id: 16, title: 'Slate Gray', color: '#7F8C8D', image: image16 },
  { id: 17, title: 'Blush Pink', color: '#F1948A', image: image17 },
  { id: 18, title: 'Emerald Isle', color: '#1ABC9C', image: image18 },
  { id: 19, title: 'Chocolate Delight', color: '#6E2C00', image: image19 },
  { id: 20, title: 'Sunflower', color: '#F1C40F', image: image20 },
  { id: 21, title: 'Deep Purple', color: '#4A235A', image: image21 },
  { id: 22, title: 'Teal Twist', color: '#117A65', image: image22 },
  { id: 23, title: 'Burnt Orange', color: '#D35400', image: image23 },
  { id: 24, title: 'Soft Peach', color: '#FAD7A0', image: image24 },
  { id: 25, title: 'Royal Blue', color: '#2E86C1', image: image25 },
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
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>Stijlen</h2>
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
