// FloorPlanElement.js
import React, { useState, useEffect } from 'react';
import Table from './Table.js';
import Walls from './Walls.js';

const FloorPlanElement = ({ element, moveElement, floorPlanSize }) => {
  const [position, setPosition] = useState({ x: element.x, y: element.y });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        // Constrain within floor plan boundaries
        newX = Math.max(0, Math.min(newX, floorPlanSize.width - element.width));
        newY = Math.max(0, Math.min(newY, floorPlanSize.height - element.height));

        setPosition({
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        moveElement(element.id, position.x, position.y);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, position, moveElement, element.id, floorPlanSize, element.width, element.height]);

  useEffect(() => {
    setPosition({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  const style = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: element.width,
    height: element.height,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    transition: isDragging ? 'none' : 'left 0.2s, top 0.2s',
    zIndex: isDragging ? 1000 : 'auto', // Bring to front when dragging
  };

  return (
    <div
      className="table-plan-component floor-plan-element"
      onMouseDown={handleMouseDown}
      style={style}
    >
      {element.type === 'table' ? (
        <Table numberOfGuests={element.capacity} />
      ) : element.type === 'wall' ? (
        <Walls length={element.width / 20 + 1} />
      ) : null}
    </div>
  );
};

export default FloorPlanElement;
