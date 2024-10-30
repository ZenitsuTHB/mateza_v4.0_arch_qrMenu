import React from 'react';

const ShiftItem = ({
  shift,
  shiftIndex,
  itemId,
  handleShiftInputChange,
  removeShift,
  errors,
  isSaveAttempted,
}) => (
  <div className="shift-item shift-item-box">
    {/* Shift Inputs Grid */}
    <div className="shift-inputs-grid">
      <label className="modal-label shift-input">
        Start tijd:
        <input
          type="time"
          name={`shiftStartTime-${itemId}-${shiftIndex}`}
          value={shift.startTime}
          onChange={(e) =>
            handleShiftInputChange(itemId, shiftIndex, 'startTime', e.target.value)
          }
          required
        />
        {isSaveAttempted && errors?.startTime && (
          <span className="error-shifts">{errors.startTime}</span>
        )}
        {isSaveAttempted && errors?.startTimeRange && (
          <span className="error-shifts">{errors.startTimeRange}</span>
        )}
      </label>
      <label className="modal-label shift-input">
        Shift naam:
        <input
          type="text"
          name={`shiftName-${itemId}-${shiftIndex}`}
          value={shift.name}
          onChange={(e) =>
            handleShiftInputChange(itemId, shiftIndex, 'name', e.target.value)
          }
          required
        />
        {isSaveAttempted && errors?.name && (
          <span className="error-shifts">{errors.name}</span>
        )}
      </label>
    </div>
    {/* Remove Shift Button */}
    <button
      type="button"
      className="remove-shift-button"
      onClick={() => removeShift(itemId, shiftIndex)}
    >
      Verwijder Shift
    </button>
  </div>
);

export default ShiftItem;
