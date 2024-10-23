// src/components/Timeline/Timeline.jsx

import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { FaGripHorizontal } from 'react-icons/fa';
import './css/timeline.css';

const Timeline = ({ timeBlocks, zoomLevel, onTimeBlockClick, onTimeBlockMove }) => {
  const [dragging, setDragging] = useState(false);
  const dragTimeoutRef = useRef(null); // Reference to manage timeout for distinguishing click and drag

  const hourHeight = 60 * zoomLevel;
  const hours = [];

  let hourInterval;
  if (zoomLevel === 1) {
    hourInterval = 0.5; // Show every half hour
  } else if (zoomLevel === 2) {
    hourInterval = 0.25; // Show every quarter hour
  } else if (zoomLevel === 0.5) {
    hourInterval = 1; // Show every hour
  } else if (zoomLevel === 0.25) {
    hourInterval = 2; // Show every two hours
  } else {
    hourInterval = 1; // Default hour interval
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

  const handleDragStart = () => {
    setDragging(true);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current); // Clear any pending timeouts
    }
  };

  const handleDragStop = (e, data, block) => {
    const newStartDecimal = data.y / hourHeight;
    const newStartMinutes = Math.round(newStartDecimal * 60);
    const duration = parseTime(block.endTime) - parseTime(block.startTime);
    const newEndMinutes = newStartMinutes + duration;

    const newStartTime = formatMinutesToTime(newStartMinutes);
    const newEndTime = formatMinutesToTime(newEndMinutes);

    const updatedBlock = { ...block, startTime: newStartTime, endTime: newEndTime };

    onTimeBlockMove(updatedBlock);

    // Use a slight delay to allow drag to finish before re-enabling click events
    dragTimeoutRef.current = setTimeout(() => setDragging(false), 200); // 200ms timeout before re-enabling click
  };

  const handleClick = (block, event) => {
    if (dragging) {
      event.stopPropagation(); // Prevent click event if currently dragging
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
              style={{ top: `${hour * hourHeight}px`, height: `${hourHeight * hourInterval}px` }}
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
            const [startHour, startMinute] = block.startTime.split(':').map(Number);
            const [endHour, endMinute] = block.endTime.split(':').map(Number);
            const startDecimal = startHour + startMinute / 60;
            const endDecimal = endHour + endMinute / 60;
            const topPosition = startDecimal * hourHeight;
            const blockHeight = (endDecimal - startDecimal) * hourHeight;

            return (
              <Draggable
                axis="y"
                bounds="parent"
                onStart={handleDragStart}
                onStop={(e, data) => handleDragStop(e, data, block)}
                key={block._id + block.startTime + block.endTime}
                position={{ x: 0, y: topPosition }}
                handle=".grip-handle"
              >
                <div
                  className="time-block"
                  style={{
                    height: `${blockHeight}px`,
                    backgroundColor: block.kleurInstelling,
                  }}
                  onClick={(event) => handleClick(block, event)} // Use event to prevent clicks while dragging
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
