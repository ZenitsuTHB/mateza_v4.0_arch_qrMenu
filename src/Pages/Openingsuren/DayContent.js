// src/Pages/Uitzonderingen/DayContent.js

import React, { useState, useEffect, useRef } from 'react';
import './css/dayContent.css';
import MaxCapacityAccordion from './MaxCapacityAccordion';
import ShiftsAccordion from './ShiftsAccordion';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import { shifts } from './constants';

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
  const [errors, setErrors] = useState({});

  const endTimeRef = useRef(null);

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
    setErrors({});
  }, [scheduleData, dayId]);

  // Generate time options based on mealType
  const generateTimeOptions = (type) => {
    if (!type || !shifts[type]) return [];

    const start = shifts[type].start;
    const end = shifts[type].end;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const options = [];
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      options.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + 15);
    }

    return options;
  };

  // Get start time options
  const startTimeOptions = generateTimeOptions(mealType);

  // Get end time options based on selected start time
  const getEndTimeOptions = () => {
    if (!dayData.startTime) return generateTimeOptions(mealType);

    const [startHour, startMinute] = dayData.startTime.split(':').map(Number);
    const [mealStartHour, mealStartMinute] = shifts[mealType].start
      .split(':')
      .map(Number);
    const [mealEndHour, mealEndMinute] = shifts[mealType].end.split(':').map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(mealEndHour, mealEndMinute, 0, 0);

    const options = [];
    let current = new Date(start);
    current.setMinutes(current.getMinutes() + 15);

    while (current <= end) {
      const now = new Date();
      // If the start date is today, prevent selecting past times
      if (
        new Date().toDateString() ===
        new Date().toDateString() // Assuming schedule is for today; adjust as needed
      ) {
        if (current >= now) {
          const hours = current.getHours().toString().padStart(2, '0');
          const minutes = current.getMinutes().toString().padStart(2, '0');
          options.push(`${hours}:${minutes}`);
        }
      } else {
        const hours = current.getHours().toString().padStart(2, '0');
        const minutes = current.getMinutes().toString().padStart(2, '0');
        options.push(`${hours}:${minutes}`);
      }
      current.setMinutes(current.getMinutes() + 15);
    }

    return options;
  };

  const endTimeOptions = getEndTimeOptions();

  // Handle Save with Validations
  const handleSave = async () => {
    const validationErrors = {};

    // Check if end time is after start time
    if (dayData.startTime && dayData.endTime) {
      const start = dayData.startTime.split(':').map(Number);
      const end = dayData.endTime.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(start[0], start[1], 0, 0);

      const endDate = new Date();
      endDate.setHours(end[0], end[1], 0, 0);

      if (endDate <= startDate) {
        validationErrors.endTime = 'Eindtijd moet na de starttijd zijn.';
      }
    }

    // Prevent selecting times in the past
    const now = new Date();
    if (dayData.startTime) {
      const [startHour, startMinute] = dayData.startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0, 0);

      if (startDate < now) {
        validationErrors.startTime = 'Starttijd mag niet in het verleden liggen.';
      }
    }

    if (dayData.endTime) {
      const [endHour, endMinute] = dayData.endTime.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(endHour, endMinute, 0, 0);

      if (endDate < now) {
        validationErrors.endTime = 'Eindtijd mag niet in het verleden liggen.';
      }
    }

    // Additional validations can be added here as needed

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Trigger notification for validation errors
      triggerNotification(
        Object.values(validationErrors).join(' '),
        'error'
      );
      return;
    }

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
        await api.put(`${window.baseDomain}api/openinghours-${mealType}`, updatedData);
      } else {
        await api.post(`${window.baseDomain}api/openinghours-${mealType}`, updatedData);
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
            <select
              id="startTime"
              name="startTime"
              value={dayData.startTime}
              onChange={(e) => {
                setDayData({ ...dayData, startTime: e.target.value, endTime: '' });
                setErrors({ ...errors, startTime: '', endTime: '' });
              }}
              className="exceptions-page__select"
            >
              <option value="">Selecteer Start Tijd</option>
              {startTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.startTime && <p className="exceptions-page__error">{errors.startTime}</p>}
          </div>
          <div className="input-container">
            <label htmlFor="endTime">Eind Tijd</label>
            <select
              id="endTime"
              name="endTime"
              value={dayData.endTime}
              onChange={(e) => setDayData({ ...dayData, endTime: e.target.value })}
              className="exceptions-page__select"
              disabled={!dayData.startTime}
              ref={endTimeRef}
            >
              <option value="">Selecteer Eind Tijd</option>
              {endTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.endTime && <p className="exceptions-page__error">{errors.endTime}</p>}
          </div>
        </div>

        <MaxCapacityAccordion
          enabled={dayData.maxCapacityEnabled}
          setEnabled={(enabled) =>
            setDayData({ ...dayData, maxCapacityEnabled: enabled, maxCapacity: '' })
          }
          maxCapacity={dayData.maxCapacity}
          setMaxCapacity={(maxCapacity) => setDayData({ ...dayData, maxCapacity })}
        />

        <ShiftsAccordion
          enabled={dayData.shiftsEnabled}
          setEnabled={(enabled) => setDayData({ ...dayData, shiftsEnabled: enabled })}
          shifts={dayData.shifts}
          setShifts={(shifts) => setDayData({ ...dayData, shifts })}
          mealType={mealType} // Pass mealType to generate shifts accordingly
        />

        <button className="button-style-3" onClick={handleSave}>
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default DayContent;
