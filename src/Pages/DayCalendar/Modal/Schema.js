import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/schema.css';

const Schema = ({
  schemaSettings,
  setSchemaSettings,
  onSaveSchema,
  onDeleteSchema,
  defaultStartTime,
  defaultEndTime,
  triggerNotification, // Added prop
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

  const [errors, setErrors] = useState({});
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);

  const handleToggle = (itemId) => {
    setSchemaSettings((prev) => {
      const isEnabled = prev[itemId]?.enabled;
      if (!isEnabled) {
        return {
          ...prev,
          [itemId]: {
            enabled: true,
            startTime: prev[itemId]?.startTime || (items.find(item => item.id === itemId).type === 'day' ? defaultStartTime : ''),
            endTime: prev[itemId]?.endTime || (items.find(item => item.id === itemId).type === 'day' ? defaultEndTime : ''),
            startDate: prev[itemId]?.startDate || '',
            endDate: prev[itemId]?.endDate || '',
          },
        };
      } else {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleInputChange = (itemId, field, value) => {
    setSchemaSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const validate = () => {
    const newErrors = {};

    items.forEach((item) => {
      if (schemaSettings[item.id]?.enabled) {
        if (item.type === 'day') {
          const { startTime, endTime } = schemaSettings[item.id];
          if (!startTime || !endTime) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              timeEmpty: 'Start tijd en eindtijd moeten ingevuld zijn.',
            };
          } else if (startTime >= endTime) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              timeOrder: 'Start tijd moet voor eindtijd zijn.',
            };
          }
        } else if (item.type === 'duration') {
          const { startDate, endDate } = schemaSettings[item.id];
          if (!startDate || !endDate) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              dateEmpty: 'Start datum en einddatum moeten ingevuld zijn.',
            };
          } else if (startDate > endDate) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              dateOrder: 'Start datum moet voor einddatum zijn.',
            };
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSchema = () => {
    setIsSaveAttempted(true);
    if (validate()) {
      onSaveSchema();
    } else {
      triggerNotification('Controleer de invulvelden', 'warning');
    }
  };

  return (
    <div>
      <h2 className="secondary-title">Openingsuren</h2>
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
                      {isSaveAttempted && errors[item.id] && Object.values(errors[item.id]).map((errorMsg, index) => (
                        <span key={index} className="error-message">{errorMsg}</span>
                      ))}
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
                      {isSaveAttempted && errors[item.id] && Object.values(errors[item.id]).map((errorMsg, index) => (
                        <span key={index} className="error-message">{errorMsg}</span>
                      ))}
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
