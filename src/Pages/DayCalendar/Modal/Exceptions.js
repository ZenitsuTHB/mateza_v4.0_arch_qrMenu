// src/components/Modal/ExceptionalDays.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/exceptions.css';

const ExceptionalDays = ({ exceptionalDays, setExceptionalDays, onSaveExceptionalDays }) => {
  const handleToggle = (index) => {
    setExceptionalDays((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleInputChange = (index, field, value) => {
    setExceptionalDays((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addNewException = () => {
    setExceptionalDays((prev) => [
      ...prev,
      {
        enabled: false,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        type: 'closing', // or 'modifiedTime'
      },
    ]);
  };

  const handleSave = () => {
    onSaveExceptionalDays();
  };

  return (
    <div>
      <h2 className="secondary-title">Uitzonderingen</h2>
      <div className="exceptional-days-list">
        {exceptionalDays.map((item, index) => (
          <div key={index} className="exceptional-day-item">
            <div className="day-header">
              <span className="day-label">
                {item.type === 'closing' ? 'Sluiting' : 'Gewijzigde Tijd'}
              </span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle(index)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <AnimatePresence>
              {item.enabled && (
                <motion.div
                  className="inputs-container"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <label className="modal-label date-input">
                    Start datum:
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) =>
                        handleInputChange(index, 'startDate', e.target.value)
                      }
                      required
                    />
                  </label>
                  <label className="modal-label date-input">
                    Eind datum:
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(e) =>
                        handleInputChange(index, 'endDate', e.target.value)
                      }
                      required
                    />
                  </label>
                  {item.type === 'modifiedTime' && (
                    <>
                      <label className="modal-label time-input">
                        Start tijd:
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) =>
                            handleInputChange(index, 'startTime', e.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="modal-label time-input">
                        Eindtijd:
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) =>
                            handleInputChange(index, 'endTime', e.target.value)
                          }
                          required
                        />
                      </label>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <button type="button" className="add-exception-button" onClick={addNewException}>
          + Voeg Uitzondering Toe
        </button>
      </div>
      <div className="modal-buttons">
        <button
          type="button"
          className="standard-button blue"
          onClick={handleSave}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default ExceptionalDays;
