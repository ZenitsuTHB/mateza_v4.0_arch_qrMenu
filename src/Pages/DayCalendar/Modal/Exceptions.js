// src/components/Modal/ExceptionalDays.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/exceptions.css';

const ExceptionalDays = ({
  exceptionalDays,
  setExceptionalDays,
  onSaveExceptionalDays,
}) => {
  const handleToggle = (type, index) => {
    setExceptionalDays((prev) => {
      const updatedList = prev[type].map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      );
      return { ...prev, [type]: updatedList };
    });
  };

  const handleInputChange = (type, index, field, value) => {
    setExceptionalDays((prev) => {
      const updatedList = prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [type]: updatedList };
    });
  };

  const addNewException = (type) => {
    setExceptionalDays((prev) => {
      const newException = { enabled: false };
      if (type === 'sluitingsperiode') {
        newException.startDate = '';
        newException.endDate = '';
      } else if (type === 'sluitingsdag') {
        newException.date = '';
      } else if (type === 'uitzonderlijkeOpeningsuren') {
        newException.date = '';
        newException.startTime = '';
        newException.endTime = '';
      }
      return {
        ...prev,
        [type]: [...prev[type], newException],
      };
    });
  };

  return (
    <div>
      <h2 className="secondary-title">Uitzonderingen</h2>

      {/* Sluitingsperiode Section */}
      <div className="exception-type-section">
        <h3>Sluitingsperiode</h3>
        {exceptionalDays.sluitingsperiode.map((item, index) => (
          <div key={index} className="exceptional-day-item">
            <div className="day-header">
              <span className="day-label">Periode {index + 1}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle('sluitingsperiode', index)}
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
                        handleInputChange(
                          'sluitingsperiode',
                          index,
                          'startDate',
                          e.target.value
                        )
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
                        handleInputChange(
                          'sluitingsperiode',
                          index,
                          'endDate',
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <button
          type="button"
          className="add-exception-button"
          onClick={() => addNewException('sluitingsperiode')}
        >
          + Voeg Sluitingsperiode Toe
        </button>
      </div>

      {/* Sluitingsdag Section */}
      <div className="exception-type-section">
        <h3>Sluitingsdag</h3>
        {exceptionalDays.sluitingsdag.map((item, index) => (
          <div key={index} className="exceptional-day-item">
            <div className="day-header">
              <span className="day-label">Dag {index + 1}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle('sluitingsdag', index)}
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
                    Datum:
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        handleInputChange(
                          'sluitingsdag',
                          index,
                          'date',
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <button
          type="button"
          className="add-exception-button"
          onClick={() => addNewException('sluitingsdag')}
        >
          + Voeg Sluitingsdag Toe
        </button>
      </div>

      {/* Uitzonderlijke Openingsuren Section */}
      <div className="exception-type-section">
        <h3>Uitzonderlijke Openingsuren</h3>
        {exceptionalDays.uitzonderlijkeOpeningsuren.map((item, index) => (
          <div key={index} className="exceptional-day-item">
            <div className="day-header">
              <span className="day-label">Uur {index + 1}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() =>
                    handleToggle('uitzonderlijkeOpeningsuren', index)
                  }
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
                    Datum:
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        handleInputChange(
                          'uitzonderlijkeOpeningsuren',
                          index,
                          'date',
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>
                  <label className="modal-label time-input">
                    Start tijd:
                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) =>
                        handleInputChange(
                          'uitzonderlijkeOpeningsuren',
                          index,
                          'startTime',
                          e.target.value
                        )
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
                        handleInputChange(
                          'uitzonderlijkeOpeningsuren',
                          index,
                          'endTime',
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <button
          type="button"
          className="add-exception-button"
          onClick={() => addNewException('uitzonderlijkeOpeningsuren')}
        >
          + Voeg Uitzonderlijke Openingsuren Toe
        </button>
      </div>

      <div className="modal-buttons">
        <button
          type="button"
          className="standard-button blue"
          onClick={onSaveExceptionalDays}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default ExceptionalDays;
