// src/hooks/useBlockPositions.js

import { useState, useEffect } from 'react';

const useBlockPositions = (timeBlocks, hourHeight) => {
  const [blockPositions, setBlockPositions] = useState({});

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const newPositions = {};
    timeBlocks.forEach((block) => {
      const startMinutes = parseTime(block.startTime);
      const yPosition = (startMinutes / 60) * hourHeight;
      newPositions[block._id] = { x: 0, y: yPosition };
    });
    setBlockPositions(newPositions);
  }, [timeBlocks, hourHeight]);

  return [blockPositions, setBlockPositions];
};

export default useBlockPositions;
