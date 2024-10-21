// AddThemeModal.js
import React, { useState } from 'react';
import './css/addThemeModal.css';

const AddThemeModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [image, setImage] = useState(null);

  const handleSave = () => {
    if (title && image) {
      const newTheme = {
        id: new Date().getTime(),
        title,
        color,
        image,
      };
      onSave(newTheme);
    } else {
      alert('Vul alle velden in');
    }
  };

  return (
    <div className="add-theme-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>Nieuw Thema Toevoegen</h2>
        <label>Titel:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Kleur:</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <label>Afbeelding:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />
        <div className="modal-buttons">
          <button className="button" onClick={onClose}>Annuleren</button>
		  <button className="button" onClick={handleSave}>Opslaan</button>
        </div>
      </div>
    </div>
  );
};

export default AddThemeModal;
