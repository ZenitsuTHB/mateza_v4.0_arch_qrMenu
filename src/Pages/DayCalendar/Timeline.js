// src/components/Timeline/Timeline.jsx

import React from 'react';
import Draggable from 'react-draggable';
import { FaGripHorizontal } from 'react-icons/fa';
import useBlockPositions from './Hooks/useBlockPositions';
import useTimelineSettings from './Hooks/useTimeSettings';
import useDragHandlers from './Hooks/useDragHandlers';
import { parseTime } from './Utils/timeUtils';
import './css/timeline.css';

const Timeline = ({ timeBlocks, zoomLevel, onTimeBlockClick, onTimeBlockMove }) => {
  const hourHeight = 60 * zoomLevel;
  const { hourInterval, snappingIntervalMinutes, hours } = useTimelineSettings(zoomLevel);
  const [blockPositions, setBlockPositions] = useBlockPositions(timeBlocks, hourHeight);
  const { dragging, handleDragStart, handleDrag, handleDragStop } = useDragHandlers(
    hourHeight,
    snappingIntervalMinutes,
    onTimeBlockMove
  );

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
                onDrag={(e, data) => handleDrag(e, data, block, setBlockPositions)}
                onStop={(e, data) => handleDragStop(e, data, block, setBlockPositions)}
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
