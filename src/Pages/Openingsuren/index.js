// src/pages/SchedulePage/index.js

import React, { useState } from 'react';
import './css/schedulePage.css';
import NavigationBar from './NavigationBar';
import DayContent from './DayContent';
import { withHeader } from '../../Components/Structural/Header';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = [
    { id: 'Monday', label: 'Maandag', icon: 'FaSun' },
    { id: 'Tuesday', label: 'Dinsdag', icon: 'FaCloud' },
    { id: 'Wednesday', label: 'Woensdag', icon: 'FaUmbrella' },
    { id: 'Thursday', label: 'Donderdag', icon: 'FaBolt' },
    { id: 'Friday', label: 'Vrijdag', icon: 'FaRainbow' },
    { id: 'Saturday', label: 'Zaterdag', icon: 'FaSnowflake' },
    { id: 'Sunday', label: 'Zondag', icon: 'FaMoon' },
  ];

  const handleDayClick = (dayId) => {
    setSelectedDay(dayId);
  };

  return (
    <div className="schedule-page">
      <NavigationBar days={days} selectedDay={selectedDay} onDayClick={handleDayClick} />
      {selectedDay && <DayContent dayId={selectedDay} days={days} />}
    </div>
  );
};

export default withHeader(SchedulePage);
