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
    // Update the position in state during dragging
    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: data.y },
    }));
  };

  const handleDragStop = (e, data, block, setBlockPositions) => {
    // Calculate new start time based on final position
    let finalY = data.y;

    // Convert y position to minutes
    let newStartMinutes = (finalY / hourHeight) * 60;

    // Snap to the nearest interval
    newStartMinutes = roundToNearestInterval(newStartMinutes, snappingIntervalMinutes);

    // Ensure times are within valid bounds
    const blockDurationMinutes = parseTime(block.endTime) - parseTime(block.startTime);
    newStartMinutes = Math.max(0, Math.min(newStartMinutes, 1440 - blockDurationMinutes));
    const newEndMinutes = newStartMinutes + blockDurationMinutes;

    const newStartTime = formatMinutesToTime(newStartMinutes);
    const newEndTime = formatMinutesToTime(newEndMinutes);

    const updatedBlock = { ...block, startTime: newStartTime, endTime: newEndTime };

    // Update the block in parent component
    onTimeBlockMove(updatedBlock);

    // Update the position in state to the snapped position
    const snappedY = (newStartMinutes / 60) * hourHeight;
    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: snappedY },
    }));

    // Allow drag to finish before re-enabling click events
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
