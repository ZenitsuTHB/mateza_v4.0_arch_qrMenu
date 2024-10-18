// src/components/Timeline/Timeline.jsx

import React from 'react';
import './css/timeline.css';

const Timeline = ({ timeBlocks, zoomLevel, onTimeBlockClick }) => {
  const hourHeight = 60 * zoomLevel;
  const hours = [];
  const hourInterval = zoomLevel >= 1 ? 1 / zoomLevel : 1;

  for (let i = 0; i <= 24; i += hourInterval) {
    hours.push(i);
  }

  return (
    <div className="timeline">
      <div className="timeline-scrollable">
        <div className="timeline-container" style={{ height: `${24 * hourHeight}px` }}>
          {hours.map((hour, index) => (
            <div
              key={index}
              className="timeline-hour"
              style={{ top: `${hour * hourHeight}px`, height: `${hourHeight}px` }}
            >
              <div className="hour-label">
                {`${String(Math.floor(hour)).padStart(2, '0')}:00`}
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
              <div
                key={block.id}
                className="time-block"
                style={{
                  top: `${topPosition}px`,
                  height: `${blockHeight}px`,
                  backgroundColor: block.color,
                }}
                onClick={() => onTimeBlockClick(block)}
              >
                <div className="time-block-title">{block.title}</div>
                <div className="time-block-time">{`${block.startTime} - ${block.endTime}`}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
