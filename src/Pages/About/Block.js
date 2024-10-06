// src/components/DragAndDropEditor/Block.jsx

import React, { useState } from 'react';
import { FaTrashAlt, FaEllipsisV, FaEdit } from 'react-icons/fa';
import './css/block.css';

const Block = ({ type, label, id, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const renderField = () => {
    switch (type) {
      case 'input':
        return <input type="text" placeholder="Invoerveld" />;
      case 'select':
        return (
          <select>
            <option>Optie 1</option>
            <option>Optie 2</option>
          </select>
        );
      case 'phone':
        return <input type="tel" placeholder="Telefoonnummer" />;
      case 'email':
        return <input type="email" placeholder="Emailadres" />;
      case 'picture':
        return <input type="file" accept="image/*" />;
      case 'textarea':
        return <textarea placeholder="Tekstveld"></textarea>;
      case 'title':
        return <h3>Titel</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="block">
      <div className="block-content">{renderField()}</div>
      <button className="options-button" onClick={() => setShowMenu(!showMenu)}>
        <FaEllipsisV />
      </button>
      {showMenu && (
        <div className="options-menu">
          <div className="menu-item" onClick={() => setShowMenu(false)}>
            <FaEdit />
            <span>Bewerken</span>
          </div>
          <div className="menu-item" onClick={() => onDelete(id)}>
            <FaTrashAlt />
            <span>Verwijderen</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Block;
