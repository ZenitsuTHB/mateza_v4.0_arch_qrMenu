// DayContent.js

import React, { useState, useEffect } from 'react';
import './css/dayContent.css';
import MaxCapacityAccordion from './MaxCapacityAccordion';
import ShiftsAccordion from './ShiftsAccordion';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';

const DayContent = ({ dayId, days, mealType, scheduleData, refreshData }) => {
  const api = useApi();
  const day = days.find((d) => d.id === dayId);

  const { triggerNotification, NotificationComponent } = useNotification();

  const [dayData, setDayData] = useState({
    startTime: '',
    endTime: '',
    maxCapacityEnabled: false,
    maxCapacity: '',
    shiftsEnabled: false,
    shifts: [],
  });

  const [dataExists, setDataExists] = useState(false);

  useEffect(() => {
    if (scheduleData && scheduleData[dayId]) {
      const dataForDay = scheduleData[dayId];
      setDayData({
        startTime: dataForDay.startTime || '',
        endTime: dataForDay.endTime || '',
        maxCapacityEnabled: dataForDay.maxCapacityEnabled || false,
        maxCapacity: dataForDay.maxCapacity || '',
        shiftsEnabled: dataForDay.shiftsEnabled || false,
        shifts: dataForDay.shifts || [],
      });
      setDataExists(true);
    } else {
      setDayData({
        startTime: '',
        endTime: '',
        maxCapacityEnabled: false,
        maxCapacity: '',
        shiftsEnabled: false,
        shifts: [],
      });
      setDataExists(false);
    }
  }, [scheduleData, dayId]);

  const handleSave = async () => {
    const updatedData = {
      schemeSettings: {
        [day.id]: {
          enabled: true,
          startTime: dayData.startTime,
          endTime: dayData.endTime,
          maxCapacityEnabled: dayData.maxCapacityEnabled,
          maxCapacity: dayData.maxCapacity,
          shiftsEnabled: dayData.shiftsEnabled,
          shifts: dayData.shifts,
        },
      },
    };

    try {
      if (dataExists) {
        await api.put(window.baseDomain + 'api/openingsuren' + '-' + mealType, updatedData);
      } else {
        await api.post(window.baseDomain + 'api/openingsuren' + '-' + mealType, updatedData);
      }
      triggerNotification('Data succesvol opgeslagen', 'success');
      refreshData(); // Refresh data in parent component
    } catch (error) {
      console.error('Error saving data:', error);
      triggerNotification('Fout bij het opslaan van data', 'error');
    }
  };

  return (
    <div className="schedule-page">
      <h1 className="schedule-page-title">{day.title}</h1>

      <NotificationComponent />

      <div className="day-content scheme-container">
        <div className="time-inputs-container">
          <div className="input-container">
            <label htmlFor="startTime">Start Tijd</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={dayData.startTime}
              onChange={(e) => setDayData({ ...dayData, startTime: e.target.value })}
            />
          </div>
          <div className="input-container">
            <label htmlFor="endTime">Eind Tijd</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={dayData.endTime}
              onChange={(e) => setDayData({ ...dayData, endTime: e.target.value })}
            />
          </div>
        </div>

        <MaxCapacityAccordion
          enabled={dayData.maxCapacityEnabled}
          setEnabled={(enabled) => setDayData({ ...dayData, maxCapacityEnabled: enabled })}
          maxCapacity={dayData.maxCapacity}
          setMaxCapacity={(maxCapacity) => setDayData({ ...dayData, maxCapacity })}
        />

        <ShiftsAccordion
          enabled={dayData.shiftsEnabled}
          setEnabled={(enabled) => setDayData({ ...dayData, shiftsEnabled: enabled })}
          shifts={dayData.shifts}
          setShifts={(shifts) => setDayData({ ...dayData, shifts })}
        />

        <button className="button-style-3" onClick={handleSave}>
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default DayContent;
