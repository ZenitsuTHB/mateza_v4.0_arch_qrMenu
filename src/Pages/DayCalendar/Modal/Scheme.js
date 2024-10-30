// Scheme.jsx

import React, { useState } from 'react';
import './css/scheme.css';
import useSchemeValidation from './Hooks/useSchemeValidation'; // Import the custom hook
import SchemeItem from './SchemeItem';

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
          <SchemeItem
            key={item.id}
            item={item}
            schemeSettings={schemeSettings}
            handleToggle={handleToggle}
            handleInputChange={handleInputChange}
            errors={errors}
            isSaveAttempted={isSaveAttempted}
            handleShiftsToggle={handleShiftsToggle}
            handleShiftInputChange={handleShiftInputChange}
            addShift={addShift}
            removeShift={removeShift}
          />
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
