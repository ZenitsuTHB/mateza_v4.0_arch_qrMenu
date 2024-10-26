// src/components/Modal/Schema.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/schema.css';

const Schema = () => {
  const daysOfWeek = [
    { id: 'maandag', label: 'Maandag' },
    { id: 'dinsdag', label: 'Dinsdag' },
    { id: 'woensdag', label: 'Woensdag' },
    { id: 'donderdag', label: 'Donderdag' },
    { id: 'vrijdag', label: 'Vrijdag' },
    { id: 'zaterdag', label: 'Zaterdag' },
    { id: 'zondag', label: 'Zondag' },
  ];

  // Initialize state for each day
  const [daysSettings, setDaysSettings] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day.id] = {
        enabled: false,
        startTime: '08:00',
        endTime: '17:00',
      };
      return acc;
    }, {})
  );

  // Handle toggle switch
  const handleToggle = (dayId) => {
    setDaysSettings((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId].enabled,
      },
    }));
  };

  // Handle time changes
  const handleTimeChange = (dayId, field, value) => {
    setDaysSettings((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <h2 className="secondary-title">Schema</h2>
      <div className="schema-list">
        {daysOfWeek.map((day) => (
          <div key={day.id} className="schema-item">
            <div className="day-header">
              <span className="day-label">{day.label}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={daysSettings[day.id].enabled}
                  onChange={() => handleToggle(day.id)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <AnimatePresence>
              {daysSettings[day.id].enabled && (
                <motion.div
                  className="time-inputs-container"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="modal-label time-input">
                    Start tijd:
                    <input
                      type="time"
                      value={daysSettings[day.id].startTime}
                      onChange={(e) =>
                        handleTimeChange(day.id, 'startTime', e.target.value)
                      }
                      required
                    />
                  </label>
                  <label className="modal-label time-input">
                    Eindtijd:
                    <input
                      type="time"
                      value={daysSettings[day.id].endTime}
                      onChange={(e) =>
                        handleTimeChange(day.id, 'endTime', e.target.value)
                      }
                      required
                    />
                  </label>
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
