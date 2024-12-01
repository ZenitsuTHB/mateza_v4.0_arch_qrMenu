// src/pages/SchedulePage/index.js

import React, { useState } from 'react';
import './css/schedulePage.css';
import NavigationBar from './NavigationBar';
import DayContent from './DayContent';
import { withHeader } from '../../Components/Structural/Header';
import useWindowWidth from './Hooks/useWindowWidth'; // Import the custom hook

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const windowWidth = useWindowWidth(); // Use the custom hook

  const isMobile = windowWidth < 900; // Determine if the screen is mobile-sized

  const days = [
    { id: 'Monday', title: 'Maandag', label: isMobile ? 'Ma' : 'Maandag', icon: 'FaSun' },
    { id: 'Tuesday', title: 'Dinsdag', label: isMobile ? 'Di' : 'Dinsdag', icon: 'FaCloud' },
    { id: 'Wednesday', title: 'Woensdag', label: isMobile ? 'Wo' : 'Woensdag', icon: 'FaUmbrella' },
    { id: 'Thursday', title: 'Donderdag', label: isMobile ? 'Do' : 'Donderdag', icon: 'FaBolt' },
    { id: 'Friday', title: 'Vrijdag', label: isMobile ? 'Vr' : 'Vrijdag', icon: 'FaRainbow' },
    { id: 'Saturday', title: 'Zaterdag', label: isMobile ? 'Za' : 'Zaterdag', icon: 'FaSnowflake' },
    { id: 'Sunday', title: 'Zondag', label: isMobile ? 'Zo' : 'Zondag', icon: 'FaMoon' },
  ];

  const handleDayClick = (dayId) => {
    setSelectedDay(dayId);
  };

  return (
    <div className="schedule-page-component">
      <div className="schedule-page">
        <NavigationBar days={days} selectedDay={selectedDay} onDayClick={handleDayClick} />
        {selectedDay && <DayContent dayId={selectedDay} days={days} />}
      </div>
    </div>
  );
};

export default withHeader(SchedulePage);
