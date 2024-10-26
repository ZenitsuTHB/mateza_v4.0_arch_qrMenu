// src/components/Timeline/Timeline.jsx

import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { FaGripHorizontal, FaThumbtack  } from 'react-icons/fa';
import useBlockPositions from './Hooks/useBlockPositions';
import useTimelineSettings from './Hooks/useTimeSettings';
import useDragHandlers from './Hooks/useDragHandlers';
import { parseTime } from './Utils/timeUtils';
import './css/timeline.css';

const Timeline = ({ timeBlocks, zoomLevel, onTimeBlockClick, onTimeBlockMove }) => {
  const [hiddenBefore, setHiddenBefore] = useState(null);
  const scrollableRef = useRef(null);
  
  const hourHeight = 60 * zoomLevel;
  const { hourInterval, snappingIntervalMinutes, hours } = useTimelineSettings(zoomLevel);
  const [blockPositions, setBlockPositions] = useBlockPositions(timeBlocks, hourHeight);
  const { dragging, handleDragStart, handleDrag, handleDragStop } = useDragHandlers(
    hourHeight,
    snappingIntervalMinutes,
    onTimeBlockMove
  );

  // Calculate the container height based on hiddenBefore
  const containerHeight = hiddenBefore !== null
    ? (24 - hiddenBefore) * hourHeight
    : 24 * hourHeight;

  // Calculate the pixel offset based on hiddenBefore
  const pixelOffset = hiddenBefore !== null ? hiddenBefore * hourHeight : 0;

  // Handle scrolling when hiddenBefore changes
  useEffect(() => {
    if (scrollableRef.current) {
      if (hiddenBefore !== null) {
        const scrollTop = hiddenBefore * hourHeight;
        scrollableRef.current.scrollTop = scrollTop;
      } else {
        scrollableRef.current.scrollTop = 0;
      }
    }
  }, [hiddenBefore, hourHeight]);

  const handleClick = (block, event) => {
    if (dragging) {
      event.stopPropagation();
      return;
    }
    onTimeBlockClick(block);
  };

  const handleEyeClick = (hour, event) => {
    event.stopPropagation();
    if (hiddenBefore === hour) {
      setHiddenBefore(null); // Show all
      console.log(`Showing all times again`);
    } else {
      setHiddenBefore(hour); // Hide before this hour
      console.log(`Hiding times before hour: ${hour}`);
    }
  };

  // Filter hours based on hiddenBefore
  const filteredHours = hiddenBefore !== null
    ? hours.filter(hour => hour >= hiddenBefore)
    : hours;

  // Filter timeBlocks based on hiddenBefore
  // Hide any time block that starts before hiddenBefore
  const filteredTimeBlocks = hiddenBefore !== null
    ? timeBlocks.filter(block => parseTime(block.startTime) >= hiddenBefore)
    : timeBlocks;

  return (
    <div className="timeline">
      <div className="timeline-scrollable" ref={scrollableRef}>
        <div className="timeline-container" style={{ height: `${containerHeight}px` }}>
          {filteredHours.map((hour, index) => (
            <div
              key={index}
              className="timeline-hour"
              style={{
                top: `${(hour - (hiddenBefore || 0)) * hourHeight}px`, // Adjusted top position
                height: `${hourHeight * hourInterval}px`,
              }}
            >
              <div className="hour-label">
                {hiddenBefore === hour ? (
                  <FaThumbtack
                    className="hour-eye active"
                    onClick={(e) => handleEyeClick(hour, e)}
                  />
                ) : (
                  <FaThumbtack
                    className="hour-eye"
                    onClick={(e) => handleEyeClick(hour, e)}
                  />
                )}
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
          {filteredTimeBlocks.map((block) => {
            const position = blockPositions[block._id] || { x: 0, y: 0 };

            // Adjust position based on hiddenBefore
            const adjustedY = hiddenBefore !== null
              ? position.y - pixelOffset
              : position.y;

            const adjustedPosition = { x: position.x, y: adjustedY };

            const blockDurationMinutes =
              parseTime(block.endTime) - parseTime(block.startTime);
            const blockHeight = (blockDurationMinutes / 60) * hourHeight;

            return (
              <Draggable
                axis="y"
                bounds="parent"
                onStart={handleDragStart}
                onDrag={(e, data) => handleDrag(e, data, block, setBlockPositions)}
                onStop={(e, data) => handleDragStop(e, data, block, setBlockPositions)}
                key={block._id + block.startTime + block.endTime}
                position={adjustedPosition}
                handle=".grip-handle"
              >
                <div
                  className="time-block"
                  style={{
                    height: `${blockHeight}px`,
                    backgroundColor: block.kleurInstelling,
                    transition: 'transform 0.2s ease-in-out',
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
