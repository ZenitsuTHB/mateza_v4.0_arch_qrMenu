// src/components/Modal/TableSettings.jsx

import React, { useState, useEffect } from 'react';

const TableSettings = ({ tafels, setTafels, show }) => {
  const [numberOfTables, setNumberOfTables] = useState(tafels.length || 3);

  useEffect(() => {
    const initialTables = [];
    for (let i = 1; i <= numberOfTables; i++) {
      initialTables.push({ id: i, name: `Tafel ${i}`, aan: true });
    }
    setTafels(initialTables);
  }, [numberOfTables, setTafels]);

  const toggleTable = (id) => {
    const updatedTables = tafels.map((tafel) =>
      tafel.id === id ? { ...tafel, aan: !tafel.aan } : tafel
    );
    setTafels(updatedTables);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="table-settings">
      <label className="modal-label">
        Aantal tafels:
        <input
          type="number"
          value={numberOfTables}
          onChange={(e) => setNumberOfTables(Number(e.target.value))}
          min={1}
          required
        />
      </label>
      <div className="tables-grid">
        {tafels.map((tafel) => (
          <div key={tafel.id} className="table-item">
            <span>{tafel.name}</span>
            <div className="switch">
              <input
                type="checkbox"
                checked={tafel.aan}
                onChange={() => toggleTable(tafel.id)}
              />
              <span className="slider"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSettings;
