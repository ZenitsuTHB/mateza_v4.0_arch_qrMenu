// src/components/DragAndDropEditor/Block.jsx

import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaGripHorizontal } from 'react-icons/fa';
import '../css/DragAndDrop/block.css';

const Block = ({ type, label, id, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldLabel, setFieldLabel] = useState(label);

  const renderField = () => {
    switch (type) {
      case 'input':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="text" placeholder="Invoerveld" />
          </>
        );
      case 'select':
        return (
          <>
            <label>{fieldLabel}</label>
            <select>
              <option>Optie 1</option>
              <option>Optie 2</option>
            </select>
          </>
        );
      case 'phone':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="tel" placeholder="Telefoonnummer" />
          </>
        );
      case 'email':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="email" placeholder="Emailadres" />
          </>
        );
      case 'picture':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="file" accept="image/*" />
          </>
        );
      case 'textarea':
        return (
          <>
            <label>{fieldLabel}</label>
            <textarea placeholder="Tekstveld"></textarea>
          </>
        );
      case 'title':
        return (
          <>
            <label>{fieldLabel}</label>
            <h3>Titel</h3>
          </>
        );
      case 'paragraph':
        return (
          <>
            <label>{fieldLabel}</label>
            <p>Paragraaf tekst hier...</p>
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
      onMouseLeave={() => {
        setIsHovered(false);
        setIsEditing(false);
      }}
    >
      <div className="drag-handle">
        <FaGripHorizontal />
      </div>
      <div className="block-content">
        {isEditing ? (
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          renderField()
        )}
      </div>
      {isHovered && (
        <div className="action-icons">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
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
