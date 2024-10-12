// AddThemeSquare.js
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import '../css/Theme/addThemeSquare.css';

const AddThemeSquare = ({ onClick }) => {
  return (
    <div className="theme-square add-theme-square" onClick={onClick}>
      <div className="add-theme-content">
        <FaPlus size={48} color="gray" />
      </div>
      <div className="theme-square-title">Nieuw Thema</div>
    </div>
  );
};

export default AddThemeSquare;
