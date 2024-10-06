// src/components/DragAndDropEditor/Block.jsx

import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaGripHorizontal } from 'react-icons/fa';
import './css/block.css';

const Block = ({ type, label, id, onDelete, provided }) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderField = () => {
    switch (type) {
      case 'input':
        return (
          <>
            <label>Invoerveld</label>
            <input type="text" placeholder="Invoerveld" />
          </>
        );
      case 'select':
        return (
          <>
            <label>Selectievak</label>
            <select>
              <option>Optie 1</option>
              <option>Optie 2</option>
            </select>
          </>
        );
      case 'phone':
        return (
          <>
            <label>Telefoonnummer</label>
            <input type="tel" placeholder="Telefoonnummer" />
          </>
        );
      case 'email':
        return (
          <>
            <label>Emailadres</label>
            <input type="email" placeholder="Emailadres" />
          </>
        );
      case 'picture':
        return (
          <>
            <label>Afbeelding</label>
            <input type="file" accept="image/*" />
          </>
        );
      case 'textarea':
        return (
          <>
            <label>Tekstveld</label>
            <textarea placeholder="Tekstveld"></textarea>
          </>
        );
      case 'title':
        return (
          <>
            <h3>Titel</h3>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`block ${isHovered ? 'selected' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="drag-handle" {...provided.dragHandleProps}>
        <FaGripHorizontal />
      </div>
      <div className="block-content">{renderField()}</div>
      {isHovered && (
        <div className="action-icons">
          <button className="edit-button">
            <FaEdit />
          </button>
          <button className="delete-button" onClick={() => onDelete(id)}>
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};

export default Block;
