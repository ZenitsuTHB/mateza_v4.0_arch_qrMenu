// src/components/Timeline/Timeline.jsx

import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { FaGripHorizontal } from 'react-icons/fa';
import useBlockPositions from './Hooks/useBlockPositions';
import './css/timeline.css';

const Timeline = ({ timeBlocks, zoomLevel, onTimeBlockClick, onTimeBlockMove }) => {
  const [dragging, setDragging] = useState(false);
  const dragTimeoutRef = useRef(null);

  const hourHeight = 60 * zoomLevel;
  const hours = [];

  // Determine the hour interval and snapping interval based on zoom level
  let hourInterval;
  let snappingIntervalMinutes;
  if (zoomLevel === 2) {
    hourInterval = 0.25; // 15 minutes
    snappingIntervalMinutes = 15;
  } else if (zoomLevel === 1) {
    hourInterval = 0.5; // 30 minutes
    snappingIntervalMinutes = 30;
  } else if (zoomLevel === 0.5) {
    hourInterval = 1; // 60 minutes
    snappingIntervalMinutes = 60;
  } else if (zoomLevel === 0.25) {
    hourInterval = 2; // 120 minutes
    snappingIntervalMinutes = 120;
  } else {
    hourInterval = 1; // Default to 60 minutes
    snappingIntervalMinutes = 60;
  }

  for (let i = 0; i <= 24; i += hourInterval) {
    hours.push(i);
  }

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatMinutesToTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    if (hours >= 24) {
      hours = 23;
      minutes = 59;
    } else if (hours < 0) {
      hours = 0;
      minutes = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const roundToNearestInterval = (minutes, interval) => {
    return Math.round(minutes / interval) * interval;
  };

  // Use the custom hook for block positions
  const [blockPositions, setBlockPositions] = useBlockPositions(timeBlocks, hourHeight);

  const handleDragStart = () => {
    setDragging(true);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  };

  const handleDrag = (e, data, block) => {
    // Update the position in state during dragging
    setBlockPositions((prevPositions) => ({
      ...prevPositions,
      [block._id]: { x: 0, y: data.y },
    }));
  };

  const handleDragStop = (e, data, block) => {
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

  const handleClick = (block, event) => {
    if (dragging) {
      event.stopPropagation();
      return;
    }
    onTimeBlockClick(block);
  };

  return (
    <div className="timeline">
      <div className="timeline-scrollable">
        <div className="timeline-container" style={{ height: `${24 * hourHeight}px` }}>
          {hours.map((hour, index) => (
            <div
              key={index}
              className="timeline-hour"
              style={{
                top: `${hour * hourHeight}px`,
                height: `${hourHeight * hourInterval}px`,
              }}
            >
              <div className="hour-label">
                {`${String(Math.floor(hour)).padStart(2, '0')}:${
                  hour % 1 === 0.5
                    ? '30'
                    : hour % 1 === 0.25
                    ? '15'
                    : hour % 1 === 0.75
                    ? '45'
                    : '00'
                }`}
              </div>
              <div className="hour-line"></div>
            </div>
          ))}
          {timeBlocks.map((block) => {
            const position = blockPositions[block._id] || { x: 0, y: 0 };

            const blockDurationMinutes =
              parseTime(block.endTime) - parseTime(block.startTime);
            const blockHeight = (blockDurationMinutes / 60) * hourHeight;

            return (
              <Draggable
                axis="y"
                bounds="parent"
                onStart={handleDragStart}
                onDrag={(e, data) => handleDrag(e, data, block)}
                onStop={(e, data) => handleDragStop(e, data, block)}
                key={block._id + block.startTime + block.endTime}
                position={position}
                handle=".grip-handle"
              >
                <div
                  className="time-block"
                  style={{
                    height: `${blockHeight}px`,
                    backgroundColor: block.kleurInstelling,
                    transition: 'transform 0.2s ease-in-out', // Smooth transition when snapping
                  }}
                  onClick={(event) => handleClick(block, event)}
                >
                  <div className="time-block-title">
                    {block.title}{' '}
                    <span className="time-block-time">
                      {`${block.startTime} - ${block.endTime}`}
                    </span>
                  </div>
                  <div className="grip-handle">
                    <FaGripHorizontal />
                  </div>
                </div>
              </Draggable>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
