// src/components/Modal/Schema.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/schema.css';

const Schema = ({
  schemaSettings,
  setSchemaSettings,
  onSaveSchema,    // New prop for saving schema settings
  onDeleteSchema,  // New prop for deleting/resetting schema settings
}) => {
  const items = [
    { id: 'maandag', label: 'Maandag', type: 'day' },
    { id: 'dinsdag', label: 'Dinsdag', type: 'day' },
    { id: 'woensdag', label: 'Woensdag', type: 'day' },
    { id: 'donderdag', label: 'Donderdag', type: 'day' },
    { id: 'vrijdag', label: 'Vrijdag', type: 'day' },
    { id: 'zaterdag', label: 'Zaterdag', type: 'day' },
    { id: 'zondag', label: 'Zondag', type: 'day' },
    { id: 'period', label: 'Beperkte Periode', type: 'duration' },
    { id: 'closing', label: 'Sluitingsperiode', type: 'duration' },
  ];

  // Handle toggle switch
  const handleToggle = (itemId) => {
    setSchemaSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        enabled: !prev[itemId]?.enabled,
      },
    }));
  };

  // Handle input changes
  const handleInputChange = (itemId, field, value) => {
    setSchemaSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  // Handle Save Schema Settings
  const handleSaveSchema = () => {
    // You can add additional validation or processing here if needed
    onSaveSchema();
  };


  return (
    <div>
      <h2 className="secondary-title">Schema</h2>
      <div className="schema-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`schema-item ${
              item.type !== 'day' ? 'schema-item-special' : ''
            }`}
          >
            <div className="day-header">
              <span className="day-label">{item.label}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={schemaSettings[item.id]?.enabled || false}
                  onChange={() => handleToggle(item.id)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <AnimatePresence>
              {schemaSettings[item.id]?.enabled && (
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
                          value={schemaSettings[item.id]?.startTime || ''}
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
                          value={schemaSettings[item.id]?.endTime || ''}
                          onChange={(e) =>
                            handleInputChange(item.id, 'endTime', e.target.value)
                          }
                          required
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="modal-label date-input">
                        Start datum:
                        <input
                          type="date"
                          name={`startDate-${item.id}`}
                          value={schemaSettings[item.id]?.startDate || ''}
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
                          value={schemaSettings[item.id]?.endDate || ''}
                          onChange={(e) =>
                            handleInputChange(item.id, 'endDate', e.target.value)
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
      </div>
      <div className="modal-buttons">
        <button
          type="button"
          className="standard-button blue"
          onClick={handleSaveSchema}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default Schema;
