// TableEditModalContent.js
import React, { useState } from 'react';
import './css/tableEditModalContent.css'

const TableEditModalContent = ({ element, onSave, onClose }) => {
  const [tableNumber, setTableNumber] = useState(element.tableNumber || '');
  const [name, setName] = useState(element.name || '');
  const [shape, setShape] = useState(element.shape || 'rond');
  const [minCapacity, setMinCapacity] = useState(element.minCapacity || 1);
  const [maxCapacity, setMaxCapacity] = useState(element.maxCapacity || 10);
  const [priority, setPriority] = useState(element.priority || 'Medium');

  const handleSave = () => {
    const updatedElement = {
      ...element,
      tableNumber,
      name,
      shape,
      minCapacity,
      maxCapacity,
      priority,
    };
    onSave(updatedElement);
  };

  return (
    <div className="table-edit-modal-content">
      <h2>Table Details</h2>
      <div className="form-group">
        <label>Tafelnummer</label>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Naam</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Vorm</label>
        <select value={shape} onChange={(e) => setShape(e.target.value)}>
          <option value="rond">Rond</option>
          <option value="vierkant">Vierkant</option>
          <option value="metStoelen">Met Stoelen</option>
        </select>
      </div>
      <div className="form-group">
        <label>Min capaciteit</label>
        <input
          type="number"
          value={minCapacity}
          onChange={(e) => setMinCapacity(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Max capaciteit</label>
        <input
          type="number"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Prioriteit</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="metVoorangInvullen">Met Voorang Invullen</option>
          <option value="snellerInvullen">Sneller Invullen</option>
          <option value="tragerInvullen">Trager Invullen</option>
          <option value="alsLaatsteIndelen">Als Laatste Indelen</option>
        </select>
      </div>
      <button className="save-button" onClick={handleSave}>
        Opslaan
      </button>
    </div>
  );
};

export default TableEditModalContent;
