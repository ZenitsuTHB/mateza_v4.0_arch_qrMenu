// src/components/Modal/Scheme.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/scheme.css';
import useSchemeValidation from './Hooks/useSchemeValidation'; // Import the custom hook

const Scheme = ({
  schemeSettings,
  setschemeSettings,
  onSaveScheme,
  onDeleteScheme,
  defaultStartTime,
  defaultEndTime,
  triggerNotification,
}) => {
  const items = [
    { id: 'Monday', label: 'Maandag', type: 'day' },
    { id: 'Tuesday', label: 'Dinsdag', type: 'day' },
    { id: 'Wednesday', label: 'Woensdag', type: 'day' },
    { id: 'Thursday', label: 'Donderdag', type: 'day' },
    { id: 'Friday', label: 'Vrijdag', type: 'day' },
    { id: 'Saturday', label: 'Zaterdag', type: 'day' },
    { id: 'Sunday', label: 'Zondag', type: 'day' },
    { id: 'period', label: 'Herhalen voor Beperkte Periode', type: 'duration' },
  ];

  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const { errors, validate } = useSchemeValidation(items, schemeSettings);

  const handleToggle = (itemId) => {
    setschemeSettings((prev) => {
      const isEnabled = prev[itemId]?.enabled;
      if (!isEnabled) {
        return {
          ...prev,
          [itemId]: {
            enabled: true,
            startTime:
              prev[itemId]?.startTime ||
              (items.find((item) => item.id === itemId).type === 'day'
                ? defaultStartTime
                : ''),
            endTime:
              prev[itemId]?.endTime ||
              (items.find((item) => item.id === itemId).type === 'day'
                ? defaultEndTime
                : ''),
            startDate: prev[itemId]?.startDate || '',
            endDate: prev[itemId]?.endDate || '',
            shiftsEnabled: false,
            shifts: [],
          },
        };
      } else {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleShiftsToggle = (itemId) => {
    setschemeSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        shiftsEnabled: !prev[itemId]?.shiftsEnabled,
        shifts: !prev[itemId]?.shiftsEnabled ? [] : prev[itemId].shifts,
      },
    }));
  };

  const handleInputChange = (itemId, field, value) => {
    setschemeSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleShiftInputChange = (itemId, shiftIndex, field, value) => {
    setschemeSettings((prev) => {
      const shifts = [...(prev[itemId]?.shifts || [])];
      shifts[shiftIndex] = {
        ...shifts[shiftIndex],
        [field]: value,
      };
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          shifts,
        },
      };
    });
  };

  const addShift = (itemId) => {
    setschemeSettings((prev) => {
      const shifts = [...(prev[itemId]?.shifts || [])];
      shifts.push({
        name: '',
        startTime: '',
      });
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          shifts,
        },
      };
    });
  };

  const removeShift = (itemId, shiftIndex) => {
    setschemeSettings((prev) => {
      const shifts = [...(prev[itemId]?.shifts || [])];
      shifts.splice(shiftIndex, 1);
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          shifts,
        },
      };
    });
  };

  const handleSaveScheme = () => {
    setIsSaveAttempted(true);
    if (validate()) {
      onSaveScheme();
    } else {
      triggerNotification('Controleer de invulvelden', 'warning');
    }
  };

  return (
    <div>
      <h2 className="secondary-title">Openingsuren</h2>
      <div className="scheme-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`scheme-item ${
              item.type !== 'day' ? 'scheme-item-special' : ''
            }`}
          >
            {/* Day Header */}
            <div className="day-header">
              <span className="day-label">{item.label}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={schemeSettings[item.id]?.enabled || false}
                  onChange={() => handleToggle(item.id)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Day Inputs */}
            <AnimatePresence>
              {schemeSettings[item.id]?.enabled && (
                <motion.div
                  className="time-inputs-container"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  {item.type === 'day' ? (
                    <>
                      <label className="modal-label time-input">
                        Start tijd:
                        <input
                          type="time"
                          name={`startTime-${item.id}`}
                          value={schemeSettings[item.id]?.startTime || ''}
                          onChange={(e) =>
                            handleInputChange(item.id, 'startTime', e.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="modal-label time-input">
                        Eindtijd:
                        <input
                          type="time"
                          name={`endTime-${item.id}`}
                          value={schemeSettings[item.id]?.endTime || ''}
                          onChange={(e) =>
                            handleInputChange(item.id, 'endTime', e.target.value)
                          }
                          required
                        />
                      </label>
                      {isSaveAttempted &&
                        errors[item.id] &&
                        Object.values(errors[item.id]).map((errorMsg, index) => (
                          <span key={index} className="error-message">
                            {errorMsg}
                          </span>
                        ))}
                    </>
                  ) : (
                    <>
                      <label className="modal-label date-input">
                        Start datum:
                        <input
                          type="date"
                          name={`startDate-${item.id}`}
                          value={schemeSettings[item.id]?.startDate || ''}
                          onChange={(e) =>
                            handleInputChange(item.id, 'startDate', e.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="modal-label date-input">
                        Eind datum:
                        <input
                          type="date"
                          name={`endDate-${item.id}`}
                          value={schemeSettings[item.id]?.endDate || ''}
                          onChange={(e) =>
                            handleInputChange(item.id, 'endDate', e.target.value)
                          }
                          required
                        />
                      </label>
                      {isSaveAttempted &&
                        errors[item.id] &&
                        Object.values(errors[item.id]).map((errorMsg, index) => (
                          <span key={index} className="error-message">
                            {errorMsg}
                          </span>
                        ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shifts Toggle */}
            {schemeSettings[item.id]?.enabled && item.type === 'day' && (
              <div className="day-header">
                <span className="day-label">Shifts aanzetten</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={schemeSettings[item.id]?.shiftsEnabled || false}
                    onChange={() => handleShiftsToggle(item.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}

            {/* Shifts Inputs */}
            <AnimatePresence>
              {schemeSettings[item.id]?.enabled &&
                schemeSettings[item.id]?.shiftsEnabled &&
                item.type === 'day' && (
                  <motion.div
                    className="shifts-container"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    {schemeSettings[item.id]?.shifts?.map((shift, shiftIndex) => (
                      <div key={shiftIndex} className="shift-item shift-item-box">
                        {/* Shift Inputs Grid */}
                        <div className="shift-inputs-grid">
                          <label className="modal-label shift-input">
                            Start tijd:
                            <input
                              type="time"
                              name={`shiftStartTime-${item.id}-${shiftIndex}`}
                              value={shift.startTime}
                              onChange={(e) =>
                                handleShiftInputChange(
                                  item.id,
                                  shiftIndex,
                                  'startTime',
                                  e.target.value
                                )
                              }
                              required
                            />
                          </label>
                          <label className="modal-label shift-input">
                            Shift naam:
                            <input
                              type="text"
                              name={`shiftName-${item.id}-${shiftIndex}`}
                              value={shift.name}
                              onChange={(e) =>
                                handleShiftInputChange(
                                  item.id,
                                  shiftIndex,
                                  'name',
                                  e.target.value
                                )
                              }
                              required
                            />
                          </label>
                        </div>
                        {/* Remove Shift Button */}
                        <button
                          type="button"
                          className="remove-shift-button"
                          onClick={() => removeShift(item.id, shiftIndex)}
                        >
                          Verwijder Shift
                        </button>
                      </div>
                    ))}

                    {/* Add Shift Button */}
                    <button
                      type="button"
                      className="add-shift-button"
                      onClick={() => addShift(item.id)}
                    >
                      + Voeg Shift Toe
                    </button>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="modal-buttons">
        <button
          type="button"
          className="standard-button blue"
          onClick={handleSaveScheme}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default Scheme;
