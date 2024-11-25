// src/components/SchemeStandalone.jsx

import React, { useState, useEffect, useRef } from 'react';
import useSchemeValidation from './Modal/Hooks/useSchemeValidation';
import SchemeItem from './Modal/Scheme/SchemeItem';
import useTimeBlocks from './Hooks/fetchTimeblocks';
import useNotification from '../../Components/Notification/index';
import { withHeader } from '../../Components/Structural/Header';
import { ArcadeEmbed } from '../../Components/ArcadeEmbed';
import './css/schemeStandalone.css';

const SchemeStandalone = () => {
  const arcadeRef = useRef(null);
  const { triggerNotification, NotificationComponent } = useNotification();
  const { blocks, updateTimeBlock } = useTimeBlocks(triggerNotification);
  const [schemeSettings, setschemeSettings] = useState(null);
  const [timeBlockId, setTimeBlockId] = useState(null);
  const [defaultStartTime, setDefaultStartTime] = useState('17:00');
  const [defaultEndTime, setDefaultEndTime] = useState('23:00');

  useEffect(() => {
    if (blocks && blocks.length > 0) {
      const firstBlockWithScheme = blocks.find((block) => block.schemeSettings);
      if (firstBlockWithScheme) {
        setschemeSettings(firstBlockWithScheme.schemeSettings);
        setTimeBlockId(firstBlockWithScheme._id);
        setDefaultStartTime(firstBlockWithScheme.startTime || '17:00');
        setDefaultEndTime(firstBlockWithScheme.endTime || '23:00');
      }
    }
  }, [blocks]);

  useEffect(() => {
    if (blocks && blocks.length === 0 && !localStorage.getItem('firstTimeOpen')) {
      localStorage.setItem('firstTimeOpen', 'true');
      if (arcadeRef.current) {
        arcadeRef.current.openArcade();
      }
    }
  }, [blocks]);

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

  const handleSaveScheme = async () => {
    setIsSaveAttempted(true);
    if (validate()) {
      if (timeBlockId) {
        const blockToUpdate = blocks.find((block) => block._id === timeBlockId);
        if (blockToUpdate) {
          const updatedBlock = {
            ...blockToUpdate,
            schemeSettings,
          };
          try {
            await updateTimeBlock(updatedBlock);
            triggerNotification('Schema opgeslagen', 'success');
          } catch (err) {
            triggerNotification('Fout bij het opslaan van het schema', 'error');
          }
        }
      } else {
        triggerNotification('Geen tijdsblok gevonden om het schema op te slaan', 'warning');
      }
    } else {
      triggerNotification('Controleer de invulvelden', 'warning');
    }
  };

  return (
    <div className='scheme-page'>
      {schemeSettings ? (
        <div className='day-calendar-page'>
          <div className='scheme-container'>
            <NotificationComponent />
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
        </div>
      ) : (
        <div className="no-timeblock-message">
          <a href="/#/scheme/calendar?action=create-timeblock">
            Maak eerst een tijdsblok. Klik Hier
          </a>
          <button
            type="button"
            className="standard-button blue-dark"
            onClick={() => arcadeRef.current && arcadeRef.current.openArcade()}
            style={{ marginTop: '10px', border: 'solid 1px black' }} // Optional: Adds spacing between link and button
          >
            ✨ Open de Interactieve Uitleg ✨
          </button>
        </div>
      )}
      <ArcadeEmbed ref={arcadeRef} />
    </div>
  );
};

export default withHeader(SchemeStandalone);
