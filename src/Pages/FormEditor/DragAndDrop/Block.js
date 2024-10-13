// src/components/DragAndDropEditor/Block.jsx

import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaGripHorizontal, FaSave } from 'react-icons/fa';
import '../css/DragAndDrop/block.css';

const Block = ({ type, label, id, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State variables for label, placeholder, and required flag
  const [fieldLabel, setFieldLabel] = useState(label);
  const [placeholder, setPlaceholder] = useState('');
  const [isRequired, setIsRequired] = useState(false);

  const renderField = () => {
    const commonProps = {
      placeholder: placeholder || 'Voer hier uw tekst in',
      required: isRequired,
    };

    switch (type) {
      case 'input':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="text" {...commonProps} />
          </>
        );
      case 'select':
        return (
          <>
            <label>{fieldLabel}</label>
            <select {...commonProps}>
              <option>Optie 1</option>
              <option>Optie 2</option>
            </select>
          </>
        );
      case 'phone':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="tel" {...commonProps} />
          </>
        );
      case 'email':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="email" {...commonProps} />
          </>
        );
      case 'picture':
        return (
          <>
            <label>{fieldLabel}</label>
            <input type="file" accept="image/*" required={isRequired} />
          </>
        );
      case 'textarea':
        return (
          <>
            <label>{fieldLabel}</label>
            <textarea {...commonProps}></textarea>
          </>
        );
      case 'title':
        return (
          <>
            <label>{fieldLabel}</label>
            <h3>{placeholder || 'Titel'}</h3>
          </>
        );
      case 'paragraph':
        return (
          <>
            <label>{fieldLabel}</label>
            <p>{placeholder || 'Paragraaf tekst hier...'}</p>
          </>
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    setIsEditing(false);
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
          <div className="editing-interface">
            <input
              type="text"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              placeholder="Naam"
            />
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Placeholder"
            />
            <div className="required-switch">
              <label className="switch-label">
                Verplicht:
                {/* Styled Toggle Switch */}
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isRequired}
                    onChange={() => setIsRequired(!isRequired)}
                  />
                  <span className="slider round"></span>
                
              </label>
            </div>
            <button className="button" onClick={handleSave}>
              <FaSave /> Opslaan
            </button>
          </div>
        ) : (
          renderField()
        )}
      </div>
      {isHovered && !isEditing && (
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
