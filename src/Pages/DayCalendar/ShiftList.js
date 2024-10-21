// src/components/Modal/ShiftList.jsx

import React, { useEffect } from 'react';

const ShiftList = ({ shifts, setShifts, startTime, endTime }) => {
  // Ensure the first shift's startTime is always the received startTime
  useEffect(() => {
    if (shifts.length > 0 && shifts[0].startTime !== startTime) {
      setShifts([
        { ...shifts[0], startTime },
        ...shifts.slice(1),
      ]);
    }
    // Ensure the last shift's endTime is always the received endTime
    if (shifts.length > 0) {
      const lastShift = shifts[shifts.length - 1];
      if (lastShift.endTime !== endTime) {
        setShifts([
          ...shifts.slice(0, -1),
          { ...lastShift, endTime },
        ]);
      }
    }
  }, [startTime, endTime, shifts, setShifts]);

  const addShift = () => {
    const lastShift = shifts[shifts.length - 1];
    const newShift = {
      id: Date.now(),
      name: '',
      startTime: lastShift ? lastShift.endTime : startTime,
      endTime: '',
    };
    setShifts([...shifts, newShift]);
  };

  const updateShift = (id, field, value) => {
    const updatedShifts = shifts.map((shift, index) => {
      if (shift.id === id) {
        const updatedShift = { ...shift, [field]: value };
        // If endTime is updated, update the next shift's startTime
        if (field === 'endTime' && shifts[index + 1]) {
          shifts[index + 1].startTime = value;
        }
        return updatedShift;
      }
      return shift;
    });
    setShifts([...updatedShifts]);
  };

  const removeShift = (id) => {
    const index = shifts.findIndex((shift) => shift.id === id);
    if (index === -1) return;

    const updatedShifts = shifts.filter((shift) => shift.id !== id);

    // Update the startTime of the next shift to the endTime of the removed shift's previous shift
    if (shifts[index + 1] && index > 0) {
      updatedShifts[index].startTime = shifts[index - 1].endTime;
    } else if (shifts[index + 1] && index === 0) {
      updatedShifts[index].startTime = startTime;
    }

    setShifts(updatedShifts);
  };

  return (
    <div className="shift-list">
      <h3>Shifts</h3>

      {/* Fixed Begin Time */}
      <div className="shift-item fixed-time">
        <div className="shift-time">
          <span>Begin tijd: {startTime}</span>
        </div>
      </div>

      {/* Shifts */}
      {shifts.map((shift, index) => (
        <div key={shift.id} className="shift-item">
          {/* Start Time: Not editable, except for the first shift which already shows the fixed begin time */}
          {index !== 0 && (
            <div className="shift-time">
              <span>Begin tijd: {shift.startTime}</span>
            </div>
          )}

          {/* Shift Name */}
          <div className="shift-name">
            <input
              type="text"
              placeholder="Shift naam"
              value={shift.name}
              onChange={(e) => updateShift(shift.id, 'name', e.target.value)}
              required
            />
          </div>

          {/* End Time */}
          {index !== shifts.length - 1 && (
            // Only show end time input for shifts that are not the last one
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
          )}

          {/* Delete Button: Not available for last shift if it's fixed */}
          {index !== shifts.length - 1 && (
            <button
              type="button"
              className="modal-delete-button"
              onClick={() => removeShift(shift.id)}
            >
              Verwijder
            </button>
          )}
        </div>
      ))}

      {/* Fixed End Time */}
      <div className="shift-item fixed-time">
        <div className="shift-time">
          <span>Eind tijd: {endTime}</span>
        </div>
      </div>

      <button type="button" className="modal-add-button" onClick={addShift}>
        Voeg shift toe
      </button>
    </div>
  );
};

export default ShiftList;
