// src/components/Modal/ShiftList.jsx

import React, { useState, useEffect } from 'react';

const ShiftList = ({ shifts, setShifts, startTime, endTime }) => {
  const [localShifts, setLocalShifts] = useState([]);

  useEffect(() => {
    if (shifts.length === 0) {
      setLocalShifts([
        { id: 0, name: '', startTime: startTime, endTime: endTime }
      ]);
    } else {
      setLocalShifts(shifts);
    }
  }, [shifts, startTime, endTime]);

  const addShift = () => {
    const newShift = {
      id: Date.now(),
      name: '',
      startTime: '',
      endTime: '',
    };
    setLocalShifts([...localShifts, newShift]);
  };

  const updateShift = (id, field, value) => {
    const updatedShifts = localShifts.map((shift) =>
      shift.id === id ? { ...shift, [field]: value } : shift
    );
    setLocalShifts(updatedShifts);
  };

  const removeShift = (id) => {
    const updatedShifts = localShifts.filter((shift) => shift.id !== id);
    setLocalShifts(updatedShifts);
  };

  useEffect(() => {
    setShifts(localShifts);
  }, [localShifts, setShifts]);

  return (
    <div className="shift-list">
      <h3>Shifts</h3>
      {localShifts.map((shift, index) => (
        <div key={shift.id} className="shift-item">
          {index === 0 ? (
            <>
              <div className="shift-time">
                <span>Begin tijd: {startTime}</span>
              </div>
              <div className="shift-name">
                <input
                  type="text"
                  placeholder="Shift naam"
                  value={shift.name}
                  onChange={(e) => updateShift(shift.id, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="shift-time">
                <label>
                  Eindtijd shift 1:
                  <input
                    type="time"
                    value={shift.endTime}
                    onChange={(e) => updateShift(shift.id, 'endTime', e.target.value)}
                    required
                    step={300}
                  />
                </label>
              </div>
            </>
          ) : index === localShifts.length - 1 ? (
            <>
              <div className="shift-time">
                <span>Begin tijd: {shift.startTime}</span>
              </div>
              <div className="shift-name">
                <input
                  type="text"
                  placeholder="Shift naam"
                  value={shift.name}
                  onChange={(e) => updateShift(shift.id, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="shift-time">
                <span>Eind tijd: {endTime}</span>
              </div>
            </>
          ) : (
            <>
              <div className="shift-time">
                <label>
                  Begin tijd:
                  <input
                    type="time"
                    value={shift.startTime}
                    onChange={(e) => updateShift(shift.id, 'startTime', e.target.value)}
                    required
                    step={300}
                  />
                </label>
              </div>
              <div className="shift-name">
                <input
                  type="text"
                  placeholder="Shift naam"
                  value={shift.name}
                  onChange={(e) => updateShift(shift.id, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="shift-time">
                <label>
                  Eind tijd:
                  <input
                    type="time"
                    value={shift.endTime}
                    onChange={(e) => updateShift(shift.id, 'endTime', e.target.value)}
                    required
                    step={300}
                  />
                </label>
              </div>
              <button type="button" className="modal-delete-button" onClick={() => removeShift(shift.id)}>Verwijder</button>
            </>
          )}
        </div>
      ))}
      <button type="button" className="modal-add-button" onClick={addShift}>Voeg shift toe</button>
    </div>
  );
};

export default ShiftList;
