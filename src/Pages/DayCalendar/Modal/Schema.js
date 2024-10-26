// src/components/Modal/Schema.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/schema.css';

const Schema = () => {
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

  // Initialize state for each item
  const [itemsSettings, setItemsSettings] = useState(
    items.reduce((acc, item) => {
      acc[item.id] = {
        enabled: false,
        ...(item.type === 'day'
          ? { startTime: '08:00', endTime: '17:00' }
          : { startDate: '', endDate: '' }),
      };
      return acc;
    }, {})
  );

  // Handle toggle switch
  const handleToggle = (itemId) => {
    setItemsSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        enabled: !prev[itemId].enabled,
      },
    }));
  };

  // Handle input changes
  const handleInputChange = (itemId, field, value) => {
    setItemsSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
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
                  checked={itemsSettings[item.id].enabled}
                  onChange={() => handleToggle(item.id)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <AnimatePresence>
              {itemsSettings[item.id].enabled && (
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
                          value={itemsSettings[item.id].startTime}
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
                          value={itemsSettings[item.id].endTime}
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
                          value={itemsSettings[item.id].startDate}
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
                          value={itemsSettings[item.id].endDate}
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
    </div>
  );
};

export default Schema;
