// src/components/Timeline/Hooks/useDragHandlers.js

import { useState, useRef } from 'react';
import { parseTime, formatMinutesToTime, roundToNearestInterval } from '../Utils/timeUtils';

const useDragHandlers = (hourHeight, snappingIntervalMinutes, onTimeBlockMove) => {
  const [dragging, setDragging] = useState(false);
  const dragTimeoutRef = useRef(null);

  const handleDragStart = () => {
    setDragging(true);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  };

  const handleDrag = (e, data, block, setBlockPositions) => {
    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: data.y },
    }));
  };

  const handleDragStop = (e, data, block, setBlockPositions) => {
    let finalY = data.y;
    let newStartMinutes = (finalY / hourHeight) * 60;
    newStartMinutes = roundToNearestInterval(newStartMinutes, snappingIntervalMinutes);
    const blockDurationMinutes = parseTime(block.endTime) - parseTime(block.startTime);
    newStartMinutes = Math.max(0, Math.min(newStartMinutes, 1440 - blockDurationMinutes));
    const newEndMinutes = newStartMinutes + blockDurationMinutes;

    const newStartTime = formatMinutesToTime(newStartMinutes);
    const newEndTime = formatMinutesToTime(newEndMinutes);

    const updatedBlock = { ...block, startTime: newStartTime, endTime: newEndTime };

    onTimeBlockMove(updatedBlock);
    const snappedY = (newStartMinutes / 60) * hourHeight;
    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: snappedY },
    }));
    dragTimeoutRef.current = setTimeout(() => setDragging(false), 200);
  };

  return {
    dragging,
    handleDragStart,
    handleDrag,
    handleDragStop,
  };
};

export default useDragHandlers;
