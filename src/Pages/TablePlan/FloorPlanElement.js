import React, { useState, useEffect } from 'react';
import Table from './Table.js';
import Walls from './Walls.js';

const FloorPlanElement = ({
  element,
  moveElement,
  floorPlanSize,
  tableNumber, // **Add tableNumber to the props**
}) => {
  const [position, setPosition] = useState({ x: element.x, y: element.y });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const snapToGrid = (x, y, gridSize = 50) => {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return [snappedX, snappedY];
  };

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

        // No alignment or snapping during dragging
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);

        // Apply snapping on mouse release for non-wall elements
        if (element.type !== 'wall') {
          const [snappedX, snappedY] = snapToGrid(position.x, position.y);
          const finalX = Math.max(0, Math.min(snappedX, floorPlanSize.width - element.width));
          const finalY = Math.max(0, Math.min(snappedY, floorPlanSize.height - element.height));

          setPosition({ x: finalX, y: finalY });
          moveElement(element.id, finalX, finalY);
        } else {
          // For walls, no snapping
          moveElement(element.id, position.x, position.y);
        }

        // Removed onDragEnd call
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging,
    offset,
    position,
    moveElement,
    element.id,
    floorPlanSize,
    element.width,
    element.height,
    element.type,
  ]);

  useEffect(() => {
    setPosition({ x: element.x, y: element.y });
  }, [element.x, element.y]);

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
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
        // **Pass tableNumber to the Table component**
        <Table numberOfGuests={element.capacity} tableNumber={tableNumber} />
      ) : element.type === 'wall' ? (
        <Walls length={element.width / 20 + 1} />
      ) : null}
    </div>
  );
};

export default FloorPlanElement;
