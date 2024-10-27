// src/components/Timeline/Hooks/useDragHandlers.js

import { useState, useRef } from 'react';
import { parseTime, formatMinutesToTime, roundToNearestInterval } from '../Utils/timeUtils';

const useDragHandlers = (
  hourHeight,
  snappingIntervalMinutes,
  onTimeBlockMove,
  getPixelOffset // Function to get the current pixelOffset
) => {
  const [dragging, setDragging] = useState(false);
  const dragTimeoutRef = useRef(null);

  const handleDragStart = () => {
    setDragging(true);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  };

  const handleDrag = (e, data, block, setBlockPositions) => {
    const pixelOffset = getPixelOffset();
    const absoluteY = data.y + pixelOffset;

    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: absoluteY },
    }));
  };

  const handleDragStop = (e, data, block, setBlockPositions) => {
    const pixelOffset = getPixelOffset();
    const finalY = data.y + pixelOffset;

    // Calculate new start time in minutes
    let newStartMinutes = (finalY / hourHeight) * 60;
    newStartMinutes = roundToNearestInterval(newStartMinutes, snappingIntervalMinutes);

    // Ensure newStartMinutes is within bounds
    const blockDurationMinutes = parseTime(block.endTime) - parseTime(block.startTime);
    newStartMinutes = Math.max(0, Math.min(newStartMinutes, 1440 - blockDurationMinutes));
    const newEndMinutes = newStartMinutes + blockDurationMinutes;

    const newStartTime = formatMinutesToTime(newStartMinutes);
    const newEndTime = formatMinutesToTime(newEndMinutes);

    const updatedBlock = { ...block, startTime: newStartTime, endTime: newEndTime };

    // Notify parent about the move
    onTimeBlockMove(updatedBlock);

    // Calculate snapped absolute Y position
    const snappedY = (newStartMinutes / 60) * hourHeight;

    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: snappedY },
    }));

    // Reset dragging state after a short delay
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
