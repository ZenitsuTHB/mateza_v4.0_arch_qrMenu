// DayContent.js

import React, { useState, useEffect } from 'react';
import './css/dayContent.css';
import MaxCapacityAccordion from './MaxCapacityAccordion';
import ShiftsAccordion from './ShiftsAccordion';
import useApi from '../../Hooks/useApi'; // Adjust the path based on your project structure

const DayContent = ({ dayId, days }) => {
  const api = useApi();
  const day = days.find((d) => d.id === dayId);

  const [dayData, setDayData] = useState({
    startTime: '',
    endTime: '',
    maxCapacityEnabled: false,
    maxCapacity: '',
    shiftsEnabled: false,
    shifts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from api/openingsuren
    const fetchData = async () => {
      try {
        const response = await api.get('api/openingsuren');
        // Assume the response has a structure similar to:
        // { schemeSettings: { Monday: { ... }, ... } }

        const dataForDay = response.schemeSettings[day.label] || {};
        setDayData({
          startTime: dataForDay.startTime || '',
          endTime: dataForDay.endTime || '',
          maxCapacityEnabled: dataForDay.maxCapacityEnabled || false,
          maxCapacity: dataForDay.maxCapacity || '',
          shiftsEnabled: dataForDay.shiftsEnabled || false,
          shifts: dataForDay.shifts || [],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, perhaps set default values or show an error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, day.label]);

  const handleSave = async () => {
    // Prepare data to send
    const updatedData = {
      schemeSettings: {
        [day.label]: {
          enabled: true, // Assuming the day is enabled
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
      await api.put(window.baseDomain + 'api/openingsuren-ontbijt', updatedData);
      alert('Data succesvol opgeslagen');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Fout bij het opslaan van data');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="schedule-page">
      {/* Title outside the container with the same class as AccountManage */}
      <h1 className="schedule-page-title">{day.label}</h1>

      {/* White container for input fields */}
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

        {/* MaxCapacityAccordion with props */}
        <MaxCapacityAccordion
          enabled={dayData.maxCapacityEnabled}
          setEnabled={(enabled) => setDayData({ ...dayData, maxCapacityEnabled: enabled })}
          maxCapacity={dayData.maxCapacity}
          setMaxCapacity={(maxCapacity) => setDayData({ ...dayData, maxCapacity })}
        />

        {/* ShiftsAccordion with props */}
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
